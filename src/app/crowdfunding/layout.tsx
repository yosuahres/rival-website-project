import { Exo_2 } from "next/font/google";
import BackgroundShapes from "@/components/crowdfunding/BackgroundShapes";
import Header from "@/components/crowdfunding/Header";
import SiteChrome from "@/components/crowdfunding/SiteChrome";
import { buildMetadata } from "@/lib/metadata";

// Display face for the crowdfunding headings. It is loaded here rather than in
// the root layout so the rest of the site does not pay for a family only these
// pages use.
const exo2 = Exo_2({
  variable: "--font-exo2",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata = buildMetadata({
  title: "Crowdfunding",
  description:
    "Support RIVAL ITS. Every contribution funds the rover our team takes to the Australian Rover Challenge and the Indonesian Robot Contest.",
  path: "/crowdfunding",
  keywords: [
    "RIVAL ITS crowdfunding",
    "donate RIVAL ITS",
    "support ITS rover team",
    "robotics team donation",
  ],
});

export default function CrowdfundingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // The section carries its own dark-green ground, aurora backdrop, and a
  // stripped-back header of its own — the site navbar and footer stand down
  // here (see layouts/Layout.tsx), and this section carries no footer at all.
  // SiteChrome drops the header again on the admin page, which renders its
  // own shell.
  return (
    <div
      className={`${exo2.variable} relative isolate flex min-h-screen flex-col bg-[#0a1f10]`}
    >
      <BackgroundShapes />
      <SiteChrome>
        <Header />
      </SiteChrome>
      <div className="flex-1">{children}</div>
    </div>
  );
}
