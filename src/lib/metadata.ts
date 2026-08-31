import type { Metadata } from "next";
import { SITE_NAME } from "./site";

interface PageMetadataInput {
  /** Route-level title. The root layout wraps it as "<title> | RIVAL ITS". */
  title: string;
  description: string;
  /**
   * Site-relative path this page canonicalises to, e.g. "/teams".
   * Resolved against `metadataBase`, so a page is never mistaken for a
   * duplicate of the same content reached through a different URL.
   */
  path: string;
  keywords?: readonly string[];
}

/**
 * Builds the metadata for a route: canonical URL plus the Open Graph and
 * Twitter blocks that social crawlers read.
 *
 * Open Graph images are deliberately *not* set here — the generated
 * `opengraph-image`/`twitter-image` at the app root applies to every route
 * that does not override it, so setting images here would shadow it.
 */
export function buildMetadata({
  title,
  description,
  path,
  keywords,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    keywords: keywords ? [...keywords] : undefined,
    alternates: {
      canonical: path,
    },
    openGraph: {
      // og:title carries the full, unwrapped name: a social card has no tab
      // strip to give the "| RIVAL ITS" suffix its context.
      title: `${title} | ${SITE_NAME}`,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
      locale: "id_ID",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}
