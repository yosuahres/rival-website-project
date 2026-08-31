/**
 * Reads a required Supabase environment variable.
 *
 * The three clients in this directory used non-null assertions, which turn a
 * missing key into an opaque "Invalid URL" from deep inside supabase-js.
 * Failing here instead names the variable that is actually missing.
 */
function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy .env.example to .env.local and fill it in.`,
    );
  }
  return value;
}

export const SUPABASE_URL = () =>
  requireEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);

export const SUPABASE_ANON_KEY = () =>
  requireEnv(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
