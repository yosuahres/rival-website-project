"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { apiUrl } from "@/lib/crowdfunding/api";

type Status = "pending" | "success" | "failed" | "unknown";

const POLL_INTERVAL_MS = 5000;

/**
 * Landing screen for Duitku's `returnUrl` redirect.
 *
 * The redirect carries a `resultCode`, but it comes back through the donor's
 * browser and is not signed, so it is only used to pick the first message.
 * The authoritative status is whatever the server-to-server callback has
 * already written to the donation row, which is what this polls for.
 */
export default function PaymentReturn({
  invoiceNumber,
  reference,
  resultCode,
}: {
  invoiceNumber: string;
  reference: string;
  resultCode: string;
}) {
  const [status, setStatus] = useState<Status>(
    resultCode === "02" ? "failed" : "pending",
  );
  const [amount, setAmount] = useState<number | null>(null);

  const check = useCallback(async () => {
    try {
      const res = await fetch(
        apiUrl("/api/donations/status", { invoice: invoiceNumber }),
      );
      if (!res.ok) {
        if (res.status === 404) setStatus("unknown");
        return;
      }
      const result = await res.json();
      if (typeof result.amount === "number") setAmount(result.amount);
      if (result.status === "success" || result.status === "failed") {
        setStatus(result.status);
      }
    } catch {
      // Offline or a blip — the next tick tries again.
    }
  }, [invoiceNumber]);

  useEffect(() => {
    check();
  }, [check]);

  useEffect(() => {
    if (status !== "pending") return;
    const interval = setInterval(check, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [status, check]);

  const formatRupiah = (val: number) => `Rp${val.toLocaleString("id-ID")}`;

  return (
    <main className="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6">
      {status === "success" && (
        <>
          <StatusIcon kind="success" />
          <h1 className="text-2xl font-bold text-white">Payment Successful!</h1>
          <p className="text-sm text-white/70">
            Terima kasih atas dukungan Anda untuk RIVAL ITS.
            {amount !== null && (
              <>
                {" "}
                <span className="font-bold text-brand-soft">
                  {formatRupiah(amount)}
                </span>{" "}
                telah kami terima.
              </>
            )}
          </p>
        </>
      )}

      {status === "pending" && (
        <>
          <StatusIcon kind="pending" />
          <h1 className="text-2xl font-bold text-white">Waiting for Payment</h1>
          <p className="text-sm text-white/70">
            Kami belum menerima konfirmasi dari penyedia pembayaran. Halaman ini
            akan memperbarui sendiri begitu pembayaran Anda masuk — Anda boleh
            menunggu di sini atau menutupnya, konfirmasi tetap kami proses.
          </p>
        </>
      )}

      {status === "failed" && (
        <>
          <StatusIcon kind="failed" />
          <h1 className="text-2xl font-bold text-white">
            Payment Failed or Cancelled
          </h1>
          <p className="text-sm text-white/70">
            Pembayaran Anda tidak selesai. Silakan coba lagi.
          </p>
        </>
      )}

      {status === "unknown" && (
        <>
          <StatusIcon kind="failed" />
          <h1 className="text-2xl font-bold text-white">Donation Not Found</h1>
          <p className="text-sm text-white/70">
            Kami tidak menemukan donasi dengan nomor invoice ini.
          </p>
        </>
      )}

      <dl className="w-full rounded-2xl border border-white/15 bg-black/20 p-5 text-left text-sm">
        <div className="flex items-center justify-between gap-4 py-1">
          <dt className="text-white/50">Invoice</dt>
          <dd className="font-mono text-white">{invoiceNumber}</dd>
        </div>
        {reference && (
          <div className="flex items-center justify-between gap-4 py-1">
            <dt className="text-white/50">Duitku reference</dt>
            <dd className="font-mono text-white">{reference}</dd>
          </div>
        )}
      </dl>

      <Link
        href="/crowdfunding"
        className="inline-flex items-center justify-center rounded-full bg-brand px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
      >
        Back to Crowdfunding
      </Link>

      {(status === "failed" || status === "unknown") && (
        <Link
          href="/crowdfunding/support"
          className="text-sm font-medium text-brand-soft underline-offset-4 hover:underline"
        >
          Try again
        </Link>
      )}
    </main>
  );
}

function StatusIcon({ kind }: { kind: "success" | "pending" | "failed" }) {
  const stroke =
    kind === "success" ? "#8eac7a" : kind === "pending" ? "#bdb88e" : "#f87171";

  return (
    <svg
      aria-hidden="true"
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={kind === "pending" ? "animate-pulse" : undefined}
    >
      {kind === "success" && (
        <>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </>
      )}
      {kind === "pending" && (
        <>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </>
      )}
      {kind === "failed" && (
        <>
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </>
      )}
    </svg>
  );
}
