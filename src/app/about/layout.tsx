import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Who we are: the history, vision, and mission behind RIVAL ITS, the rover research team of Institut Teknologi Sepuluh Nopember.",
};

export default function AboutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
