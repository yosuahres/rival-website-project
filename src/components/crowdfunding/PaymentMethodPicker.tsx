"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { groupPaymentMethods } from "@/lib/crowdfunding/payment-methods";

export interface PaymentMethod {
  paymentMethod: string;
  paymentName: string;
  paymentImage: string;
  totalFee: string;
}

/** How many channels sit on the card before "Lihat semua" is needed. */
const QUICK_PICK_COUNT = 3;

const formatRupiah = (val: number) => `Rp${val.toLocaleString("id-ID")}`;

/**
 * Payment-channel selector.
 *
 * A short list on the card, the full set grouped behind a modal — the shape
 * Indonesian checkouts converge on, because twenty-odd flat channels is a wall
 * of logos nobody reads. Grouping and ordering live in
 * `lib/crowdfunding/payment-methods.ts`; this file only draws them.
 */
export default function PaymentMethodPicker({
  methods,
  selected,
  onSelect,
  modalOpen,
  onModalOpenChange,
  disabled = false,
}: {
  methods: PaymentMethod[];
  selected: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
  modalOpen: boolean;
  onModalOpenChange: (open: boolean) => void;
  disabled?: boolean;
}) {
  const grouped = useMemo(() => groupPaymentMethods(methods), [methods]);

  // Flattened in group order, so the card's short list is the head of the same
  // sequence the modal shows rather than an unrelated ordering.
  const ordered = useMemo(
    () => grouped.flatMap((section) => section.methods),
    [grouped],
  );

  const quickPicks = useMemo(() => {
    const head = ordered.slice(0, QUICK_PICK_COUNT);
    // Keep a selection made inside the modal visible on the card, even when it
    // is not one of the first few.
    if (
      selected &&
      !head.some((m) => m.paymentMethod === selected.paymentMethod)
    ) {
      return [...head, selected];
    }
    return head;
  }, [ordered, selected]);

  const close = useCallback(
    () => onModalOpenChange(false),
    [onModalOpenChange],
  );

  return (
    <>
      <section className="w-full rounded-2xl border border-white/10 bg-surface p-5">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-base font-bold text-white">Metode Pembayaran</h3>
          <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-brand-soft">
            <ShieldIcon />
            Pembayaran Aman
          </span>
        </div>

        <div className="mt-4 flex flex-col">
          {quickPicks.map((method) => (
            <MethodRow
              key={method.paymentMethod}
              method={method}
              checked={selected?.paymentMethod === method.paymentMethod}
              disabled={disabled}
              onSelect={onSelect}
            />
          ))}
        </div>

        {ordered.length > quickPicks.length && (
          <>
            <div className="mt-2 border-t border-dashed border-white/15" />
            <button
              type="button"
              onClick={() => onModalOpenChange(true)}
              disabled={disabled}
              className="mt-3 flex w-full cursor-pointer items-center justify-center gap-1.5 text-sm font-semibold text-brand-soft transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Lihat semua
              <ChevronIcon />
            </button>
          </>
        )}
      </section>

      {modalOpen && (
        <MethodModal
          grouped={grouped}
          selected={selected}
          onSelect={(method) => {
            onSelect(method);
            close();
          }}
          onClose={close}
        />
      )}
    </>
  );
}

function MethodRow({
  method,
  checked,
  disabled,
  onSelect,
}: {
  method: PaymentMethod;
  checked: boolean;
  disabled: boolean;
  onSelect: (method: PaymentMethod) => void;
}) {
  const fee = Number(method.totalFee);

  return (
    <label
      className={`flex items-center gap-3 border-b border-white/10 py-3 last:border-b-0 ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
    >
      <input
        type="radio"
        name="duitku-payment-method"
        value={method.paymentMethod}
        checked={checked}
        disabled={disabled}
        onChange={() => onSelect(method)}
        className="sr-only"
      />
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          checked ? "border-brand-soft" : "border-white/40"
        }`}
      >
        {checked && <span className="h-2.5 w-2.5 rounded-full bg-brand-soft" />}
      </span>

      <MethodLogo method={method} />

      <span className="flex-1 text-sm font-medium text-white">
        {method.paymentName}
      </span>

      {fee > 0 && (
        <span className="shrink-0 text-xs text-white/50">
          + {formatRupiah(fee)}
        </span>
      )}
    </label>
  );
}

function MethodLogo({ method }: { method: PaymentMethod }) {
  return (
    <span className="flex h-8 w-14 shrink-0 items-center justify-center rounded-md bg-white p-1">
      <Image
        src={method.paymentImage}
        alt={method.paymentName}
        width={96}
        height={32}
        className="h-full w-full object-contain"
        // Duitku's logo CDN is not on the optimizer's allowlist and these are
        // already small, so serve them as-is.
        unoptimized
      />
    </span>
  );
}

function MethodModal({
  grouped,
  selected,
  onSelect,
  onClose,
}: {
  grouped: ReturnType<typeof groupPaymentMethods<PaymentMethod>>;
  selected: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape closes, and the body must not scroll behind the sheet.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* A real button, so dismissing by backdrop is keyboard-reachable and
          screen readers announce it rather than seeing a clickable div. */}
      <button
        type="button"
        aria-label="Tutup pilihan metode pembayaran"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-modal-title"
        tabIndex={-1}
        className="relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-surface shadow-2xl outline-none"
      >
        <header className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
          <h2 id="payment-modal-title" className="text-lg font-bold text-white">
            Pilih metode pembayaran
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="flex flex-col gap-7 overflow-y-auto px-6 py-6">
          {grouped.map((section) => (
            <section key={section.group.id}>
              <h3 className="text-sm font-bold text-white">
                {section.group.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-white/50">
                {section.group.description}
              </p>

              <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {section.methods.map((method) => {
                  const isSelected =
                    selected?.paymentMethod === method.paymentMethod;
                  const fee = Number(method.totalFee);

                  return (
                    <button
                      key={method.paymentMethod}
                      type="button"
                      onClick={() => onSelect(method)}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                        isSelected
                          ? "border-brand-soft bg-brand-soft/10"
                          : "border-white/15 bg-white/5 hover:border-white/40"
                      }`}
                    >
                      <MethodLogo method={method} />
                      <span className="flex min-w-0 flex-1 flex-col">
                        {/* Two lines rather than an ellipsis: "Mandiri Virtual
                            Account" does not fit one column at this width. */}
                        <span className="line-clamp-2 text-sm font-medium text-white">
                          {method.paymentName}
                        </span>
                        {fee > 0 && (
                          <span className="text-[11px] text-white/50">
                            Biaya {formatRupiah(fee)}
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg
      aria-hidden="true"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
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

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
