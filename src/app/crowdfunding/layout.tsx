import Header from "@/components/crowdfunding/Header";
import SiteChrome from "@/components/crowdfunding/SiteChrome";
import { buildMetadata } from "@/lib/metadata";

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
  // The section sits on the site's own ground and palette — it used to carry a
  // separate dark-green scheme, a drifting aurora backdrop, and its own display
  // face (Exo 2), which together read as a different product. The ground is now
  // flat like every other page, and headings use Space Grotesk from the root
  // layout, the same face the rest of the site sets display type in.
  //
  // It keeps a stripped-back header of its own: the site navbar and footer
  // stand down here (see layouts/Layout.tsx), and this section carries no
  // footer at all. SiteChrome drops the header again on the admin page, which
  // renders its own shell.
  return (
    <div className="relative isolate flex min-h-screen flex-col bg-background">
      <SiteChrome>
        <Header />
      </SiteChrome>
      <div className="flex-1">{children}</div>
    </div>
  );
}
