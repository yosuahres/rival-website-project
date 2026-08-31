"use client";

import { usePathname } from "next/navigation";

/** Hides the crowdfunding header/footer on the admin page, which renders its own shell. */
export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname?.startsWith("/crowdfunding/admin")) return null;

  return <>{children}</>;
}
