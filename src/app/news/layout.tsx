import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "News",
  description:
    "Latest announcements, press coverage, and competition results from RIVAL ITS.",
  path: "/news",
  keywords: [
    "RIVAL ITS news",
    "competition results",
    "robotics press coverage",
    "ITS robotics achievements",
  ],
});

export default function NewsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
