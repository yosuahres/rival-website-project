"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import ExportExcelButton from "@/components/crowdfunding/ExportExcelButton";
import ProofPanel from "@/components/crowdfunding/ProofPanel";
import { apiUrl } from "@/lib/crowdfunding/api";
import type { Database } from "@/types/database.types";

type Donation = Database["public"]["Tables"]["donations"]["Row"];

type ColumnKey =
  | "donor"
  | "email"
  | "phone"
  | "address"
  | "gender"
  | "amount"
  | "status"
  | "date"
  | "invoice"
  | "proof";

const COLUMNS: { key: ColumnKey; label: string }[] = [
  { key: "donor", label: "Nama Lengkap" },
  { key: "email", label: "Email" },
  { key: "phone", label: "No. Telepon" },
  { key: "address", label: "Alamat" },
  { key: "gender", label: "Gender" },
  { key: "amount", label: "Total" },
  { key: "status", label: "Status Pembayaran" },
  { key: "date", label: "Tanggal" },
  { key: "invoice", label: "No. Invoice" },
  { key: "proof", label: "Bukti Pembayaran" },
];

type SortKey =
  | "date-desc"
  | "date-asc"
  | "name-asc"
  | "name-desc"
  | "amount-desc"
  | "amount-asc";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "date-desc", label: "Tanggal — terbaru" },
  { key: "date-asc", label: "Tanggal — terlama" },
  { key: "name-asc", label: "Nama — A ke Z" },
  { key: "name-desc", label: "Nama — Z ke A" },
  { key: "amount-desc", label: "Total — terbesar" },
  { key: "amount-asc", label: "Total — terkecil" },
];

const GENDER_LABEL: Record<string, string> = {
  male: "Laki-laki",
  female: "Perempuan",
  other: "Lainnya",
};

const STATUS_STYLE: Record<string, string> = {
  success: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  failed: "bg-red-50 text-red-700",
};

const STATUS_LABEL: Record<string, string> = {
  success: "Lunas",
  pending: "Menunggu",
  failed: "Gagal",
};

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

/** Placeholder for empty cells, like the em dash in the reference design. */
function Empty() {
  return <span className="text-gray-300">—</span>;
}

/** Closes a dropdown when clicking anywhere outside of it. */
function useDismiss(onDismiss: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onDismiss();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onDismiss]);

  return ref;
}

export default function DonationsTable({
  donations,
}: {
  donations: Donation[];
}) {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("date-desc");
  const [hidden, setHidden] = useState<Set<ColumnKey>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sortOpen, setSortOpen] = useState(false);
  const [colsOpen, setColsOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const sortRef = useDismiss(() => setSortOpen(false));
  const colsRef = useDismiss(() => setColsOpen(false));

  const visibleColumns = COLUMNS.filter((c) => !hidden.has(c.key));

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = q
      ? donations.filter((d) =>
          [
            d.donor_name,
            d.donor_email,
            d.donor_phone,
            d.donor_address,
            d.invoice_number,
          ]
            .join(" ")
            .toLowerCase()
            .includes(q),
        )
      : donations;

    const time = (d: Donation) =>
      d.created_at ? new Date(d.created_at).getTime() : 0;

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "date-asc":
          return time(a) - time(b);
        case "name-asc":
          return a.donor_name.localeCompare(b.donor_name);
        case "name-desc":
          return b.donor_name.localeCompare(a.donor_name);
        case "amount-desc":
          return Number(b.amount) - Number(a.amount);
        case "amount-asc":
          return Number(a.amount) - Number(b.amount);
        default:
          return time(b) - time(a);
      }
    });
  }, [donations, query, sort]);

  const active = donations.find((d) => d.id === activeId) ?? null;
  const allSelected = rows.length > 0 && rows.every((d) => selected.has(d.id));

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(rows.map((d) => d.id)));
  };

  const toggleRow = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleColumn = (key: ColumnKey) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const deleteIds = async (ids: string[], confirmMessage: string) => {
    if (!confirm(confirmMessage)) return;

    setBusy(true);

    try {
      const results = await Promise.all(
        ids.map((id) =>
          fetch(apiUrl("/api/donations", { id }), { method: "DELETE" }).then(
            async (res) => ({
              ok: res.ok,
              body: await res.json().catch(() => ({})),
            }),
          ),
        ),
      );

      const failed = results.filter((r) => !r.ok);
      if (failed.length > 0) {
        alert(
          failed[0].body?.error || `Gagal menghapus ${failed.length} data.`,
        );
      }

      if (activeId && ids.includes(activeId)) setActiveId(null);
      setSelected(new Set());
      router.refresh();
    } catch {
      alert("Network error while deleting donation.");
    } finally {
      setBusy(false);
    }
  };

  const cell = (d: Donation, key: ColumnKey) => {
    switch (key) {
      case "donor":
        return (
          <span className="font-medium text-gray-900">{d.donor_name}</span>
        );
      case "email":
        return d.donor_email || <Empty />;
      case "phone":
        return d.donor_phone || <Empty />;
      case "address":
        return d.donor_address || <Empty />;
      case "gender":
        return d.donor_gender ? GENDER_LABEL[d.donor_gender] : <Empty />;
      case "amount":
        return (
          <span className="font-semibold text-gray-900">
            {rupiah.format(d.amount)}
          </span>
        );
      case "status": {
        const status = d.payment_status ?? "pending";
        return (
          <span
            className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${
              STATUS_STYLE[status] ?? "bg-gray-100 text-gray-600"
            }`}
          >
            {STATUS_LABEL[status] ?? status}
          </span>
        );
      }
      case "date":
        return d.created_at ? (
          new Date(d.created_at).toLocaleDateString("id-ID")
        ) : (
          <Empty />
        );
      case "invoice":
        return (
          <span className="font-mono text-xs text-gray-500">
            {d.invoice_number}
          </span>
        );
      case "proof":
        return (
          <button
            type="button"
            onClick={() => setActiveId(activeId === d.id ? null : d.id)}
            className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
              activeId === d.id
                ? "bg-blue-600 text-white"
                : "bg-blue-50 text-blue-700 hover:bg-blue-100"
            }`}
          >
            {activeId === d.id ? "Ditampilkan" : "Lihat bukti"}
          </button>
        );
    }
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
      {/* No overflow-hidden here: it would clip the Urutkan/Kolom dropdowns.
          The corners are rounded by the table container below instead. */}
      <div className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* ── Title bar ───────────────────────────────────── */}
        <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-4 py-4 sm:px-6">
          <h2 className="text-lg font-semibold text-gray-900">Donasi</h2>
          <ExportExcelButton donations={donations} />
        </div>

        {/* ── Toolbar: search + sort + columns ────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3 sm:px-6">
          {/* Icon and input are flex siblings, so they can never overlap. */}
          <div className="flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 focus-within:border-gray-400 sm:w-72">
            <svg
              aria-hidden="true"
              className="shrink-0 text-gray-400"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari..."
              className="w-full min-w-0 border-0 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Hapus pencarian"
                className="shrink-0 text-gray-400 hover:text-gray-600"
              >
                <svg
                  aria-hidden="true"
                  width="14"
                  height="14"
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
            )}
          </div>

          <div className="flex items-center gap-2">
            {selected.size > 0 && (
              <>
                <span className="text-sm text-gray-500">
                  {selected.size} dipilih
                </span>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    deleteIds(
                      [...selected],
                      `Hapus ${selected.size} donasi? Bukti pembayarannya juga ikut terhapus.`,
                    )
                  }
                  className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
                >
                  {busy ? "Menghapus..." : "Hapus"}
                </button>
              </>
            )}

            {/* Urutkan */}
            <div className="relative" ref={sortRef}>
              <button
                type="button"
                onClick={() => setSortOpen((o) => !o)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <svg
                  aria-hidden="true"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="7" y1="12" x2="17" y2="12" />
                  <line x1="10" y1="18" x2="14" y2="18" />
                </svg>
                Urutkan
              </button>
              {sortOpen && (
                <div className="absolute right-0 z-20 mt-1 w-52 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  {SORTS.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => {
                        setSort(s.key);
                        setSortOpen(false);
                      }}
                      className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                        sort === s.key
                          ? "font-medium text-gray-900"
                          : "text-gray-600"
                      }`}
                    >
                      {s.label}
                      {sort === s.key && (
                        <span className="text-gray-900">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Kolom */}
            <div className="relative" ref={colsRef}>
              <button
                type="button"
                onClick={() => setColsOpen((o) => !o)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <svg
                  aria-hidden="true"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                  <line x1="15" y1="3" x2="15" y2="21" />
                </svg>
                Kolom
              </button>
              {colsOpen && (
                <div className="absolute right-0 z-20 mt-1 max-h-72 w-56 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  {COLUMNS.map((c) => (
                    <label
                      key={c.key}
                      className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={!hidden.has(c.key)}
                        onChange={() => toggleColumn(c.key)}
                        className="h-4 w-4 rounded border-gray-300 accent-gray-900"
                      />
                      {c.label}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Table (scrolls horizontally) ─────────────────── */}
        <div className="max-h-[70vh] overflow-auto rounded-b-xl">
          <table className="w-full min-w-max border-collapse text-left">
            <thead className="sticky top-0 z-10 bg-gray-50 text-xs text-gray-500">
              <tr className="border-b border-gray-200">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Pilih semua"
                    className="h-4 w-4 rounded border-gray-300 accent-gray-900"
                  />
                </th>
                {visibleColumns.map((c) => (
                  <th
                    key={c.key}
                    className="px-4 py-3 font-medium whitespace-nowrap"
                  >
                    {c.label}
                  </th>
                ))}
                <th className="px-4 py-3 font-medium">Aksi</th>
              </tr>
            </thead>

            <tbody className="text-sm text-gray-600">
              {rows.map((d) => (
                <tr
                  key={d.id}
                  className={`border-b border-gray-100 transition-colors last:border-0 hover:bg-gray-50 ${
                    activeId === d.id
                      ? "bg-blue-50/60"
                      : selected.has(d.id)
                        ? "bg-gray-50"
                        : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(d.id)}
                      onChange={() => toggleRow(d.id)}
                      aria-label={`Pilih ${d.donor_name}`}
                      className="h-4 w-4 rounded border-gray-300 accent-gray-900"
                    />
                  </td>
                  {visibleColumns.map((c) => (
                    <td key={c.key} className="px-4 py-3 whitespace-nowrap">
                      {cell(d, c.key)}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        deleteIds(
                          [d.id],
                          `Hapus donasi dari ${d.donor_name}? Bukti pembayarannya juga ikut terhapus.`,
                        )
                      }
                      className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={visibleColumns.length + 2}
                    className="px-4 py-12 text-center text-sm text-gray-400"
                  >
                    {donations.length === 0
                      ? "Belum ada donasi."
                      : "Tidak ada hasil untuk pencarian ini."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Footer count ────────────────────────────────── */}
        <div className="border-t border-gray-200 px-4 py-3 text-xs text-gray-500 sm:px-6">
          Menampilkan {rows.length} dari {donations.length} donasi
        </div>
      </div>

      {active && (
        <ProofPanel donation={active} onClose={() => setActiveId(null)} />
      )}
    </div>
  );
}
