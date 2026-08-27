/**
 * Single source of truth for everything SEO needs to know about the site:
 * where it lives, what it is called, and how to reach it. Metadata, the
 * sitemap, robots.txt, the web manifest, and the JSON-LD blocks all read from
 * here so a change lands everywhere at once.
 */

/**
 * Absolute origin of the deployed site, with no trailing slash.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL — set this in production once the domain is fixed.
 *   2. VERCEL_PROJECT_PRODUCTION_URL — Vercel injects the stable production
 *      hostname (bare, no scheme), which keeps preview builds pointing at the
 *      real canonical rather than at their own throwaway URL.
 *   3. localhost — dev fallback so `next build` never emits a bare relative
 *      canonical, which crawlers treat as self-referential and ignore.
 *
 * TODO: replace the placeholder below with the real domain when it is chosen,
 * or set NEXT_PUBLIC_SITE_URL in the deployment environment and leave it.
 */
const PLACEHOLDER_ORIGIN = "http://localhost:3000";

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel.replace(/\/+$/, "")}`;

  return PLACEHOLDER_ORIGIN;
}

export const SITE_URL = resolveSiteUrl();

/** True once a real domain is configured — used to gate indexing. */
export const IS_PRODUCTION_DOMAIN = SITE_URL !== PLACEHOLDER_ORIGIN;

export const SITE_NAME = "RIVAL ITS";

export const SITE_TAGLINE = "ITS Robotics Rover Research Team";

export const SITE_DESCRIPTION =
  "RIVAL ITS is the robotics rover research team of Institut Teknologi Sepuluh Nopember, competing in the Australian Rover Challenge and the Indonesian Robot Contest.";

/** Legal/institutional parent, used by the Organization JSON-LD. */
export const PARENT_ORGANIZATION = "Institut Teknologi Sepuluh Nopember";

export const CONTACT_EMAIL = "official.krtmiits@gmail.com";

export const CONTACT_PHONE = "+62882003127741";

/** wa.me deep link for CONTACT_PHONE — the API takes bare digits, no `+`. */
export const WHATSAPP_URL = `https://wa.me/${CONTACT_PHONE.replace(/\D/g, "")}`;

export const ADDRESS = {
  locality: "Surabaya",
  region: "East Java",
  country: "ID",
} as const;

/** Profile URLs, emitted as `sameAs` so search engines can link the entity. */
export const SOCIAL_PROFILES = [
  "https://instagram.com/rival_its",
  "https://linkedin.com/company/rival-its",
  "https://tiktok.com/@rival_its",
] as const;

/** Absolute URL for a site-relative path. */
export const absoluteUrl = (path = "/"): string => `${SITE_URL}${path}`;
