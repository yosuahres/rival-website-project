"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiUrl } from "@/lib/crowdfunding/api";
import type { SiteSettings } from "@/lib/crowdfunding/settings";

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

/** Digits only — the input shows a grouped number, the form submits the raw value. */
function toDigits(value: string) {
  return value.replace(/\D/g, "");
}

function group(digits: string) {
  return digits ? Number(digits).toLocaleString("id-ID") : "";
}

interface AmountFieldProps {
  id: string;
  label: string;
  hint: string;
  value: string;
  onChange: (digits: string) => void;
}

function AmountField({ id, label, hint, value, onChange }: AmountFieldProps) {
  return (
    <div className="flex-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 focus-within:border-gray-400">
        <span className="shrink-0 text-sm text-gray-400">Rp</span>
        <input
          id={id}
          inputMode="numeric"
          value={group(value)}
          onChange={(e) => onChange(toDigits(e.target.value))}
          placeholder="0"
          className="w-full min-w-0 border-0 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />
      </div>
      <p className="mt-1 text-xs text-gray-500">{hint}</p>
    </div>
  );
}

export default function ProgressSettingsForm({
  settings,
}: {
  settings: SiteSettings;
}) {
  const router = useRouter();

  const [current, setCurrent] = useState(String(settings.current_amount));
  const [goal, setGoal] = useState(String(settings.goal_amount));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{
    kind: "ok" | "error";
    text: string;
  } | null>(null);

  const currentValue = Number(current || 0);
  const goalValue = Number(goal || 0);
  const percentage =
    goalValue > 0 ? Math.min((currentValue / goalValue) * 100, 100) : 0;

  const dirty =
    currentValue !== settings.current_amount ||
    goalValue !== settings.goal_amount;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage(null);

    try {
      const res = await fetch(apiUrl("/api/settings"), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_amount: currentValue,
          goal_amount: goalValue,
        }),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessage({
          kind: "error",
          text: body?.error || "Gagal menyimpan pengaturan.",
        });
        return;
      }

      setMessage({
        kind: "ok",
        text: "Tersimpan. Halaman utama sudah diperbarui.",
      });
      router.refresh();
    } catch {
      setMessage({ kind: "error", text: "Network error saat menyimpan." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={save}
      className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
    >
      <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Progress Donasi BOSSSSS
        </h2>
      </div>

      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <AmountField
            id="current_amount"
            label="Dana terkumpul"
            hint="gibran kaya bossssss"
            value={current}
            onChange={setCurrent}
          />
          <AmountField
            id="goal_amount"
            label="Target dana"
            hint="ini harus lebih dari 0 klo ga error bosss"
            value={goal}
            onChange={setGoal}
          />
        </div>

        {/* Live preview of what the landing page will show. */}
        <div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-[#8eac7a] transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-gray-500">
            {rupiah.format(currentValue)} dari {rupiah.format(goalValue)} (
            {percentage.toFixed(1)}%)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={busy || !dirty || goalValue <= 0}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-40"
          >
            {busy ? "Menyimpan..." : "Simpan"}
          </button>

          {dirty && !busy && (
            <button
              type="button"
              onClick={() => {
                setCurrent(String(settings.current_amount));
                setGoal(String(settings.goal_amount));
                setMessage(null);
              }}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
          )}

          {message && (
            <span
              className={`text-sm ${message.kind === "ok" ? "text-emerald-600" : "text-red-600"}`}
            >
              {message.text}
            </span>
          )}
        </div>
      </div>
    </form>
  );
}
