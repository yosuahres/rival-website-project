import { NextResponse } from "next/server";
import { expiryMinutesFor } from "@/lib/crowdfunding/payment-methods";
import { getDuitkuConfig, requestTransaction } from "@/lib/duitku";
import { getServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

/** Duitku caps customerVaName at 20 chars and banks reject punctuation. */
function vaName(name: string): string {
  const cleaned = name
    .replace(/[^A-Za-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return (cleaned || "DONATUR RIVAL").slice(0, 20);
}

/**
 * POST /api/duitku/transaction
 * Body: { invoice_number, payment_method }
 *
 * Turns an already-created (pending) donation into a Duitku transaction and
 * hands back the virtual-account number / QR string / hosted payment URL. The
 * donation row is the source of truth for the amount — the browser only names
 * the invoice, so a tampered client cannot pay a different figure than the one
 * that was recorded.
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

  try {
    const body = await request.json();
    const invoiceNumber = String(body.invoice_number ?? "").trim();
    const paymentMethod = String(body.payment_method ?? "")
      .trim()
      .toUpperCase();

    if (!invoiceNumber) {
      return NextResponse.json(
        { error: "Invoice number is required." },
        { status: 400 },
      );
    }

    // Every Duitku channel code is exactly two characters.
    if (!/^[A-Z0-9]{2}$/.test(paymentMethod)) {
      return NextResponse.json(
        { error: "A valid payment method is required." },
        { status: 400 },
      );
    }

    const { data: donation, error: lookupError } = await supabase
      .from("donations")
      .select(
        "id, invoice_number, amount, payment_status, donor_name, donor_email, donor_phone, donor_address, duitku_reference, duitku_payment_method, duitku_va_number, duitku_payment_url, duitku_qr_string, duitku_expires_at",
      )
      .eq("invoice_number", invoiceNumber)
      // maybeSingle, not single: single() reports "no rows" as an error, which
      // would make a genuinely missing invoice look like a failed query.
      .maybeSingle();

    // Distinguish "no such row" from "the query itself failed". They are very
    // different problems and collapsing both into a 404 sends you hunting for
    // a missing donation when the real cause is usually a schema that has not
    // had the duitku_* columns added yet (Postgres 42703).
    if (lookupError) {
      const missingColumn = lookupError.code === "42703";
      console.error(
        `Donation lookup failed for ${invoiceNumber}:`,
        lookupError,
      );
      return NextResponse.json(
        {
          error: missingColumn
            ? "The donations table is missing the duitku_* columns. Run the alter table block in supabase/schema.sql."
            : "Could not read the donation.",
        },
        { status: missingColumn ? 500 : 502 },
      );
    }

    if (!donation) {
      return NextResponse.json(
        { error: "Donation not found." },
        { status: 404 },
      );
    }

    if (donation.payment_status !== "pending") {
      return NextResponse.json(
        {
          error: `This donation is already marked ${donation.payment_status}.`,
        },
        { status: 409 },
      );
    }

    // Re-picking the same channel replays the stored transaction. Duitku
    // rejects a repeated merchantOrderId, so this is the only way a donor who
    // reloads the page keeps seeing their VA number.
    if (
      donation.duitku_reference &&
      donation.duitku_payment_method === paymentMethod
    ) {
      return NextResponse.json({
        payment: {
          invoice_number: donation.invoice_number,
          amount: Number(donation.amount),
          payment_method: paymentMethod,
          reference: donation.duitku_reference,
          payment_url: donation.duitku_payment_url,
          va_number: donation.duitku_va_number,
          qr_string: donation.duitku_qr_string,
          expires_at: donation.duitku_expires_at,
        },
      });
    }

    // A different channel needs a fresh merchantOrderId, which we do not have:
    // the invoice number is the order id. Tell the donor to start over rather
    // than silently failing at the gateway.
    if (donation.duitku_reference) {
      return NextResponse.json(
        {
          error:
            "A payment was already started for this donation with another method. Please start a new donation to switch method.",
        },
        { status: 409 },
      );
    }

    const amount = Number(donation.amount);

    // We do not send `expiryPeriod`, so Duitku applies its own per-channel
    // default. Mirroring that default here is what lets the page show a
    // countdown without a second API call — see payment-methods.ts.
    const expiresAt = new Date(
      Date.now() + expiryMinutesFor(paymentMethod) * 60_000,
    ).toISOString();

    const transaction = await requestTransaction(config, {
      merchantOrderId: donation.invoice_number,
      paymentAmount: amount,
      paymentMethod,
      productDetails: `Donasi RIVAL ITS - ${donation.invoice_number}`,
      email: donation.donor_email,
      customerVaName: vaName(donation.donor_name),
      phoneNumber: donation.donor_phone,
      customerDetail: {
        firstName: donation.donor_name,
        email: donation.donor_email,
        phoneNumber: donation.donor_phone,
        billingAddress: {
          firstName: donation.donor_name,
          address: donation.donor_address,
          countryCode: "ID",
          phone: donation.donor_phone,
        },
      },
      // Credit-card and paylater channels reject a transaction whose item
      // total does not equal paymentAmount, so keep it a single line item.
      itemDetails: [
        {
          name: `Donasi RIVAL ITS #ChaseTheDream`,
          price: amount,
          quantity: 1,
        },
      ],
    });

    const { error: updateError } = await supabase
      .from("donations")
      .update({
        duitku_reference: transaction.reference,
        duitku_payment_method: paymentMethod,
        duitku_va_number: transaction.vaNumber ?? null,
        duitku_payment_url: transaction.paymentUrl ?? null,
        duitku_qr_string: transaction.qrString ?? null,
        duitku_expires_at: expiresAt,
      })
      .eq("id", donation.id);

    if (updateError) {
      // The transaction exists at Duitku but we could not record it, so the
      // callback would arrive with nothing to match beyond the invoice number.
      // That still resolves, but the reference is worth shouting about.
      console.error(
        `Failed to store Duitku reference ${transaction.reference} for ${donation.invoice_number}:`,
        updateError,
      );
    }

    return NextResponse.json({
      payment: {
        invoice_number: donation.invoice_number,
        amount,
        payment_method: paymentMethod,
        reference: transaction.reference,
        payment_url: transaction.paymentUrl,
        va_number: transaction.vaNumber ?? null,
        qr_string: transaction.qrString ?? null,
        expires_at: expiresAt,
      },
    });
  } catch (err) {
    console.error("Duitku transaction error:", err);
    return NextResponse.json(
      { error: "Could not start the payment. Please try again." },
      { status: 502 },
    );
  }
}
