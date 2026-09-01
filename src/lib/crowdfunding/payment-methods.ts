/**
 * Presentation metadata for Duitku's payment channels.
 *
 * Duitku's getPaymentMethod returns a flat list of two-letter codes. A flat
 * list of twenty-odd channels is unreadable, so this groups them the way
 * Indonesian checkouts conventionally do — virtual accounts, cards, QRIS,
 * e-wallets, paylater, retail — and carries the expiry each channel gets.
 *
 * Channel codes and expiry defaults: https://docs.duitku.com/api/id/
 */

export interface PaymentGroup {
  id: string;
  title: string;
  /** Sits under the group heading, the way tiket.com explains each family. */
  description: string;
  codes: readonly string[];
}

export const PAYMENT_GROUPS: readonly PaymentGroup[] = [
  {
    id: "va",
    title: "Transfer Bank (Virtual Account)",
    description:
      "Bayar lewat ATM, Internet Banking, atau Mobile Banking. Nomor virtual account khusus untuk donasi ini.",
    codes: [
      "BC",
      "M2",
      "I1",
      "BR",
      "BT",
      "BV",
      "B1",
      "VA",
      "DM",
      "A1",
      "AG",
      "NC",
      "S1",
    ],
  },
  {
    id: "qris",
    title: "QRIS",
    description:
      "Pindai satu kode QR dari aplikasi bank atau e-wallet mana pun yang mendukung QRIS.",
    codes: ["SP", "NQ", "GQ", "SQ"],
  },
  {
    id: "ewallet",
    title: "E-Wallet",
    description: "Bayar langsung dari saldo dompet digital Anda.",
    codes: ["OV", "DA", "SA", "LA", "LF", "SL", "OL"],
  },
  {
    id: "card",
    title: "Kartu Kredit / Debit",
    description:
      "Masukkan data kartu untuk menyelesaikan donasi. Visa, Mastercard, dan JCB.",
    codes: ["VC"],
  },
  {
    id: "retail",
    title: "Gerai Retail",
    description:
      "Bayar tunai di kasir Alfamart, Indomaret, Pegadaian, atau Pos.",
    codes: ["FT", "IR"],
  },
  {
    id: "paylater",
    title: "Paylater / Cicilan Tanpa Kartu",
    description: "Donasi sekarang, bayar belakangan tanpa perlu kartu kredit.",
    codes: ["DN", "AT"],
  },
  {
    id: "ebanking",
    title: "E-Banking",
    description: "Konfirmasi pembayaran langsung di aplikasi bank Anda.",
    codes: ["JP"],
  },
  {
    id: "ecommerce",
    title: "E-Commerce",
    description: "Selesaikan pembayaran melalui aplikasi e-commerce.",
    codes: ["T1", "T2", "T3"],
  },
] as const;

/**
 * How long each channel stays payable, in minutes, when `expiryPeriod` is not
 * sent on the inquiry — which is what we do, so Duitku applies its own
 * per-channel default. Mirrored here so the countdown can be shown without a
 * second API call.
 *
 * Kept deliberately conservative: an unknown code falls back to the shortest
 * common window rather than promising a donor more time than they have.
 */
const EXPIRY_MINUTES: Record<string, number> = {
  // Virtual accounts and retail: a full day.
  BC: 1440,
  M2: 1440,
  I1: 1440,
  BR: 1440,
  BT: 1440,
  BV: 1440,
  B1: 1440,
  VA: 1440,
  DM: 1440,
  A1: 1440,
  AG: 1440,
  NC: 1440,
  S1: 1440,
  FT: 1440,
  IR: 1440,
  // Cards and paylater.
  VC: 30,
  DN: 1440,
  AT: 720,
  // QRIS.
  SP: 10,
  NQ: 24,
  GQ: 10,
  SQ: 10,
  // E-wallets.
  OV: 10,
  SA: 10,
  LF: 24,
  LA: 24,
  DA: 1440,
  SL: 30,
  OL: 15,
  // E-banking and e-commerce.
  JP: 10,
  T1: 1440,
  T2: 1440,
  T3: 1440,
};

const FALLBACK_EXPIRY_MINUTES = 10;

export function expiryMinutesFor(code: string): number {
  return EXPIRY_MINUTES[code.toUpperCase()] ?? FALLBACK_EXPIRY_MINUTES;
}

/** True for channels that hand back a virtual-account number to transfer to. */
export function isVirtualAccount(code: string): boolean {
  return (
    PAYMENT_GROUPS.find((g) => g.id === "va")?.codes.includes(
      code.toUpperCase(),
    ) ?? false
  );
}

export interface GroupedMethods<T> {
  group: PaymentGroup;
  methods: T[];
}

/**
 * Buckets whatever Duitku returned into the groups above.
 *
 * Channels are ordered within a group by the order in `codes` rather than the
 * order Duitku sent them, so the list a donor sees does not reshuffle between
 * visits. Anything Duitku adds that this file has not heard of still shows up,
 * under "Lainnya" — never silently dropped.
 */
export function groupPaymentMethods<T extends { paymentMethod: string }>(
  methods: T[],
): GroupedMethods<T>[] {
  const byCode = new Map(
    methods.map((m) => [m.paymentMethod.toUpperCase(), m]),
  );
  const claimed = new Set<string>();
  const grouped: GroupedMethods<T>[] = [];

  for (const group of PAYMENT_GROUPS) {
    const found: T[] = [];
    for (const code of group.codes) {
      const method = byCode.get(code);
      if (method) {
        found.push(method);
        claimed.add(code);
      }
    }
    if (found.length > 0) grouped.push({ group, methods: found });
  }

  const leftovers = methods.filter(
    (m) => !claimed.has(m.paymentMethod.toUpperCase()),
  );

  if (leftovers.length > 0) {
    grouped.push({
      group: {
        id: "other",
        title: "Lainnya",
        description: "Metode pembayaran lain yang tersedia.",
        codes: [],
      },
      methods: leftovers,
    });
  }

  return grouped;
}
