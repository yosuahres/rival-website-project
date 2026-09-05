import type { MetadataRoute } from "next";
import { withBasePath } from "@/lib/base-path";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — ${SITE_TAGLINE}`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    // Matches the site's default locale, so an installed PWA announces itself
    // in the same language a first-time visitor lands in.
    lang: "en",
    start_url: withBasePath("/"),
    display: "standalone",
    background_color: "#121317",
    theme_color: "#121317",
    icons: [
      {
        src: withBasePath("/favicon.ico"),
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: withBasePath("/images/brand/logo-vertical.webp"),
        sizes: "512x512",
        type: "image/webp",
        purpose: "any",
      },
    ],
  };
}
