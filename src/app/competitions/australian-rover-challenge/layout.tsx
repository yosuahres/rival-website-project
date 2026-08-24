import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Australian Rover Challenge",
  description:
    "RIVAL ITS at the Australian Rover Challenge: mission tasks, rover systems, and results.",
};

export default function AustralianRoverChallengeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
