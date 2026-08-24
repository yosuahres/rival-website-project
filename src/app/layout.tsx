import type { Metadata } from "next";
import { Inter, Roboto_Flex, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Layout from "@/layouts/Layout";

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
  title: {
    default: "RIVAL ITS — Robotics Rover Team of ITS",
    template: "%s | RIVAL ITS",
  },
  description:
    "RIVAL ITS is the robotics rover research team of Institut Teknologi Sepuluh Nopember, competing in the Australian Rover Challenge and the Indonesian Robot Contest.",
  applicationName: "RIVAL ITS",
  keywords: [
    "RIVAL ITS",
    "ITS robotics",
    "rover team",
    "Australian Rover Challenge",
    "Indonesian Robot Contest",
    "Institut Teknologi Sepuluh Nopember",
  ],
  openGraph: {
    siteName: "RIVAL ITS",
    type: "website",
    locale: "en_US",
  },
  icons: {
    icon: "/favicon.ico",
  },
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
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
