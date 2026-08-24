import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "About",
  description:
    "Who we are: the history, vision, and mission behind RIVAL ITS, the rover research team of Institut Teknologi Sepuluh Nopember.",
  path: "/about",
  keywords: [
    "about RIVAL ITS",
    "ITS rover team history",
    "vision and mission",
    "robotics research team",
  ],
});

export default function AboutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
