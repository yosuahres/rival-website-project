import JsonLd from "@/components/JsonLd";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata = buildMetadata({
  title: "Australian Rover Challenge",
  description:
    "RIVAL ITS at the Australian Rover Challenge: mission tasks, rover systems, and results.",
  path: "/competitions/australian-rover-challenge",
  keywords: [
    "Australian Rover Challenge",
    "ARCh",
    "Mars rover competition",
    "RIVAL ITS rover",
  ],
});

// Gives results a "Home › Australian Rover Challenge" trail instead of a
// raw URL. There is no /competitions index page, so no intermediate crumb is
// emitted: two crumbs sharing one URL is invalid BreadcrumbList markup.
const BREADCRUMBS = breadcrumbSchema([
  {
    name: "Australian Rover Challenge",
    path: "/competitions/australian-rover-challenge",
  },
]);

export default function AustralianRoverChallengeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <JsonLd schema={BREADCRUMBS} />
      {children}
    </>
  );
}
