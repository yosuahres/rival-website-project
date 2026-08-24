import {
  ADDRESS,
  absoluteUrl,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  PARENT_ORGANIZATION,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SOCIAL_PROFILES,
} from "./site";

/**
 * The organisation behind the site, as a Schema.org entity.
 *
 * `@id` is a stable identifier rather than a URL that has to resolve: other
 * blocks reference it so search engines merge them into one entity instead of
 * reading each page's markup as a separate organisation.
 */
export const ORGANIZATION_ID = absoluteUrl("/#organization");

const WEBSITE_ID = absoluteUrl("/#website");

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    alternateName: SITE_TAGLINE,
    description: SITE_DESCRIPTION,
    url: absoluteUrl("/"),
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/images/brand/logo-vertical.webp"),
    },
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: PARENT_ORGANIZATION,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: ADDRESS.locality,
      addressRegion: ADDRESS.region,
      addressCountry: ADDRESS.country,
    },
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "general enquiries",
      email: CONTACT_EMAIL,
      telephone: CONTACT_PHONE,
      availableLanguage: ["en", "id"],
    },
    // Links the site to the profiles that describe the same team, which is
    // what lets a knowledge panel resolve them as one entity.
    sameAs: [...SOCIAL_PROFILES],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: absoluteUrl("/"),
    inLanguage: ["en", "id"],
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/**
 * A breadcrumb trail for a nested page, so results show
 * "rival › Competitions › Australian Rover Challenge" rather than a bare URL.
 *
 * Pass the trail without the home crumb; it is prepended here.
 */
export function breadcrumbSchema(
  trail: readonly { name: string; path: string }[],
) {
  const items = [{ name: "Home", path: "/" }, ...trail];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
