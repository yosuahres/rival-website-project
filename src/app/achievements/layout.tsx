import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Achievements",
  description:
    "The RIVAL ITS hall of fame: every placing and award the team has taken at the Australian Rover Challenge and Indonesian robotics competitions.",
  path: "/achievements",
  keywords: [
    "RIVAL ITS achievements",
    "hall of fame",
    "Australian Rover Challenge results",
    "Best Rookie Team",
    "Indonesian Robot Contest winner",
  ],
});

export default function AchievementsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
