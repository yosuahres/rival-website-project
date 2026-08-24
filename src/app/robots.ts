import type { MetadataRoute } from "next";
import { absoluteUrl, IS_PRODUCTION_DOMAIN } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // Until a real domain is configured, every absolute URL we emit points at the
  // placeholder origin. Advertising that to crawlers would get the wrong host
  // indexed, so hold indexing back rather than publish a broken canonical.
  if (!IS_PRODUCTION_DOMAIN) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Route handlers return JSON, never anything worth indexing.
        disallow: ["/api/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
