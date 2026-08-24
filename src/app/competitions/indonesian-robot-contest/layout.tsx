import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Indonesian Robot Contest",
  description:
    "RIVAL ITS at the Kontes Robot Indonesia (Indonesian Robot Contest): categories, robots, and achievements.",
};

export default function IndonesianRobotContestLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
