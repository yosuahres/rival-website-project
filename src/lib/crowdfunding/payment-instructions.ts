/**
 * "Cara Membayar" steps, per channel.
 *
 * Duitku hands back a `paymentUrl` with its own instruction page, but sending
 * a donor off-site mid-payment loses them. These are the same steps rendered
 * in place, in Indonesian, with the donation's own virtual-account number
 * substituted in.
 *
 * `{{va}}` is replaced with the virtual account number at render time.
 */

export interface InstructionSet {
  /** Tab label, e.g. "Transfer Melalui ATM". */
  title: string;
  steps: string[];
}

const VA_PLACEHOLDER = "{{va}}";

/** Steps that read the same whichever bank issued the virtual account. */
function genericVaInstructions(bank: string): InstructionSet[] {
  return [
    {
      title: "Transfer Melalui ATM",
      steps: [
        `Masukkan kartu ATM ${bank} dan PIN Anda.`,
        "Pilih menu Transaksi Lainnya, lalu pilih Transfer.",
        "Pilih Ke Rekening Virtual Account.",
        `Masukkan nomor Virtual Account ${VA_PLACEHOLDER}.`,
        "Periksa nama dan nominal tagihan yang muncul di layar, lalu konfirmasi.",
        "Simpan struk sebagai bukti pembayaran.",
      ],
    },
    {
      title: "Transfer Melalui Internet Banking",
      steps: [
        `Login ke Internet Banking ${bank}.`,
        "Pilih menu Transfer, lalu pilih Virtual Account.",
        `Masukkan nomor Virtual Account ${VA_PLACEHOLDER}.`,
        "Periksa nama dan nominal tagihan yang muncul, lalu konfirmasi.",
        "Masukkan token atau OTP untuk menyelesaikan pembayaran.",
      ],
    },
    {
      title: "Transfer Melalui Mobile Banking",
      steps: [
        `Buka aplikasi Mobile Banking ${bank} dan login.`,
        "Pilih menu Transfer, lalu pilih Virtual Account.",
        `Masukkan nomor Virtual Account ${VA_PLACEHOLDER}.`,
        "Periksa nama dan nominal tagihan yang muncul, lalu konfirmasi.",
        "Masukkan PIN atau password transaksi Anda.",
      ],
    },
  ];
}

/**
 * Channels whose flow differs enough from the generic VA script to be worth
 * its own copy. Everything else falls back to `genericVaInstructions`.
 */
const OVERRIDES: Record<string, InstructionSet[]> = {
  BC: [
    {
      title: "Transfer Melalui ATM BCA",
      steps: [
        "Masukkan kartu ATM BCA dan PIN Anda.",
        "Pilih Transaksi Lainnya > Transfer > Ke Rekening BCA Virtual Account.",
        `Masukkan nomor Virtual Account ${VA_PLACEHOLDER}, lalu tekan Benar.`,
        "Periksa nama dan nominal tagihan, lalu tekan Ya.",
        "Simpan struk sebagai bukti pembayaran.",
      ],
    },
    {
      title: "Transfer Melalui myBCA / BCA mobile",
      steps: [
        "Buka myBCA atau BCA mobile, lalu login.",
        "Pilih m-Transfer > BCA Virtual Account.",
        `Masukkan nomor Virtual Account ${VA_PLACEHOLDER}.`,
        "Periksa nama dan nominal tagihan, lalu pilih OK.",
        "Masukkan PIN m-BCA untuk menyelesaikan pembayaran.",
      ],
    },
    {
      title: "Transfer Melalui KlikBCA",
      steps: [
        "Login ke KlikBCA Individual.",
        "Pilih Transfer Dana > Transfer ke BCA Virtual Account.",
        `Masukkan nomor Virtual Account ${VA_PLACEHOLDER}, lalu klik Lanjutkan.`,
        "Periksa nama dan nominal tagihan, lalu masukkan respon KeyBCA.",
        "Klik Kirim untuk menyelesaikan pembayaran.",
      ],
    },
  ],
  M2: [
    {
      title: "Transfer Melalui ATM Mandiri",
      steps: [
        "Masukkan kartu ATM Mandiri dan PIN Anda.",
        "Pilih Bayar/Beli > Multipayment.",
        "Masukkan kode perusahaan 88908 (Duitku), lalu tekan Benar.",
        `Masukkan nomor Virtual Account ${VA_PLACEHOLDER}, lalu tekan Benar.`,
        "Periksa nama dan nominal tagihan, lalu pilih Ya untuk membayar.",
      ],
    },
    {
      title: "Transfer Melalui Livin' by Mandiri",
      steps: [
        "Buka aplikasi Livin' by Mandiri dan login.",
        "Pilih Bayar, lalu cari dan pilih Duitku pada daftar penyedia jasa.",
        `Masukkan nomor Virtual Account ${VA_PLACEHOLDER}.`,
        "Periksa nama dan nominal tagihan, lalu lanjutkan.",
        "Masukkan PIN Livin' untuk menyelesaikan pembayaran.",
      ],
    },
  ],
  BR: [
    {
      title: "Transfer Melalui ATM BRI",
      steps: [
        "Masukkan kartu ATM BRI dan PIN Anda.",
        "Pilih Transaksi Lain > Pembayaran > Lainnya > BRIVA.",
        `Masukkan nomor BRIVA ${VA_PLACEHOLDER}, lalu tekan Benar.`,
        "Periksa nama dan nominal tagihan, lalu tekan Ya.",
        "Simpan struk sebagai bukti pembayaran.",
      ],
    },
    {
      title: "Transfer Melalui BRImo",
      steps: [
        "Buka aplikasi BRImo dan login.",
        "Pilih BRIVA pada menu pembayaran.",
        `Masukkan nomor BRIVA ${VA_PLACEHOLDER}.`,
        "Periksa nama dan nominal tagihan, lalu lanjutkan.",
        "Masukkan PIN BRImo untuk menyelesaikan pembayaran.",
      ],
    },
  ],
  I1: genericVaInstructions("BNI"),
  BT: genericVaInstructions("Permata"),
  BV: genericVaInstructions("BSI"),
  B1: genericVaInstructions("CIMB Niaga"),
  DM: genericVaInstructions("Danamon"),
  VA: genericVaInstructions("Maybank"),
  A1: genericVaInstructions("ATM Bersama"),
  AG: genericVaInstructions("Artha Graha"),
  NC: genericVaInstructions("Bank Neo Commerce"),
  S1: genericVaInstructions("Bank Sahabat Sampoerna"),

  // Non-VA channels: no account number to transfer to, so the steps describe
  // the redirect instead.
  FT: [
    {
      title: "Bayar di Kasir",
      steps: [
        "Datang ke gerai Alfamart, Indomaret, Pegadaian, atau Kantor Pos terdekat.",
        `Sebutkan kepada kasir bahwa Anda ingin membayar tagihan Duitku dengan kode ${VA_PLACEHOLDER}.`,
        "Bayar sesuai nominal yang tertera.",
        "Simpan struk sebagai bukti pembayaran.",
      ],
    },
  ],
  IR: [
    {
      title: "Bayar di Kasir Indomaret",
      steps: [
        "Datang ke gerai Indomaret terdekat.",
        `Sebutkan kepada kasir kode pembayaran ${VA_PLACEHOLDER}.`,
        "Bayar sesuai nominal yang tertera.",
        "Simpan struk sebagai bukti pembayaran.",
      ],
    },
  ],
};

/** Steps shown for channels that redirect rather than issue a number. */
const REDIRECT_INSTRUCTIONS: InstructionSet[] = [
  {
    title: "Cara Membayar",
    steps: [
      "Klik tombol pembayaran di atas untuk membuka halaman penyedia pembayaran.",
      "Selesaikan pembayaran sesuai instruksi di halaman tersebut.",
      "Jangan tutup halaman sebelum pembayaran selesai diproses.",
      "Setelah berhasil, Anda akan diarahkan kembali ke halaman ini secara otomatis.",
    ],
  },
];

/**
 * Instruction tabs for one channel, with the virtual-account number filled in.
 * Falls back to the redirect script when there is no number to show.
 */
export function instructionsFor(
  code: string,
  vaNumber: string | null,
): InstructionSet[] {
  // No number to transfer to means the channel redirects, whatever it is.
  if (!vaNumber) return REDIRECT_INSTRUCTIONS;

  // A channel Duitku adds that this file has not heard of still gets usable
  // steps rather than being dropped to the redirect script.
  const sets = OVERRIDES[code.toUpperCase()] ?? genericVaInstructions("Anda");

  return sets.map((set) => ({
    title: set.title,
    steps: set.steps.map((step) => step.replaceAll(VA_PLACEHOLDER, vaNumber)),
  }));
}
