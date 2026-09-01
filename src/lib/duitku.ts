/**
 * Duitku payment gateway (API v2, "Pop"-less / direct integration).
 *
 * Three calls are wrapped here, all POST + JSON:
 *
 *   getPaymentMethod  — the channels enabled on the project, for one amount.
 *   v2/inquiry        — creates the transaction; this is what hands back the
 *                       virtual-account number / QR string / payment page.
 *   transactionStatus — server-side confirmation of a merchantOrderId.
 *
 * Every call is authenticated with an HMAC-SHA256 of a per-endpoint string,
 * keyed by the project's API key. Duitku's older MD5/plain-SHA256 signatures
 * are documented as obsolete, so only the HMAC form is implemented.
 *
 * Docs: https://docs.duitku.com/api/id/
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import { SITE_URL } from "@/lib/site";

const ENDPOINTS = {
  sandbox: "https://sandbox.duitku.com/webapi/api/merchant",
  production: "https://passport.duitku.com/webapi/api/merchant",
} as const;

/** Duitku's server gives up after 5 attempts, so keep our calls short. */
const REQUEST_TIMEOUT_MS = 15_000;

export interface DuitkuConfig {
  merchantCode: string;
  apiKey: string;
  baseUrl: string;
  callbackUrl: string;
  returnUrl: string;
  /** Minutes a transaction stays payable; undefined lets Duitku decide. */
  expiryPeriod?: number;
}

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * `trailingSlash: true` in next.config.ts means Next answers `/api/x` with a
 * 308 to `/api/x/`. Duitku posts the callback without following redirects, so
 * the URL it is handed has to already carry the slash.
 */
function absoluteApiUrl(path: string): string {
  return `${SITE_URL}${BASE_PATH}${path.replace(/\/?$/, "/")}`;
}

/**
 * Reads the Duitku credentials, or returns null when they are not set.
 *
 * Returning null rather than throwing is deliberate: the support page falls
 * back to the manual QRIS + transfer-proof flow when the gateway is not
 * configured, so a fresh checkout of the repo keeps working without keys.
 */
export function getDuitkuConfig(): DuitkuConfig | null {
  const merchantCode = process.env.DUITKU_MERCHANT_CODE?.trim();
  const apiKey = process.env.DUITKU_API_KEY?.trim();

  if (!merchantCode || !apiKey) return null;

  const env =
    process.env.DUITKU_ENV?.trim().toLowerCase() === "production"
      ? "production"
      : "sandbox";

  const expiry = Number(process.env.DUITKU_EXPIRY_MINUTES);

  return {
    merchantCode,
    apiKey,
    baseUrl: ENDPOINTS[env],
    callbackUrl:
      process.env.DUITKU_CALLBACK_URL?.trim() ||
      absoluteApiUrl("/api/duitku/callback"),
    returnUrl:
      process.env.DUITKU_RETURN_URL?.trim() ||
      `${SITE_URL}${BASE_PATH}/crowdfunding/payment/`,
    expiryPeriod: Number.isFinite(expiry) && expiry > 0 ? expiry : undefined,
  };
}

export const isDuitkuConfigured = (): boolean => getDuitkuConfig() !== null;

function sign(stringToSign: string, apiKey: string): string {
  return createHmac("sha256", apiKey).update(stringToSign).digest("hex");
}

/** Constant-time compare so a bad callback cannot be brute-forced byte by byte. */
export function signaturesMatch(a: string, b: string): boolean {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

/**
 * `yyyy-MM-dd HH:mm:ss` in Asia/Jakarta, which is what getPaymentMethod
 * expects — it is part of the signed string, so a wrong zone is rejected.
 */
export function jakartaDatetime(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    // h23, not `hour12: false` — the latter renders midnight as "24" on some
    // ICU builds, and the datetime is part of the signed string.
    hourCycle: "h23",
  }).formatToParts(now);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "00";

  return (
    `${get("year")}-${get("month")}-${get("day")} ` +
    `${get("hour")}:${get("minute")}:${get("second")}`
  );
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    cache: "no-store",
  });

  const text = await response.text();

  if (!response.ok) {
    // Duitku answers errors with `{ "Message": "..." }` on 4xx/5xx, but a
    // gateway outage can return HTML, so fall back to the raw body.
    let message = text.slice(0, 200);
    try {
      const parsed = JSON.parse(text);
      message = parsed.Message ?? parsed.statusMessage ?? message;
    } catch {}
    throw new Error(`Duitku ${response.status}: ${message}`);
  }

  return JSON.parse(text) as T;
}

// ── Get Payment Method ──────────────────────────────────────

export interface DuitkuPaymentMethod {
  paymentMethod: string;
  paymentName: string;
  paymentImage: string;
  totalFee: string;
}

interface PaymentMethodResponse {
  paymentFee?: DuitkuPaymentMethod[];
  responseCode: string;
  responseMessage: string;
}

/**
 * Channels active on the project for `amount`, with the fee each one adds.
 * The fee is informational — Duitku charges it on top at the gateway, the
 * donation itself is still `amount`.
 */
export async function getPaymentMethods(
  config: DuitkuConfig,
  amount: number,
): Promise<DuitkuPaymentMethod[]> {
  const datetime = jakartaDatetime();
  const result = await postJson<PaymentMethodResponse>(
    `${config.baseUrl}/paymentmethod/getpaymentmethod`,
    {
      merchantcode: config.merchantCode,
      amount: String(amount),
      datetime,
      signature: sign(
        `${config.merchantCode}${amount}${datetime}`,
        config.apiKey,
      ),
    },
  );

  if (result.responseCode !== "00") {
    throw new Error(
      `Duitku getPaymentMethod ${result.responseCode}: ${result.responseMessage}`,
    );
  }

  return result.paymentFee ?? [];
}

// ── Request Transaction ─────────────────────────────────────

export interface DuitkuTransactionInput {
  /** Our invoice number; must be unique per attempt. Max 50 chars. */
  merchantOrderId: string;
  paymentAmount: number;
  paymentMethod: string;
  productDetails: string;
  email: string;
  /** Shown on the bank's confirmation screen. Duitku caps this at 20 chars. */
  customerVaName: string;
  phoneNumber?: string;
  customerDetail?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    billingAddress?: Record<string, string>;
    shippingAddress?: Record<string, string>;
  };
  itemDetails?: { name: string; price: number; quantity: number }[];
}

export interface DuitkuTransaction {
  merchantCode: string;
  reference: string;
  paymentUrl: string;
  vaNumber?: string;
  qrString?: string;
  amount: string;
  statusCode: string;
  statusMessage: string;
}

export async function requestTransaction(
  config: DuitkuConfig,
  input: DuitkuTransactionInput,
): Promise<DuitkuTransaction> {
  const { merchantOrderId, paymentAmount } = input;

  const result = await postJson<DuitkuTransaction>(
    `${config.baseUrl}/v2/inquiry`,
    {
      merchantCode: config.merchantCode,
      paymentAmount,
      paymentMethod: input.paymentMethod,
      merchantOrderId,
      productDetails: input.productDetails,
      email: input.email,
      customerVaName: input.customerVaName,
      phoneNumber: input.phoneNumber,
      customerDetail: input.customerDetail,
      itemDetails: input.itemDetails,
      callbackUrl: config.callbackUrl,
      returnUrl: config.returnUrl,
      signature: sign(
        `${config.merchantCode}${merchantOrderId}${paymentAmount}`,
        config.apiKey,
      ),
      ...(config.expiryPeriod ? { expiryPeriod: config.expiryPeriod } : {}),
    },
  );

  if (result.statusCode !== "00") {
    throw new Error(
      `Duitku inquiry ${result.statusCode}: ${result.statusMessage}`,
    );
  }

  return result;
}

// ── Callback ────────────────────────────────────────────────

/** `stringToSign = merchantCode + amount + merchantOrderId`. */
export function callbackSignature(
  config: DuitkuConfig,
  amount: string,
  merchantOrderId: string,
): string {
  return sign(
    `${config.merchantCode}${amount}${merchantOrderId}`,
    config.apiKey,
  );
}

// ── Check Transaction ───────────────────────────────────────

export interface DuitkuStatus {
  merchantOrderId: string;
  reference: string;
  amount: string;
  fee: string;
  /** 00 success, 01 pending, 02 canceled. */
  statusCode: string;
  statusMessage: string;
}

/**
 * Server-side status for one order.
 *
 * Duitku rate-limits this endpoint and blocks the caller for roughly an hour
 * once the ceiling is hit, so never poll it — it exists for manual
 * reconciliation of a payment whose callback went missing.
 */
export async function checkTransactionStatus(
  config: DuitkuConfig,
  merchantOrderId: string,
): Promise<DuitkuStatus> {
  return postJson<DuitkuStatus>(`${config.baseUrl}/transactionStatus`, {
    merchantCode: config.merchantCode,
    merchantOrderId,
    signature: sign(`${config.merchantCode}${merchantOrderId}`, config.apiKey),
  });
}
