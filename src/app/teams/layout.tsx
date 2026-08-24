import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teams",
  description:
    "Meet the divisions and members that build, program, and operate the RIVAL ITS rovers.",
};

export default function TeamsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
