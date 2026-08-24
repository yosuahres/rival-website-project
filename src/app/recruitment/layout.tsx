import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Recruitment",
  description:
    "Requirements, timeline, and application details for RIVAL ITS Open Recruitment 2026, open to ITS undergraduates of the Class of 2026.",
  path: "/recruitment",
  keywords: [
    "RIVAL ITS open recruitment",
    "open recruitment 2026",
    "ITS student robotics",
    "join a rover team",
  ],
});

export default function RecruitmentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
