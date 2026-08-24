import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Partners",
  description:
    "The sponsors and institutional partners supporting RIVAL ITS on the road to international rover competitions.",
  path: "/partners",
  keywords: [
    "RIVAL ITS sponsors",
    "robotics sponsorship",
    "partners",
    "supporting a student rover team",
  ],
});

export default function PartnersLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
