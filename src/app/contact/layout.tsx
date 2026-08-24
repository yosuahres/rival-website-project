import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Get in touch with RIVAL ITS for sponsorship, collaboration, or media enquiries.",
  path: "/contact",
  keywords: [
    "contact RIVAL ITS",
    "sponsorship enquiry",
    "robotics collaboration",
    "media enquiry",
  ],
});

export default function ContactLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
