"use client";

import * as XLSX from "xlsx";

type Donation = {
  id: string;
  donor_name: string;
  donor_email: string;
  donor_phone: string;
  donor_address: string;
  donor_gender: string | null;
  amount: number;
  payment_status: string | null;
  created_at: string | null;
};

export default function ExportExcelButton({
  donations,
}: {
  donations: Donation[];
}) {
  const handleExport = () => {
    const rows = donations.map((d) => ({
      Donatur: d.donor_name,
      Email: d.donor_email,
      Phone: d.donor_phone,
      Address: d.donor_address,
      Gender: d.donor_gender ?? "-",
      "Total (Rp)": d.amount,
      Status: d.payment_status ?? "-",
      Tanggal: d.created_at ? new Date(d.created_at).toLocaleDateString() : "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Donations");

    // Auto-size columns
    const colWidths = Object.keys(rows[0] || {}).map((key) => ({
      wch:
        Math.max(
          key.length,
          ...rows.map((r) => String(r[key as keyof typeof r]).length),
        ) + 2,
    }));
    worksheet["!cols"] = colWidths;

    XLSX.writeFile(
      workbook,
      `donations-${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
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
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Export Excel
    </button>
  );
}
