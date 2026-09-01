import { NextResponse } from "next/server";
import { getDuitkuConfig, getPaymentMethods } from "@/lib/duitku";

// The channel list is amount-dependent and Duitku can toggle channels at any
// time, so nothing here is cacheable.
export const dynamic = "force-dynamic";

/**
 * GET /api/duitku/payment-methods?amount=250000
 *
 * Returns `{ enabled: false }` when no Duitku credentials are configured; the
 * support page reads that flag and falls back to the manual QRIS flow rather
 * than showing a broken picker.
 */
export async function GET(request: Request) {
  const config = getDuitkuConfig();
  if (!config) {
    return NextResponse.json({ enabled: false, methods: [] });
  }

  const amount = Number(
    new URL(request.url).searchParams.get("amount") ?? Number.NaN,
  );

  if (!Number.isInteger(amount) || amount < 5000) {
    return NextResponse.json(
      { error: "A valid amount of at least 5000 is required." },
      { status: 400 },
    );
  }

  try {
    const methods = await getPaymentMethods(config, amount);
    return NextResponse.json({ enabled: true, methods });
  } catch (err) {
    console.error("Duitku getPaymentMethod failed:", err);
    return NextResponse.json(
      { error: "Could not load payment methods. Please try again." },
      { status: 502 },
    );
  }
}
