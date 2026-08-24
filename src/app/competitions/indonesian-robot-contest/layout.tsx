import JsonLd from "@/components/JsonLd";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata = buildMetadata({
  title: "Indonesian Robot Contest",
  description:
    "RIVAL ITS at the Kontes Robot Indonesia (Indonesian Robot Contest): categories, robots, and achievements.",
  path: "/competitions/indonesian-robot-contest",
  keywords: [
    "Indonesian Robot Contest",
    "Kontes Robot Indonesia",
    "KRI",
    "RIVAL ITS robots",
  ],
});

// Gives results a "Home › Indonesian Robot Contest" trail instead of a
// raw URL. There is no /competitions index page, so no intermediate crumb is
// emitted: two crumbs sharing one URL is invalid BreadcrumbList markup.
const BREADCRUMBS = breadcrumbSchema([
  {
    name: "Indonesian Robot Contest",
    path: "/competitions/indonesian-robot-contest",
  },
]);

export default function IndonesianRobotContestLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <JsonLd schema={BREADCRUMBS} />
      {children}
    </>
  );
}
