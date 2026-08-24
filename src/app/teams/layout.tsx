import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Teams",
  description:
    "Meet the divisions and members that build, program, and operate the RIVAL ITS rovers.",
  path: "/teams",
  keywords: [
    "RIVAL ITS members",
    "rover divisions",
    "mechanical electrical software",
    "robotics engineering team",
  ],
});

export default function TeamsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
