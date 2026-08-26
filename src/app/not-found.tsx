import type { Metadata } from "next";
import NotFoundContent from "@/components/NotFoundContent";

// The 404 response status already keeps this out of the index; the explicit
// directive covers crawlers that reach the page through a soft-404 render.
export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundContent />;
}
