import type { MetadataRoute } from "next";

type SitemapEntry = {
  path: string;
  /** Relative weight within this site only; it is not a cross-site ranking. */
  priority: number;
  changeFrequency: NonNullable<
    MetadataRoute.Sitemap[number]["changeFrequency"]
  >;
};

/**
 * Every indexable page on the site, in crawl-priority order.
 *
 * This is the list the sitemap is generated from. A new route under
 * `src/app` is invisible to search engines until it is added here, so add the
 * entry in the same change that adds the page.
 */
export const INDEXABLE_ROUTES: readonly SitemapEntry[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  // Recruitment is time-boxed and the page people actively search for during
  // an open cycle, so it ranks just under the home page.
  { path: "/recruitment", priority: 0.9, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  {
    path: "/competitions/australian-rover-challenge",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/competitions/indonesian-robot-contest",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  { path: "/teams", priority: 0.7, changeFrequency: "monthly" },
  { path: "/news", priority: 0.7, changeFrequency: "weekly" },
  { path: "/partners", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
] as const;
