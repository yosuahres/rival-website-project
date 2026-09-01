import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

/**
 * Supabase client authenticated with the service role key.
 *
 * Everything that writes to an existing donation goes through this: there is
 * deliberately no UPDATE policy on public.donations, so the anon key a browser
 * holds cannot mark a donation paid. Returns null rather than throwing when
 * the key is absent, so each route can answer with its own status code.
 *
 * Never import this from a client component.
 */
export function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) return null;

  return createClient<Database>(supabaseUrl, serviceRoleKey);
}
