import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Inter, Roboto_Flex, Space_Grotesk } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import Layout from "@/layouts/Layout";
import { withBasePath } from "@/lib/base-path";
import {
  IS_PRODUCTION_DOMAIN,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";
import { organizationSchema, websiteSchema } from "@/lib/structured-data";

// Inter carries the site; Space Grotesk is reserved for the hero display
// headline, so it is loaded as a second family rather than the default.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

// The hero wordmark is set in locked caps, so it needs a face with a real
// width axis rather than a tracking hack. Roboto Flex carries the widest one
// on offer here (up to 151%); the axis is requested explicitly because
// next/font ships only `wght` otherwise.
const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-roboto-flex",
});

// `title.template` wraps whatever each route exports, so a route only has to
// name itself ("Teams") and the browser tab reads "Teams | RIVAL ITS".
export const metadata: Metadata = {
  // Every relative URL in metadata — canonicals, og:url, og:image — is
  // resolved against this. Without it Next emits relative values that
  // crawlers cannot follow, which is why it has to be set even in dev.
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} Team`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  // The home page canonicalises to the root; every other route overrides this
  // with its own path via `buildMetadata`.
  alternates: {
    canonical: "/",
  },
  keywords: [
    "RIVAL ITS",
    "ITS robotics",
    "rover team",
    "Australian Rover Challenge",
    "Indonesian Robot Contest",
    "Institut Teknologi Sepuluh Nopember",
    "KRI",
    "Kontes Robot Indonesia",
    "robotics team Surabaya",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  // Holds indexing back while the site still points at the placeholder origin;
  // see `IS_PRODUCTION_DOMAIN` in lib/site.
  robots: IS_PRODUCTION_DOMAIN
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          // Let Google use full-length previews and large image thumbnails
          // instead of the conservative defaults.
          "max-snippet": -1,
          "max-image-preview": "large",
          "max-video-preview": -1,
        },
      }
    : { index: false, follow: false },
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "id_ID",
    alternateLocale: ["en_US"],
    url: "/",
    title: `${SITE_NAME} — ITS Robotics Rover Research Team`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ITS Robotics Rover Research Team`,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: withBasePath("/favicon.ico"),
  },
  manifest: withBasePath("/manifest.webmanifest"),
  // Stops iOS Safari from linkifying phone-like strings (scores, years) into
  // tap-to-call links, which also keeps the rendered markup stable.
  formatDetection: {
    telephone: false,
  },
};

// Split out from `metadata` because Next requires viewport-level fields in
// their own export.
export const viewport: Viewport = {
  themeColor: "#121317",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${robotoFlex.variable}`}
    >
      <body className="antialiased">
        {/* Site-wide entity markup. It lives in the root layout so the
            Organization and WebSite blocks are present on every page, which is
            what lets search engines resolve them into a single entity. */}
        <JsonLd schema={organizationSchema()} />
        <JsonLd schema={websiteSchema()} />
        <Layout>{children}</Layout>
        <Analytics />
      </body>
    </html>
  );
}
