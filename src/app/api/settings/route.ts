import { createClient as createServiceClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/crowdfunding/settings";

// public.site_settings has no UPDATE policy, so writing needs the service
// role key — same pattern as the donation delete/proof routes.
function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) return null;
  return createServiceClient(supabaseUrl, serviceRoleKey);
}

/** Parses one amount field, rejecting anything that is not a finite number. */
function parseAmount(
  value: unknown,
  label: string,
): number | { error: string } {
  const parsed =
    typeof value === "string"
      ? Number(value.replace(/[^\d.-]/g, ""))
      : Number(value);

  if (!Number.isFinite(parsed)) return { error: `${label} must be a number.` };
  if (parsed < 0) return { error: `${label} cannot be negative.` };

  return Math.round(parsed);
}

export async function GET() {
  return NextResponse.json({ settings: await getSiteSettings() });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const current = parseAmount(body.current_amount, "Dana terkumpul");
    if (typeof current !== "number") {
      return NextResponse.json({ error: current.error }, { status: 400 });
    }

    const goal = parseAmount(body.goal_amount, "Target dana");
    if (typeof goal !== "number") {
      return NextResponse.json({ error: goal.error }, { status: 400 });
    }

    if (goal <= 0) {
      return NextResponse.json(
        { error: "Target dana harus lebih dari 0." },
        { status: 400 },
      );
    }

    const supabase = getServiceClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase service role is not configured on server." },
        { status: 500 },
      );
    }

    // Upsert so the row is created on first save even if the seed never ran.
    const { data, error } = await supabase
      .from("site_settings")
      .upsert(
        {
          id: 1,
          current_amount: current,
          goal_amount: goal,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      )
      .select("current_amount, goal_amount")
      .single();

    if (error) {
      console.error("Supabase settings update error:", error);
      return NextResponse.json(
        { error: "Gagal menyimpan pengaturan." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Pengaturan tersimpan.",
      settings: {
        current_amount: Number(data.current_amount),
        goal_amount: Number(data.goal_amount),
      },
    });
  } catch (err) {
    console.error("Settings API error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
