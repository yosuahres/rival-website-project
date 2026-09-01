"use client";

import { useEffect, useState } from "react";

/** Seconds left until `deadline`, floored at zero. */
function remainingSeconds(deadline: number): number {
  return Math.max(0, Math.floor((deadline - Date.now()) / 1000));
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "Selesaikan sebelum 00:54:25" — the pressure clock every Indonesian
 * checkout puts above the payment step.
 *
 * Ticks off wall-clock time rather than counting down a stored number, so a
 * backgrounded tab (where timers are throttled) still shows the right figure
 * when the donor comes back.
 */
export default function PaymentCountdown({
  expiresAt,
  onExpire,
}: {
  expiresAt: string;
  onExpire?: () => void;
}) {
  const deadline = new Date(expiresAt).getTime();
  const valid = Number.isFinite(deadline);

  const [left, setLeft] = useState(() =>
    valid ? remainingSeconds(deadline) : 0,
  );

  useEffect(() => {
    if (!valid) return;

    setLeft(remainingSeconds(deadline));
    const id = setInterval(() => {
      const next = remainingSeconds(deadline);
      setLeft(next);
      if (next === 0) {
        clearInterval(id);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(id);
  }, [deadline, valid, onExpire]);

  if (!valid) return null;

  const hours = Math.floor(left / 3600);
  const minutes = Math.floor((left % 3600) / 60);
  const seconds = left % 60;
  const expired = left === 0;

  return (
    <div className="flex w-full items-center justify-between gap-4 rounded-2xl border border-white/10 bg-surface px-5 py-4">
      <span className="text-sm font-medium text-white">
        {expired ? "Waktu pembayaran habis" : "Selesaikan sebelum"}
      </span>

      <div className="flex items-center gap-1" aria-live="polite">
        {[hours, minutes, seconds].map((unit, i) => (
          <span
            // Positional by design: these are three fixed slots, not a list.
            key={["h", "m", "s"][i]}
            className={`flex items-center gap-1 ${expired ? "opacity-60" : ""}`}
          >
            {i > 0 && <span className="text-white/40">:</span>}
            <span className="rounded-md bg-red-500/90 px-2 py-1 font-mono text-sm font-bold tabular-nums text-white">
              {pad(unit)}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
