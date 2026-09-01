import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const invoiceNumber = searchParams.get("invoice");

    if (!invoiceNumber) {
      return NextResponse.json(
        { error: "Missing invoice number." },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const { data: donation, error } = await supabase
      .from("donations")
      .select("id, payment_status, amount")
      .eq("invoice_number", invoiceNumber)
      .single();

    if (error || !donation) {
      return NextResponse.json(
        { error: "Donation not found." },
        { status: 404 },
      );
    }

    // The stored status is the only source of truth. It is written either by
    // /api/duitku/callback or, on the manual flow, by an admin who checked the
    // transfer proof. Deliberately never asks Duitku directly: this is polled
    // every few seconds by the support page, and Duitku's transactionStatus
    // endpoint blocks the caller for about an hour once its rate limit is hit.
    return NextResponse.json({
      status: donation.payment_status || "pending",
      amount: donation.amount,
    });
  } catch (err) {
    console.error("Payment status check error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
