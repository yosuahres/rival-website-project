import { NextResponse } from "next/server";
import { settleDonation } from "@/lib/crowdfunding/settle";
import { checkTransactionStatus, getDuitkuConfig } from "@/lib/duitku";
import { getServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

/**
 * Minimum gap between two transactionStatus calls for the same invoice.
 *
 * Duitku rate-limits this endpoint per merchant and blocks the caller for
 * roughly an hour once the ceiling is hit — which would take down payment
 * confirmation for every donor, not just the impatient one. Thirty seconds is
 * slow enough to make that hard to trigger by mashing the button, and fast
 * enough that a donor who just paid does not feel stuck.
 */
const CHECK_COOLDOWN_MS = 30_000;

/** Duitku: 00 success, 01 pending/process, 02 canceled/failed/expired. */
function statusFromCode(code: string): "success" | "failed" | "pending" {
  if (code === "00") return "success";
  if (code === "02") return "failed";
  return "pending";
}

/**
 * POST /api/duitku/check   Body: { invoice_number }
 *
 * Asks Duitku directly whether a donation has been paid, and settles it if so.
 *
 * The callback is still the primary path — it is pushed, signed, and free.
 * This exists for when the callback never lands: a firewall in front of the
 * site, a host that cannot receive server-to-server POSTs, or an outage during
 * which Duitku exhausted its five retries. Without it, a donor who really did
 * pay would sit on a spinner forever.
 *
 * Deliberately NOT wired to the status poll. /api/donations/status runs every
 * few seconds against our own database, which is cheap; this reaches a
 * third-party API with a punishing rate limit, so it only runs when a donor
 * asks or when the payment window closes.
 */
export async function POST(request: Request) {
  const config = getDuitkuConfig();
  if (!config) {
    return NextResponse.json(
      { error: "Payment gateway is not configured." },
      { status: 503 },
    );
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase service role is not configured on server." },
      { status: 500 },
    );
  }

  let invoiceNumber: string;
  try {
    const body = await request.json();
    invoiceNumber = String(body.invoice_number ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  if (!invoiceNumber) {
    return NextResponse.json(
      { error: "Invoice number is required." },
      { status: 400 },
    );
  }

  const { data: donation, error: lookupError } = await supabase
    .from("donations")
    .select("id, payment_status, duitku_reference, duitku_checked_at")
    .eq("invoice_number", invoiceNumber)
    .maybeSingle();

  if (lookupError) {
    console.error(`Donation lookup failed for ${invoiceNumber}:`, lookupError);
    return NextResponse.json(
      { error: "Could not read the donation." },
      { status: 502 },
    );
  }

  if (!donation) {
    return NextResponse.json({ error: "Donation not found." }, { status: 404 });
  }

  // Already decided — the callback got here first. No reason to spend a call.
  if (donation.payment_status !== "pending") {
    return NextResponse.json({
      status: donation.payment_status,
      checked: false,
      reason: "already-settled",
    });
  }

  // Nothing was ever sent to Duitku for this invoice, so there is no
  // transaction to ask about.
  if (!donation.duitku_reference) {
    return NextResponse.json({
      status: "pending",
      checked: false,
      reason: "no-transaction",
    });
  }

  const lastChecked = donation.duitku_checked_at
    ? new Date(donation.duitku_checked_at).getTime()
    : 0;
  const sinceLast = Date.now() - lastChecked;

  if (sinceLast < CHECK_COOLDOWN_MS) {
    return NextResponse.json({
      status: "pending",
      checked: false,
      reason: "cooldown",
      retry_after_seconds: Math.ceil((CHECK_COOLDOWN_MS - sinceLast) / 1000),
    });
  }

  // Stamp before the call, not after: if Duitku hangs or throws, the cooldown
  // still holds and a retry loop cannot turn one slow request into fifty.
  await supabase
    .from("donations")
    .update({ duitku_checked_at: new Date().toISOString() })
    .eq("id", donation.id);

  let result: Awaited<ReturnType<typeof checkTransactionStatus>>;
  try {
    result = await checkTransactionStatus(config, invoiceNumber);
  } catch (err) {
    console.error(`Duitku transactionStatus failed for ${invoiceNumber}:`, err);
    return NextResponse.json(
      { error: "Could not reach the payment provider. Please try again." },
      { status: 502 },
    );
  }

  const status = statusFromCode(result.statusCode);

  const outcome = await settleDonation(supabase, {
    invoiceNumber,
    // Duitku returns the amount as a string; a blank one means "do not check".
    amount: result.amount ? Number(result.amount) : null,
    status,
    reference: result.reference,
  });

  if (outcome.kind === "amount-mismatch") {
    console.error(
      `transactionStatus amount ${outcome.received} does not match donation ${invoiceNumber} (${outcome.expected}).`,
    );
    return NextResponse.json({ status: "pending", checked: true });
  }

  if (outcome.kind === "error") {
    console.error(`Failed to settle ${invoiceNumber}:`, outcome.message);
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }

  // Only reachable if the row was deleted between the lookup above and the
  // settle — an admin deleting a donation mid-check.
  if (outcome.kind === "not-found") {
    return NextResponse.json({ error: "Donation not found." }, { status: 404 });
  }

  return NextResponse.json({
    status: outcome.kind === "unchanged" ? "pending" : outcome.status,
    checked: true,
    message: result.statusMessage,
  });
}
