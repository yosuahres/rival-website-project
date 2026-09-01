import { createClient as createServiceClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const TRANSFER_PROOF_BUCKET = "transfer-proofs";

// Deleting bypasses RLS (there is no DELETE policy on public.donations),
// so it needs the service role key — same as the proof upload route.
function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) return null;
  return createServiceClient(supabaseUrl, serviceRoleKey);
}

function generateInvoiceNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `DON-${timestamp}-${random}`.toUpperCase();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      donor_name,
      donor_email,
      donor_phone,
      donor_address,
      donor_gender,
      amount,
      package_id,
      campaign_id,
    } = body;

    // ── Validation ──
    if (
      !donor_name ||
      typeof donor_name !== "string" ||
      donor_name.trim().length === 0
    ) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    if (!donor_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donor_email)) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 },
      );
    }

    if (
      !donor_phone ||
      typeof donor_phone !== "string" ||
      donor_phone.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Phone number is required." },
        { status: 400 },
      );
    }

    if (
      !donor_address ||
      typeof donor_address !== "string" ||
      donor_address.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Address is required." },
        { status: 400 },
      );
    }

    if (!["male", "female", "other"].includes(donor_gender)) {
      return NextResponse.json(
        { error: "Gender must be male, female, or other." },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // ── Resolve amount ──
    let finalAmount: number;
    let resolvedCampaignId: string | null = campaign_id || null;

    if (package_id) {
      // Look up the package from donation_packages
      const { data: pkg, error: pkgError } = await supabase
        .from("donation_packages")
        .select("amount, campaign_id")
        .eq("id", package_id)
        .single();

      if (pkgError || !pkg) {
        return NextResponse.json(
          { error: "Invalid package selected." },
          { status: 400 },
        );
      }

      finalAmount = Number(pkg.amount);
      resolvedCampaignId = pkg.campaign_id ?? resolvedCampaignId;
    } else {
      // Custom amount
      const parsedAmount = Number(amount);
      if (Number.isNaN(parsedAmount) || parsedAmount < 5000) {
        return NextResponse.json(
          { error: "Minimum donation is IDR 5,000." },
          { status: 400 },
        );
      }
      finalAmount = parsedAmount;
    }

    // ── Insert into Supabase ──
    const invoice_number = generateInvoiceNumber();

    const { data, error } = await supabase
      .from("donations")
      .insert({
        campaign_id: resolvedCampaignId,
        donor_name: donor_name.trim(),
        donor_email: donor_email.trim(),
        donor_phone: donor_phone.trim(),
        donor_address: donor_address.trim(),
        donor_gender,
        amount: finalAmount,
        package_id: package_id || null,
        invoice_number,
        payment_status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to create donation. Please try again." },
        { status: 500 },
      );
    }

    // The row starts `pending`. What settles it depends on how the deployment
    // is configured: with Duitku keys the donor picks a channel and
    // /api/duitku/callback flips the status; without them they scan the static
    // QRIS code, upload a transfer proof, and an admin confirms it by hand.
    return NextResponse.json(
      {
        message: "Donation created successfully.",
        donation: data,
        payment: {
          invoice_number,
          amount: finalAmount,
        },
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Donations API error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Donation id is required." },
        { status: 400 },
      );
    }

    const supabase = getServiceClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase service role is not configured on server." },
        { status: 500 },
      );
    }

    const { data: donation, error: lookupError } = await supabase
      .from("donations")
      .select("id, invoice_number")
      .eq("id", id)
      .single();

    if (lookupError || !donation) {
      return NextResponse.json(
        { error: "Donation not found." },
        { status: 404 },
      );
    }

    // Remove the uploaded transfer proofs first so we don't orphan storage objects.
    const { data: files } = await supabase.storage
      .from(TRANSFER_PROOF_BUCKET)
      .list(donation.invoice_number);

    if (files && files.length > 0) {
      const { error: removeError } = await supabase.storage
        .from(TRANSFER_PROOF_BUCKET)
        .remove(files.map((f) => `${donation.invoice_number}/${f.name}`));

      if (removeError) {
        return NextResponse.json(
          { error: `Failed to delete transfer proofs: ${removeError.message}` },
          { status: 500 },
        );
      }
    }

    const { error: deleteError } = await supabase
      .from("donations")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Supabase delete error:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete donation." },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "Donation deleted successfully." });
  } catch (err) {
    console.error("Donation delete error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
