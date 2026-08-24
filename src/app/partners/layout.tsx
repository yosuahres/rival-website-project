import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "The sponsors and institutional partners supporting RIVAL ITS on the road to international rover competitions.",
};

export default function PartnersLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
