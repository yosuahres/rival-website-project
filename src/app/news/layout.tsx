import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News",
  description:
    "Latest announcements, press coverage, and competition results from RIVAL ITS.",
};

export default function NewsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
