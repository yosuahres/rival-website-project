import Link from "next/link";
import PaymentReturn from "@/components/crowdfunding/PaymentReturn";

// Duitku redirects here with query parameters, so nothing can be prerendered.
export const dynamic = "force-dynamic";

/**
 * Duitku's `returnUrl` target.
 *
 * After the donor finishes (or abandons) a payment on the gateway's page they
 * are sent back here as
 * `/crowdfunding/payment/?merchantOrderId=...&resultCode=00&reference=...`.
 * Duitku documents resultCode as 00 success / 01 pending / 02 canceled, but it
 * arrives unsigned via the browser, so the real status comes from polling.
 */
export default async function PaymentReturnPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const first = (key: string) => {
    const value = params[key];
    return (Array.isArray(value) ? value[0] : value) ?? "";
  };

  const invoiceNumber = first("merchantOrderId");

  if (!invoiceNumber) {
    return (
      <main className="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-white">No Payment to Show</h1>
        <p className="text-sm text-white/70">
          This page is where the payment provider sends you back after a
          donation. Open it from a payment, not directly.
        </p>
        <Link
          href="/crowdfunding/support"
          className="inline-flex items-center justify-center rounded-full bg-brand px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
        >
          Make a Donation
        </Link>
      </main>
    );
  }

  return (
    <PaymentReturn
      invoiceNumber={invoiceNumber}
      reference={first("reference")}
      resultCode={first("resultCode")}
    />
  );
}
