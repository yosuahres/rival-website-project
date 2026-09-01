"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import OrderSummary from "@/components/crowdfunding/OrderSummary";
import PaymentCountdown from "@/components/crowdfunding/PaymentCountdown";
import type { Charge } from "@/components/crowdfunding/PaymentInstructions";
import PaymentInstructions from "@/components/crowdfunding/PaymentInstructions";
import type { PaymentMethod } from "@/components/crowdfunding/PaymentMethodPicker";
import PaymentMethodPicker from "@/components/crowdfunding/PaymentMethodPicker";
import { withBasePath } from "@/lib/base-path";
import { apiUrl } from "@/lib/crowdfunding/api";

interface PaymentData {
  invoice_number: string;
  amount: number;
}

export default function SupportPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{ reference: string } | null>(
    null,
  );
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  // Duitku. `duitkuEnabled === null` means the channel list has not come back
  // yet; `false` means the gateway has no credentials on this deployment and
  // the manual QRIS + transfer-proof flow takes over.
  const [duitkuEnabled, setDuitkuEnabled] = useState<boolean | null>(null);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [charge, setCharge] = useState<Charge | null>(null);
  // Picking a channel no longer creates the transaction: the donor selects,
  // reviews the total in the summary rail, then confirms. Duitku will not let
  // an order id be reused, so the charge has to be deliberate.
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [methodModalOpen, setMethodModalOpen] = useState(false);
  const [charging, setCharging] = useState(false);
  const [chargeError, setChargeError] = useState("");
  const [checking, setChecking] = useState(false);
  const [checkMessage, setCheckMessage] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");
  const [errorMsg, setErrorMsg] = useState("");
  const [transferProofFile, setTransferProofFile] = useState<File | null>(null);
  const [proofUploading, setProofUploading] = useState(false);
  const [proofUploadMsg, setProofUploadMsg] = useState("");
  const [proofUploadError, setProofUploadError] = useState("");
  const [uploadedProofPath, setUploadedProofPath] = useState("");
  const [proofUploaded, setProofUploaded] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("male");

  const [donationType, setDonationType] = useState<"package" | "custom">(
    "package",
  );
  const [selectedPackage, setSelectedPackage] = useState(1);
  const [amount, setAmount] = useState("");
  const [_payment, _setPayment] = useState("");
  const [_message, _setMessage] = useState("");

  const packages = [
    {
      id: 1,
      name: "Package 1",
      price: 250000,
      perks: [
        "Name placement in rover (Size S 35pt)",
        "1 pcs sticker pack (free to choose design option)",
        "1 pcs keychain",
        "Name placement in rival's jersey",
        "Name placement in official rival website (Size S 35pt)",
      ],
    },
    {
      id: 2,
      name: "Package 2",
      price: 550000,
      perks: [
        "Name placement in rover (Size M 40pt)",
        "2 pcs sticker pack (free to choose design option)",
        "2 pcs keychain",
        "Rival's t-shirt",
        "Name placement in rival's jersey",
        "Name placement in official rival website (Size M 40pt)",
      ],
    },
    {
      id: 3,
      name: "Package 3",
      price: 850000,
      perks: [
        "Name placement in rover (Size L 45pt)",
        "2 pcs sticker pack (free to choose design option)",
        "2 pcs keychain",
        "Rival's jersey",
        "Name placement in rival's jersey",
        "Name placement in official rival website (Size L 45pt)",
      ],
    },
  ];

  const formatRupiah = (val: number) => `Rp${val.toLocaleString("id-ID")}`;

  const pollStatus = useCallback(async () => {
    if (!paymentData) return;
    try {
      const res = await fetch(
        apiUrl("/api/donations/status", {
          invoice: paymentData.invoice_number,
        }),
      );
      const result = await res.json();
      if (result.status === "success") {
        setPaymentStatus("success");
        setSuccessData({ reference: paymentData.invoice_number });
        setPaymentData(null);
      } else if (result.status === "failed") {
        setPaymentStatus("failed");
        setPaymentData(null);
      }
    } catch {}
  }, [paymentData]);

  useEffect(() => {
    if (!paymentData || paymentStatus !== "pending") return;
    const interval = setInterval(pollStatus, 5000);
    return () => clearInterval(interval);
  }, [paymentData, paymentStatus, pollStatus]);

  // Ask the server which channels Duitku has enabled for this exact amount.
  // The fee differs per channel and per amount, so this cannot be hoisted out
  // of the donation.
  useEffect(() => {
    if (!paymentData || charge) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(
          apiUrl("/api/duitku/payment-methods", {
            amount: String(paymentData.amount),
          }),
        );
        const result = await res.json();
        if (cancelled) return;

        if (!res.ok || result.enabled === false) {
          // No credentials, or the gateway is unreachable — fall back to the
          // static QRIS code so a donor is never left with no way to pay.
          setDuitkuEnabled(false);
          return;
        }

        setMethods(result.methods ?? []);
        setDuitkuEnabled((result.methods ?? []).length > 0);
      } catch {
        if (!cancelled) setDuitkuEnabled(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [paymentData, charge]);

  /**
   * Asks Duitku directly whether the payment landed.
   *
   * The 5-second poll only reads our own database, so it can only see a
   * payment the callback already told us about. When the callback cannot reach
   * us at all this is the donor's way out. It is manual and server-throttled
   * because Duitku blocks the whole merchant for about an hour if its
   * transactionStatus rate limit is hit.
   */
  const checkPaymentStatus = useCallback(async () => {
    if (!paymentData) return;

    setChecking(true);
    setCheckMessage("");

    try {
      const res = await fetch(apiUrl("/api/duitku/check"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoice_number: paymentData.invoice_number }),
      });

      const result = await res.json();

      if (!res.ok) {
        setCheckMessage(result.error || "Gagal memeriksa status pembayaran.");
        return;
      }

      if (result.status === "success") {
        setPaymentStatus("success");
        setSuccessData({ reference: paymentData.invoice_number });
        setPaymentData(null);
        return;
      }

      if (result.status === "failed") {
        setPaymentStatus("failed");
        setPaymentData(null);
        return;
      }

      if (result.reason === "cooldown") {
        setCheckMessage(
          `Baru saja diperiksa. Coba lagi dalam ${result.retry_after_seconds} detik.`,
        );
        return;
      }

      setCheckMessage(
        "Pembayaran belum diterima. Jika Anda baru saja membayar, tunggu beberapa saat lalu periksa lagi.",
      );
    } catch {
      setCheckMessage("Gagal terhubung. Silakan coba lagi.");
    } finally {
      setChecking(false);
    }
  }, [paymentData]);

  const startPayment = async () => {
    if (!paymentData || !selectedMethod) return;

    setChargeError("");
    setCharging(true);

    try {
      const res = await fetch(apiUrl("/api/duitku/transaction"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoice_number: paymentData.invoice_number,
          payment_method: selectedMethod.paymentMethod,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setChargeError(result.error || "Tidak dapat memulai pembayaran.");
        return;
      }

      setCharge(result.payment);
    } catch {
      setChargeError("Gagal terhubung. Silakan coba lagi.");
    } finally {
      setCharging(false);
    }
  };

  const uploadTransferProof = async () => {
    if (!paymentData || !transferProofFile) {
      setProofUploadError("Please choose a file first.");
      return;
    }

    setProofUploadError("");
    setProofUploadMsg("");
    setProofUploading(true);

    try {
      const formData = new FormData();
      formData.append("invoice_number", paymentData.invoice_number);
      formData.append("file", transferProofFile);

      const res = await fetch(apiUrl("/api/donations/proof"), {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        setProofUploadError(result.error || "Failed to upload transfer proof.");
        return;
      }

      setUploadedProofPath(result.path || "");
      setProofUploadMsg("Bukti Transfer berhasil diunggah. Terima kasih!");
      setTransferProofFile(null);
      setProofUploaded(true);
    } catch {
      setProofUploadError("Network error while uploading transfer proof.");
    } finally {
      setProofUploading(false);
    }
  };

  // Hide the banner/intro once the donor reaches the payment step.
  const showIntro = !successData && !paymentData && paymentStatus !== "failed";

  // The form reads better narrow, but the checkout is two columns and needs
  // the room, so the shell widens once the gateway step is on screen.
  const wideShell =
    duitkuEnabled === true &&
    paymentData !== null &&
    paymentStatus === "pending";

  return (
    <main
      className={`mx-auto flex w-full flex-col items-center gap-10 px-4 py-16 sm:px-6 lg:px-8 ${
        wideShell ? "max-w-6xl" : "max-w-3xl"
      }`}
    >
      {showIntro && (
        <>
          <div className="w-full overflow-hidden rounded-2xl">
            <Image
              src="/assets/web-banner/zero-banner.jpg"
              alt="Rival ITS Banner"
              width={1200}
              height={400}
              className="h-auto w-full object-cover"
              priority
            />
          </div>

          <p className="text-center text-lg font-bold tracking-tight text-white">
            #SupportTheDream
          </p>

          <p className="-mt-6 w-full text-justify text-sm leading-relaxed text-white/80 sm:text-base">
            Welcome to the RIVAL Crowd Funding! Space exploration is our shared
            dream. Starting today, you can join us in exploring space further by
            helping us build a rover, a space exploration robot! RIVAL ITS is
            the first rover team to represent Indonesia in the{" "}
            <span className="font-bold text-white">
              Australian Rover Challenge 2027
            </span>
            , international rover competition! We are currently working hard to
            design and build a rover that meets the needs of space exploration.
          </p>
        </>
      )}

      <div className="flex w-full items-start gap-0">
        <div className="flex flex-1 flex-col gap-2">
          <span
            className={`text-sm font-semibold ${step >= 1 ? "text-white" : "text-white/40"}`}
          >
            1. Personal Data
          </span>
          <div className="h-1.5 w-full rounded-full bg-white/20">
            <div
              className={`h-full rounded-full transition-all duration-500 ${step >= 1 ? "w-full bg-brand-soft" : "w-0"}`}
            />
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex flex-1 flex-col gap-2">
          <span
            className={`text-sm font-semibold ${step >= 2 ? "text-white" : "text-white/40"}`}
          >
            2. Payment
          </span>
          <div className="h-1.5 w-full rounded-full bg-white/20">
            <div
              className={`h-full rounded-full transition-all duration-500 ${step >= 2 ? "w-full bg-brand-soft" : "w-0"}`}
            />
          </div>
        </div>
      </div>

      {/* Thank You After Proof Upload */}
      {proofUploaded && (
        <div className="flex w-full flex-col items-center gap-6 rounded-2xl border border-white/15 bg-brand-panel p-10 text-center">
          <svg
            aria-hidden="true"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#57b894"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <h3 className="text-2xl font-bold text-white">Terima Kasih!</h3>
          <p className="text-sm leading-relaxed text-white/80">
            Bukti donasi Anda telah berhasil diunggah.
            <br />
            Tim kami akan segera memverifikasi donasi Anda.
          </p>
          {paymentData && (
            <div className="flex flex-col gap-1">
              <p className="text-xs text-white/50">Invoice</p>
              <p className="font-mono text-sm font-bold text-brand-soft">
                {paymentData.invoice_number}
              </p>
            </div>
          )}
          {uploadedProofPath && (
            <p className="text-xs text-white/40">File: {uploadedProofPath}</p>
          )}
          <p className="mt-2 text-xs leading-relaxed text-white/50">
            Anda dapat menutup halaman ini. Kami akan mengirimkan konfirmasi ke
            email Anda setelah verifikasi.
          </p>
        </div>
      )}

      {/* Payment step: Duitku when it is configured, static QRIS otherwise. */}
      {!proofUploaded && paymentData && paymentStatus === "pending" && (
        <div className="flex w-full flex-col gap-6">
          {duitkuEnabled === null && (
            <p className="w-full py-16 text-center text-sm text-white/60">
              Memuat metode pembayaran...
            </p>
          )}

          {duitkuEnabled === true && (
            <div className="flex w-full flex-col gap-5">
              {charge?.expires_at && (
                <PaymentCountdown
                  expiresAt={charge.expires_at}
                  // One authoritative check rather than assuming. It also
                  // writes the outcome to the database — marking it failed on
                  // the client alone would leave the row pending forever.
                  onExpire={checkPaymentStatus}
                />
              )}

              <div className="grid w-full gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
                <div className="flex min-w-0 flex-col gap-4">
                  {charge ? (
                    <PaymentInstructions
                      charge={charge}
                      method={selectedMethod}
                      onCheckStatus={checkPaymentStatus}
                      checking={checking}
                      checkMessage={checkMessage}
                    />
                  ) : (
                    <PaymentMethodPicker
                      methods={methods}
                      selected={selectedMethod}
                      onSelect={setSelectedMethod}
                      modalOpen={methodModalOpen}
                      onModalOpenChange={setMethodModalOpen}
                      disabled={charging}
                    />
                  )}

                  {chargeError && (
                    <p className="rounded-xl border border-red-400/30 bg-red-900/20 px-4 py-3 text-xs text-red-300">
                      {chargeError}
                    </p>
                  )}
                </div>

                <OrderSummary
                  invoiceNumber={paymentData.invoice_number}
                  amount={paymentData.amount}
                  packageName={
                    donationType === "package"
                      ? (packages.find((pkg) => pkg.id === selectedPackage)
                          ?.name ?? "Donasi")
                      : "Donasi Custom"
                  }
                  perks={
                    donationType === "package"
                      ? packages.find((pkg) => pkg.id === selectedPackage)
                          ?.perks
                      : undefined
                  }
                >
                  {!charge && (
                    <button
                      type="button"
                      onClick={startPayment}
                      disabled={!selectedMethod || charging}
                      className="w-full cursor-pointer rounded-full bg-brand px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/40"
                    >
                      {charging
                        ? "Memproses..."
                        : selectedMethod
                          ? `Bayar dengan ${selectedMethod.paymentName}`
                          : "Belum Pilih Metode Pembayaran"}
                    </button>
                  )}
                </OrderSummary>
              </div>
            </div>
          )}

          {/* Manual fallback: static QRIS + transfer proof, no gateway. */}
          {duitkuEnabled === false && (
            <div className="flex w-full flex-col items-center gap-6 text-center">
              <h3 className="text-xl font-bold text-white">Scan QRIS to Pay</h3>
              <p className="text-sm text-white/70">
                Amount:{" "}
                <span className="font-bold text-brand-soft">
                  {formatRupiah(paymentData.amount)}
                </span>
              </p>

              <Image
                src="/assets/code.jpeg"
                alt="QRIS Payment Code"
                width={800}
                height={800}
                className="w-full rounded-2xl"
              />

              <p className="text-xs text-white/50">
                Invoice:{" "}
                <span className="font-mono">{paymentData.invoice_number}</span>
              </p>

              <div className="w-full rounded-2xl border border-white/20 bg-black/20 p-4 text-left">
                <p className="text-sm font-semibold text-white">Bukti Donasi</p>
                <p className="mt-1 text-xs text-white/60">
                  Format: JPG, PNG, PDF (max 5MB)
                </p>

                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setTransferProofFile(file);
                      setProofUploadError("");
                    }}
                    className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2 text-sm text-white file:mr-3 file:rounded-md file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white"
                  />
                  <button
                    type="button"
                    onClick={uploadTransferProof}
                    disabled={proofUploading || !transferProofFile}
                    className="inline-flex items-center justify-center rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {proofUploading ? "Uploading..." : "Upload"}
                  </button>
                </div>

                {proofUploadMsg && (
                  <p className="mt-3 text-xs text-brand-soft">
                    {proofUploadMsg}
                  </p>
                )}
                {uploadedProofPath && (
                  <p className="mt-1 text-xs text-white/50">
                    File: {uploadedProofPath}
                  </p>
                )}
                {proofUploadError && (
                  <p className="mt-3 text-xs text-red-400">
                    {proofUploadError}
                  </p>
                )}
              </div>

              <a
                href={withBasePath("/assets/code.jpeg")}
                download="QRIS-Payment.jpeg"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/50 hover:bg-white/5"
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
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download QR Code
              </a>
            </div>
          )}
        </div>
      )}

      {paymentStatus === "failed" && !successData && (
        <div className="flex w-full flex-col items-center gap-4 rounded-2xl border border-red-400/30 bg-red-900/20 p-8 text-center">
          <svg
            aria-hidden="true"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f87171"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <h3 className="text-xl font-bold text-white">
            Payment Failed or Expired
          </h3>
          <p className="text-sm text-white/70">
            Your payment could not be completed. Please try again.
          </p>
          <button
            type="button"
            onClick={() => {
              setPaymentStatus("pending");
              setPaymentData(null);
              setDuitkuEnabled(null);
              setMethods([]);
              setCharge(null);
              setSelectedMethod(null);
              setMethodModalOpen(false);
              setChargeError("");
              setCheckMessage("");
              setStep(2);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
          >
            Try Again
          </button>
        </div>
      )}

      {successData && (
        <div className="flex w-full flex-col items-center gap-4 rounded-2xl border border-white/15 bg-brand-panel p-8 text-center">
          <svg
            aria-hidden="true"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#57b894"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <h3 className="text-xl font-bold text-white">Payment Successful!</h3>
          <p className="text-sm text-white/70">
            Thank you for your support! Your donation has been confirmed.
          </p>
          <p className="text-sm text-white/70">Reference ID:</p>
          <p className="font-mono text-sm font-bold text-brand-soft">
            {successData.reference}
          </p>
        </div>
      )}

      {!successData && !paymentData && paymentStatus !== "failed" && (
        <form
          className="flex w-full flex-col gap-8"
          onSubmit={async (e) => {
            e.preventDefault();
            setErrorMsg("");

            if (step === 1) {
              setStep(2);
              return;
            }

            if (step === 2) {
              if (donationType === "custom") {
                const parsed = Number(amount);
                if (Number.isNaN(parsed) || parsed < 5000) {
                  setErrorMsg("Minimum donation is IDR 5,000.");
                  return;
                }
              }
              setStep(3);
              return;
            }

            setSubmitting(true);
            try {
              const res = await fetch(apiUrl("/api/donations"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  donor_name: name,
                  donor_email: email,
                  donor_phone: phone,
                  donor_address: address,
                  donor_gender: gender,
                  amount:
                    donationType === "package"
                      ? packages.find((p) => p.id === selectedPackage)?.price
                      : Number(amount),
                }),
              });

              const result = await res.json();

              if (!res.ok) {
                setErrorMsg(result.error || "Something went wrong.");
                return;
              }

              if (result.payment) {
                setPaymentData(result.payment);
                setPaymentStatus("pending");
                setTransferProofFile(null);
                setProofUploadMsg("");
                setProofUploadError("");
                setUploadedProofPath("");
                // A new invoice means a new Duitku transaction: clear the old
                // channel list and charge so the picker starts fresh.
                setDuitkuEnabled(null);
                setMethods([]);
                setCharge(null);
                setSelectedMethod(null);
                setMethodModalOpen(false);
                setChargeError("");
                setCheckMessage("");
              } else {
                setErrorMsg("Payment generation failed. Please try again.");
              }
            } catch {
              setErrorMsg("Network error. Please try again.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {step === 1 && (
            <>
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-bold text-white">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="rounded-lg border border-white/20 bg-transparent px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition focus:border-brand-soft focus:ring-1 focus:ring-brand-soft"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="phone" className="text-sm font-bold text-white">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Input your phone number"
                  className="rounded-lg border border-white/20 bg-transparent px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition focus:border-brand-soft focus:ring-1 focus:ring-brand-soft"
                />
                <p className="text-xs text-white/50">
                  Use +62 or 08 format. Ex: +6281234567890
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-bold text-white">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="rounded-lg border border-white/20 bg-transparent px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition focus:border-brand-soft focus:ring-1 focus:ring-brand-soft"
                />
                <p className="text-xs text-white/50">Ex: example@gmail.com</p>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="address"
                  className="text-sm font-bold text-white"
                >
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                  className="rounded-lg border border-white/20 bg-transparent px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition focus:border-brand-soft focus:ring-1 focus:ring-brand-soft"
                />
                <p className="text-xs text-white/50">
                  Use full address format. Ex: Jl. Raya Kebayoran Baru No. 123,
                  RT.1/RW.1, Kebayoran Baru, Kec. Kebayoran Baru, Kota Jakarta
                  Selatan, Daerah Khusus Ibukota Jakarta 12110
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-sm font-bold text-white">Gender</span>
                <label className="flex cursor-pointer items-center gap-3 text-sm text-white">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white">
                    {gender === "male" && (
                      <span className="h-3 w-3 rounded-full bg-brand-soft" />
                    )}
                  </span>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === "male"}
                    onChange={() => setGender("male")}
                    className="sr-only"
                  />
                  Male
                </label>
                <label className="flex cursor-pointer items-center gap-3 text-sm text-white">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white">
                    {gender === "female" && (
                      <span className="h-3 w-3 rounded-full bg-brand-soft" />
                    )}
                  </span>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === "female"}
                    onChange={() => setGender("female")}
                    className="sr-only"
                  />
                  Female
                </label>
              </div>

              <div className="mt-4 flex items-center justify-center gap-4">
                <button
                  type="button"
                  disabled
                  className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-white/20 px-6 py-2.5 text-sm font-medium text-white/40"
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
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Previous
                </button>
                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
                >
                  Next
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
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex flex-col gap-3">
                <span className="text-sm font-bold text-white">Type</span>
                <label className="flex cursor-pointer items-center gap-3 text-sm text-white">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white">
                    {donationType === "package" && (
                      <span className="h-3 w-3 rounded-full bg-brand-soft" />
                    )}
                  </span>
                  <input
                    type="radio"
                    name="donationType"
                    value="package"
                    checked={donationType === "package"}
                    onChange={() => setDonationType("package")}
                    className="sr-only"
                  />
                  Package
                </label>
                <label className="flex cursor-pointer items-center gap-3 text-sm text-white">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white">
                    {donationType === "custom" && (
                      <span className="h-3 w-3 rounded-full bg-brand-soft" />
                    )}
                  </span>
                  <input
                    type="radio"
                    name="donationType"
                    value="custom"
                    checked={donationType === "custom"}
                    onChange={() => setDonationType("custom")}
                    className="sr-only"
                  />
                  Custom
                </label>
              </div>

              {donationType === "package" && (
                <div className="flex flex-col gap-3">
                  <span className="text-sm font-bold text-white">Package</span>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {packages.map((pkg) => (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => setSelectedPackage(pkg.id)}
                        className={`relative flex flex-col gap-2 rounded-xl border p-5 text-left transition-all ${
                          selectedPackage === pkg.id
                            ? "border-brand-soft"
                            : "border-white/20 hover:border-white/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/60">
                            {pkg.name}
                          </span>
                          <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white">
                            {selectedPackage === pkg.id && (
                              <span className="h-3 w-3 rounded-full bg-brand-soft" />
                            )}
                          </span>
                        </div>
                        <span className="text-lg font-bold text-white">
                          {formatRupiah(pkg.price)}
                        </span>
                        <span className="text-xs font-semibold text-brand-soft">
                          You Will Get
                        </span>
                        <ul className="flex list-disc flex-col gap-1 pl-4 text-xs leading-relaxed text-white/60">
                          {pkg.perks.map((perk) => (
                            <li key={perk}>{perk}</li>
                          ))}
                        </ul>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {donationType === "custom" && (
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="amount"
                    className="text-sm font-bold text-white"
                  >
                    Donation Amount (IDR)
                  </label>
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    min={5000}
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Minimum 5,000"
                    className="rounded-lg border border-white/20 bg-transparent px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition focus:border-brand-soft focus:ring-1 focus:ring-brand-soft"
                  />
                  <p className="text-xs text-white/50">
                    Minimum donation: IDR 5,000
                  </p>
                </div>
              )}

              <div className="mt-4 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/30 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/10"
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
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Previous
                </button>
                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
                >
                  Next
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
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>

              {errorMsg && (
                <p className="text-center text-sm font-medium text-red-400">
                  {errorMsg}
                </p>
              )}
            </>
          )}

          {step === 3 &&
            (() => {
              const currentPkg =
                donationType === "package"
                  ? packages.find((p) => p.id === selectedPackage)
                  : null;
              const finalAmount =
                donationType === "package"
                  ? currentPkg?.price || 0
                  : Number(amount);
              return (
                <>
                  <div className="flex w-full flex-col items-center gap-6">
                    <h2 className="text-2xl font-bold text-white sm:text-3xl">
                      Fund Information
                    </h2>
                    <p className="-mt-4 text-sm text-white/60">
                      Please review your details before proceeding to payment
                    </p>

                    <div className="w-full rounded-xl border border-gold/40 bg-brand/10 px-6 py-4 text-center">
                      <p className="text-sm text-gold">
                        Please double-check your information. Once you proceed
                        to payment, you cannot edit these details.
                      </p>
                    </div>

                    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-4 rounded-xl border border-white/20 bg-black/20 p-6">
                        <h3 className="text-lg font-bold text-white">
                          Personal Information
                        </h3>

                        <div className="flex items-start gap-3">
                          <svg
                            aria-hidden="true"
                            className="mt-0.5 shrink-0 text-brand-soft"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          <div>
                            <p className="text-xs text-white/50">Name</p>
                            <p className="text-sm font-semibold text-white">
                              {name}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <svg
                            aria-hidden="true"
                            className="mt-0.5 shrink-0 text-brand-soft"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                          </svg>
                          <div>
                            <p className="text-xs text-white/50">Email</p>
                            <p className="text-sm font-semibold text-white">
                              {email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <svg
                            aria-hidden="true"
                            className="mt-0.5 shrink-0 text-brand-soft"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                          <div>
                            <p className="text-xs text-white/50">
                              Phone Number
                            </p>
                            <p className="text-sm font-semibold text-white">
                              {phone}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <svg
                            aria-hidden="true"
                            className="mt-0.5 shrink-0 text-brand-soft"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="10" r="3" />
                            <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" />
                          </svg>
                          <div>
                            <p className="text-xs text-white/50">Address</p>
                            <p className="text-sm font-semibold text-white">
                              {address}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <svg
                            aria-hidden="true"
                            className="mt-0.5 shrink-0 text-brand-soft"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          <div>
                            <p className="text-xs text-white/50">Gender</p>
                            <p className="text-sm font-semibold text-white">
                              {gender.charAt(0).toUpperCase() + gender.slice(1)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 rounded-xl border border-white/20 bg-black/20 p-6">
                        <h3 className="text-lg font-bold text-white">
                          {donationType === "package"
                            ? "Package Details"
                            : "Donation Details"}
                        </h3>

                        {donationType === "package" && currentPkg && (
                          <div className="flex items-start gap-3">
                            <svg
                              aria-hidden="true"
                              className="mt-0.5 shrink-0 text-brand-soft"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                              <path d="m3.3 7 8.7 5 8.7-5" />
                              <path d="M12 22V12" />
                            </svg>
                            <div>
                              <p className="text-sm font-semibold text-white">
                                {currentPkg.name}
                              </p>
                              <ul className="mt-1 flex list-disc flex-col gap-1 pl-4 text-xs text-white/50">
                                {currentPkg.perks.map((perk) => (
                                  <li key={perk}>{perk}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        <div className="rounded-xl border border-brand-soft/40 bg-brand-soft/5 px-5 py-4">
                          <p className="text-xs text-white/50">
                            {donationType === "package"
                              ? "Package Amount"
                              : "Donation Amount"}
                          </p>
                          <p className="mt-1 text-2xl font-bold text-brand-soft">
                            {formatRupiah(finalAmount)}
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/20 px-5 py-4">
                          <p className="text-xs text-white/50">Payment Type</p>
                          <p className="mt-1 text-sm font-semibold text-white">
                            {donationType === "package" ? "Package" : "Custom"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/50 hover:bg-white/5"
                    >
                      Edit Information
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex min-w-[13rem] items-center justify-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover disabled:opacity-50"
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
                        strokeLinejoin="round"
                      >
                        <rect
                          x="1"
                          y="4"
                          width="22"
                          height="16"
                          rx="2"
                          ry="2"
                        />
                        <line x1="1" y1="10" x2="23" y2="10" />
                      </svg>
                      {submitting ? "Processing..." : "Proceed to Payment"}
                    </button>
                  </div>

                  {errorMsg && (
                    <p className="text-center text-sm font-medium text-red-400">
                      {errorMsg}
                    </p>
                  )}
                </>
              );
            })()}
        </form>
      )}
    </main>
  );
}
