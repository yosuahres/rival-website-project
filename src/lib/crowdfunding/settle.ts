import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

type Client = SupabaseClient<Database>;

export type SettleOutcome =
  | { kind: "settled"; status: "success" | "failed" }
  | { kind: "already"; status: "success" | "failed" }
  | { kind: "unchanged"; status: "pending" }
  | { kind: "not-found" }
  | { kind: "amount-mismatch"; expected: number; received: number }
  | { kind: "error"; message: string };

/**
 * Writes the outcome of a Duitku payment onto a donation.
 *
 * Shared by the two things that can learn a payment's fate — the callback
 * Duitku pushes, and the transactionStatus call a donor triggers by hand —
 * because both need exactly the same guards and getting them subtly different
 * is how a donation ends up settled twice or walked backwards.
 *
 * The guards, in order:
 *   - the amount must match what was recorded, so a row edited after the
 *     transaction was created never settles;
 *   - a donation already marked success is never touched again, so retries,
 *     dashboard resends, and an impatient donor are all idempotent;
 *   - `pending` is written as nothing at all rather than as a status, since
 *     Duitku reports "still waiting" and "failed" with different codes.
 */
export async function settleDonation(
  supabase: Client,
  {
    invoiceNumber,
    amount,
    status,
    reference,
  }: {
    invoiceNumber: string;
    /** Amount Duitku reported. Skipped when null (the caller has no figure). */
    amount: number | null;
    status: "success" | "failed" | "pending";
    reference?: string | null;
  },
): Promise<SettleOutcome> {
  const { data: donation, error: lookupError } = await supabase
    .from("donations")
    .select("id, amount, payment_status")
    .eq("invoice_number", invoiceNumber)
    .maybeSingle();

  if (lookupError) {
    return { kind: "error", message: lookupError.message };
  }

  if (!donation) return { kind: "not-found" };

  if (amount !== null && Number(amount) !== Number(donation.amount)) {
    return {
      kind: "amount-mismatch",
      expected: Number(donation.amount),
      received: Number(amount),
    };
  }

  const current = donation.payment_status;

  // Settled is settled. Never reopen, never flip success to failed.
  if (current === "success" || current === "failed") {
    return { kind: "already", status: current };
  }

  if (status === "pending") return { kind: "unchanged", status: "pending" };

  const { error: updateError } = await supabase
    .from("donations")
    .update({
      payment_status: status,
      ...(reference ? { duitku_reference: reference } : {}),
    })
    .eq("id", donation.id);

  if (updateError) {
    return { kind: "error", message: updateError.message };
  }

  return { kind: "settled", status };
}
