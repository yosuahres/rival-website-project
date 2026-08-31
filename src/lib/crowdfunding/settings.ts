import { createClient } from "@/lib/supabase/server";

export interface SiteSettings {
  current_amount: number;
  goal_amount: number;
}

/** Values used before the settings row exists (or if Supabase is unreachable). */
export const DEFAULT_SETTINGS: SiteSettings = {
  current_amount: 3_100_000,
  goal_amount: 50_000_000,
};

/**
 * Reads the single public.site_settings row. Falls back to DEFAULT_SETTINGS so
 * the landing page still renders a sane progress bar if the query fails.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("site_settings")
    .select("current_amount, goal_amount")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error("Failed to load site settings:", error);
    return DEFAULT_SETTINGS;
  }

  if (!data) return DEFAULT_SETTINGS;

  return {
    current_amount: Number(data.current_amount),
    goal_amount: Number(data.goal_amount),
  };
}
