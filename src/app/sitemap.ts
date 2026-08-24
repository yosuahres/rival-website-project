import type { MetadataRoute } from "next";
import { INDEXABLE_ROUTES } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

// Static export: the sitemap is built once per deploy, which is the right
// cadence for a site whose pages ship with the code rather than from a CMS.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // One timestamp for the whole build. Per-page `lastModified` would need real
  // per-page edit times; stamping "now" on every page individually would just
  // claim everything changed on every deploy, which crawlers learn to ignore.
  const lastModified = new Date();

  return INDEXABLE_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  }));
}
