"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/crowdfunding/api";
import type { Database } from "@/types/database.types";

type Donation = Database["public"]["Tables"]["donations"]["Row"];
type ProofFile = { path: string; signedUrl: string };
type ProofResult = {
  invoice: string;
  files: ProofFile[];
  error: string | null;
};

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-gray-400">{label}</dt>
      <dd className="text-sm break-words text-gray-800">{value || "—"}</dd>
    </div>
  );
}

/**
 * Payment proof preview. Renders inline as a sticky right-hand column on
 * desktop, and as a bottom sheet on mobile.
 */
export default function ProofPanel({
  donation,
  onClose,
}: {
  donation: Donation;
  onClose: () => void;
}) {
  const [result, setResult] = useState<ProofResult | null>(null);

  const invoice = donation.invoice_number;

  useEffect(() => {
    let cancelled = false;

    fetch(apiUrl("/api/donations/proof", { invoice }))
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok)
          throw new Error(body.error || "Gagal memuat bukti pembayaran.");
        return body;
      })
      .then((body) => {
        if (!cancelled)
          setResult({ invoice, files: body.files ?? [], error: null });
      })
      .catch((err: Error) => {
        if (!cancelled) setResult({ invoice, files: [], error: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [invoice]);

  // The result is tagged with the invoice it belongs to, so a stale result from
  // the previously selected donation reads as "still loading" instead of
  // needing a state reset inside the effect.
  const loaded = result?.invoice === invoice ? result : null;
  const loading = loaded === null;
  const files = loaded?.files ?? [];
  const error = loaded?.error ?? null;

  return (
    <>
      {/* Mobile-only backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-30 bg-black/30 lg:hidden"
        aria-hidden="true"
      />

      <aside className="fixed inset-x-0 bottom-0 z-40 flex max-h-[80vh] flex-col overflow-hidden rounded-t-2xl border border-gray-200 bg-white shadow-2xl lg:sticky lg:top-6 lg:z-auto lg:max-h-[calc(100vh-3rem)] lg:w-[360px] lg:shrink-0 lg:rounded-xl lg:shadow-sm">
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-gray-200 px-4 py-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-gray-900">
              {donation.donor_name}
            </h3>
            <p className="truncate font-mono text-xs text-gray-400">
              {invoice}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="shrink-0 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <dl className="grid grid-cols-2 gap-3 pb-4">
            <Field label="Total" value={rupiah.format(donation.amount)} />
            <Field
              label="Status"
              value={donation.payment_status ?? "pending"}
            />
            <Field label="Email" value={donation.donor_email} />
            <Field label="Telepon" value={donation.donor_phone} />
            <div className="col-span-2">
              <Field label="Alamat" value={donation.donor_address} />
            </div>
          </dl>

          <div className="border-t border-gray-100 pt-4">
            <h4 className="pb-2 text-xs font-medium tracking-wide text-gray-500 uppercase">
              Bukti Pembayaran
            </h4>

            {loading && (
              <p className="py-6 text-center text-sm text-gray-400">
                Memuat...
              </p>
            )}

            {!loading && error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            {!loading && !error && files.length === 0 && (
              <p className="py-6 text-center text-sm text-gray-400">
                Belum ada bukti pembayaran diunggah.
              </p>
            )}

            <div className="space-y-3">
              {files.map((file) =>
                file.path.toLowerCase().endsWith(".pdf") ? (
                  <div key={file.path} className="space-y-2">
                    <iframe
                      src={file.signedUrl}
                      title={`Bukti ${invoice}`}
                      className="h-72 w-full rounded-lg border border-gray-200"
                    />
                    <a
                      href={file.signedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-xs font-medium text-blue-600 hover:underline"
                    >
                      Buka PDF di tab baru
                    </a>
                  </div>
                ) : (
                  <a
                    key={file.path}
                    href={file.signedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {/* biome-ignore lint/performance/noImgElement: the src is a
                        short-lived Supabase signed URL, so it cannot go through
                        next/image — the custom loader only prefixes basePath and
                        the host is not in images.remotePatterns for signed paths. */}
                    <img
                      src={file.signedUrl}
                      alt={`Bukti pembayaran ${invoice}`}
                      className="w-full rounded-lg border border-gray-200 transition-opacity hover:opacity-90"
                    />
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
