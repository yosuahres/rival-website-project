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

    // Payments are verified manually from the uploaded transfer proof,
    // so the stored status is the only source of truth.
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
