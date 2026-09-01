import { NextResponse } from "next/server";
import { settleDonation } from "@/lib/crowdfunding/settle";
import {
  callbackSignature,
  getDuitkuConfig,
  signaturesMatch,
} from "@/lib/duitku";
import { getServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

/**
 * Duitku posts `application/x-www-form-urlencoded`, but its own sandbox test
 * tool and some resends send JSON. Accept both.
 */
async function readParams(request: Request): Promise<Record<string, string>> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const json = await request.json();
    return Object.fromEntries(
      Object.entries(json as Record<string, unknown>).map(([k, v]) => [
        k,
        v == null ? "" : String(v),
      ]),
    );
  }

  const form = await request.formData();
  return Object.fromEntries(
    [...form.entries()].map(([k, v]) => [k, typeof v === "string" ? v : ""]),
  );
}

/**
 * POST /api/duitku/callback/
 *
 * Server-to-server payment notification. This is the only thing that flips a
 * donation to `success`, so it is authenticated by the HMAC-SHA256 signature
 * over `merchantCode + amount + merchantOrderId`, keyed by the project API
 * key — a browser cannot forge it.
 *
 * NOTE the trailing slash: `trailingSlash: true` in next.config.ts makes Next
 * answer `/api/duitku/callback` with a 308, and Duitku's sender does not
 * follow redirects. The URL registered in the merchant portal must end in `/`.
 *
 * Duitku retries up to 5 times on anything that is not HTTP 200, so a
 * genuinely-processed callback always answers 200 even when there is nothing
 * left to do.
 */
export async function POST(request: Request) {
  const config = getDuitkuConfig();
  if (!config) {
    console.error(
      "Duitku callback received but the gateway is not configured.",
    );
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  let params: Record<string, string>;
  try {
    params = await readParams(request);
  } catch {
    return NextResponse.json(
      { error: "Malformed callback body." },
      { status: 400 },
    );
  }

  const {
    merchantCode = "",
    amount = "",
    merchantOrderId = "",
    resultCode = "",
    reference = "",
    signature = "",
  } = params;

  if (!merchantCode || !amount || !merchantOrderId || !signature) {
    return NextResponse.json(
      { error: "Missing callback parameters." },
      { status: 400 },
    );
  }

  if (merchantCode !== config.merchantCode) {
    console.warn(
      `Duitku callback for a foreign merchant code: ${merchantCode}`,
    );
    return NextResponse.json({ error: "Unknown merchant." }, { status: 400 });
  }

  const expected = callbackSignature(config, amount, merchantOrderId);
  if (!signaturesMatch(signature, expected)) {
    console.warn(`Duitku callback with a bad signature for ${merchantOrderId}`);
    return NextResponse.json({ error: "Bad signature." }, { status: 400 });
  }

  const supabase = getServiceClient();
  if (!supabase) {
    // 500 so Duitku retries: the payment is real, we just cannot record it.
    console.error(
      "Duitku callback could not reach Supabase (no service role).",
    );
    return NextResponse.json(
      { error: "Storage unavailable." },
      { status: 500 },
    );
  }

  const outcome = await settleDonation(supabase, {
    invoiceNumber: merchantOrderId,
    amount: Number(amount),
    // Duitku: 00 success, anything else failed. The signature covers amount
    // and order id, so this value is trustworthy.
    status: resultCode === "00" ? "success" : "failed",
    reference,
  });

  switch (outcome.kind) {
    case "settled":
      return NextResponse.json({ received: true, status: outcome.status });

    case "already":
      // A retry, a dashboard resend, or the donor's own status check beat us
      // here. Nothing to do, but Duitku still needs its 200.
      return NextResponse.json({ received: true, alreadySettled: true });

    case "not-found":
      // A resend will not make the row appear, so do not ask for a retry.
      console.error(`Duitku callback for unknown invoice ${merchantOrderId}`);
      return NextResponse.json({ received: true, matched: false });

    case "amount-mismatch":
      console.error(
        `Duitku callback amount ${outcome.received} does not match donation ${merchantOrderId} (${outcome.expected}).`,
      );
      return NextResponse.json({ received: true, matched: false });

    default:
      // "error" and "unchanged". A database failure has to return 500 so
      // Duitku retries — answering 200 would drop the payment silently.
      console.error(`Failed to settle ${merchantOrderId}:`, outcome);
      return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
}
