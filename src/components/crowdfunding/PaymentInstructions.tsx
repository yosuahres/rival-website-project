"use client";

import Image from "next/image";
import { useState } from "react";
import { instructionsFor } from "@/lib/crowdfunding/payment-instructions";
import type { PaymentMethod } from "./PaymentMethodPicker";

export interface Charge {
  invoice_number: string;
  amount: number;
  payment_method: string;
  reference: string;
  payment_url: string;
  va_number: string | null;
  qr_string: string | null;
  expires_at: string | null;
}

const formatRupiah = (val: number) => `Rp${val.toLocaleString("id-ID")}`;

/** `7007014001499138` reads as `7007 0140 0149 9138` — easier to copy by eye. */
function groupDigits(value: string): string {
  return value
    .replace(/\s+/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

/**
 * The "Instruksi Pembayaran" screen: what to pay, where to pay it, and how.
 *
 * Duitku's own `paymentUrl` carries the same information, but sending a donor
 * off-site mid-payment tends to lose them — so the virtual account number and
 * the per-bank steps are rendered here, with the hosted page kept as a
 * secondary route rather than the only one.
 */
export default function PaymentInstructions({
  charge,
  method,
  onCheckStatus,
  checking,
  checkMessage,
}: {
  charge: Charge;
  method: PaymentMethod | null;
  /** Asks Duitku directly whether the payment has landed. */
  onCheckStatus: () => void;
  checking: boolean;
  checkMessage: string;
}) {
  const [copied, setCopied] = useState(false);
  const [openTab, setOpenTab] = useState(0);

  const tabs = instructionsFor(charge.payment_method, charge.va_number);
  const channelName = method?.paymentName ?? "Metode pembayaran";

  const copy = async () => {
    if (!charge.va_number) return;
    try {
      await navigator.clipboard.writeText(charge.va_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context, or the user declined) — the
      // number is on screen and selectable either way.
    }
  };

  return (
    <section className="w-full rounded-2xl border border-white/10 bg-surface p-5 sm:p-6">
      <h3 className="text-xl font-bold text-white">Instruksi Pembayaran</h3>

      <div className="mt-5">
        <p className="text-sm font-medium text-white/70">Total Pembayaran</p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
          <p className="flex-1 rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-xl font-bold text-white">
            {formatRupiah(charge.amount)}
          </p>
          <a
            href={charge.payment_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
          >
            {charge.va_number
              ? "Buka halaman Duitku"
              : "Lanjutkan ke pembayaran"}
          </a>
        </div>
      </div>

      {charge.va_number && (
        <div className="mt-6">
          <p className="text-sm font-medium text-white/70">Atau transfer ke</p>

          <div className="mt-2 flex items-center gap-3">
            {method && (
              <span className="flex h-9 w-16 shrink-0 items-center justify-center rounded-md bg-white p-1">
                <Image
                  src={method.paymentImage}
                  alt={method.paymentName}
                  width={96}
                  height={36}
                  className="h-full w-full object-contain"
                  unoptimized
                />
              </span>
            )}
            <span className="text-sm font-medium text-white">
              {channelName}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-brand-soft/40 bg-black/30 px-4 py-3">
            <span className="select-all font-mono text-lg font-bold tracking-wider text-white sm:text-xl">
              {groupDigits(charge.va_number)}
            </span>
            <button
              type="button"
              onClick={copy}
              aria-label="Salin nomor virtual account"
              className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-brand-soft transition-colors hover:bg-brand-hover/10"
            >
              <CopyIcon />
              {copied ? "Tersalin" : "Salin"}
            </button>
          </div>

          <p className="mt-3 flex items-start gap-2 rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-xs leading-relaxed text-amber-100">
            <WarnIcon />
            <span>
              Transfer tepat sebesar {formatRupiah(charge.amount)}. Nominal yang
              berbeda tidak akan terkonfirmasi otomatis.
            </span>
          </p>
        </div>
      )}

      <div className="mt-7">
        <p className="text-sm font-bold text-white">Cara Membayar</p>

        <div className="mt-3 divide-y divide-white/10 rounded-xl border border-white/15">
          {tabs.map((tab, index) => {
            const open = openTab === index;
            return (
              <div key={tab.title}>
                <button
                  type="button"
                  onClick={() => setOpenTab(open ? -1 : index)}
                  aria-expanded={open}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-3.5 text-left"
                >
                  <span className="text-sm font-semibold text-white">
                    {tab.title}
                  </span>
                  <span
                    className={`shrink-0 text-white/50 transition-transform ${open ? "rotate-180" : ""}`}
                  >
                    <ChevronIcon />
                  </span>
                </button>

                {open && (
                  <ol className="flex list-decimal flex-col gap-2 px-8 pb-4 text-xs leading-relaxed text-white/70">
                    {tab.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-3 border-t border-white/10 pt-5">
        <p className="flex items-center gap-2 text-xs text-white/50">
          <span className="h-2 w-2 animate-pulse rounded-full bg-brand-soft" />
          Menunggu pembayaran — halaman ini akan diperbarui otomatis.
        </p>

        <p className="text-center text-xs text-white/50">
          Sudah membayar tapi status belum berubah? Klik tombol di bawah untuk
          memeriksa langsung ke penyedia pembayaran.
        </p>

        <button
          type="button"
          onClick={onCheckStatus}
          disabled={checking}
          className="cursor-pointer rounded-full border border-white/25 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/50 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {checking ? "Memeriksa..." : "Saya sudah bayar — Cek status"}
        </button>

        {checkMessage && (
          <p className="text-center text-xs text-white/60">{checkMessage}</p>
        )}
      </div>

      <dl className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4 text-xs">
        <div className="flex items-center justify-between gap-4 py-0.5">
          <dt className="text-white/50">Invoice</dt>
          <dd className="font-mono text-white">{charge.invoice_number}</dd>
        </div>
        <div className="flex items-center justify-between gap-4 py-0.5">
          <dt className="text-white/50">Referensi Duitku</dt>
          <dd className="font-mono text-white">{charge.reference}</dd>
        </div>
      </dl>
    </section>
  );
}

function CopyIcon() {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function WarnIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 shrink-0"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
