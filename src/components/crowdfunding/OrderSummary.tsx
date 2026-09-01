"use client";

/**
 * The sticky right-hand rail of the checkout: what is being paid for, and how
 * much. Mirrors the order card tiket.com keeps beside the payment step so the
 * donor never has to scroll back to check what they picked.
 */
export default function OrderSummary({
  invoiceNumber,
  amount,
  packageName,
  perks,
  children,
}: {
  invoiceNumber: string;
  amount: number;
  packageName: string;
  perks?: string[];
  /** Call to action, rendered under the total. */
  children?: React.ReactNode;
}) {
  const formatRupiah = (val: number) => `Rp${val.toLocaleString("id-ID")}`;

  return (
    <aside className="flex w-full flex-col gap-4 rounded-2xl border border-white/10 bg-surface p-5 lg:sticky lg:top-6">
      <p className="text-xs text-white/50">
        Invoice ID:{" "}
        <span className="font-mono text-white/80">{invoiceNumber}</span>
      </p>

      <div className="rounded-xl border border-white/15 bg-brand-panel p-4">
        <p className="text-sm font-bold text-white">{packageName}</p>
        <p className="mt-1 text-xs text-white/60">
          Donasi untuk RIVAL ITS — #ChaseTheDream
        </p>

        {perks && perks.length > 0 && (
          <ul className="mt-3 flex list-disc flex-col gap-1 pl-4 text-xs leading-relaxed text-white/60">
            {perks.map((perk) => (
              <li key={perk}>{perk}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-dashed border-white/20 pt-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-white/70">
            Total Pembayaran
          </span>
          <span className="text-lg font-bold text-brand-soft">
            {formatRupiah(amount)}
          </span>
        </div>
      </div>

      {children}
    </aside>
  );
}
