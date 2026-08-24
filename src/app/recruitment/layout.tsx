import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open Recruitment 2026",
  description:
    "Requirements, timeline, and application details for RIVAL ITS Open Recruitment 2026, open to ITS undergraduates of the Class of 2026.",
};

export default function RecruitmentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
