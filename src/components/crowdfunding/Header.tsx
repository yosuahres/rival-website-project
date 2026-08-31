import Image from "next/image";
import Link from "next/link";

/**
 * The crowdfunding section's own bar, standing in for the site navbar (see
 * layouts/Layout.tsx). Its outer padding, max width, and logo size deliberately
 * mirror layouts/Navbar.tsx, so the mark lands in the same spot whichever bar
 * a visitor is looking at.
 */
export default function Header() {
  return (
    <header className="w-full px-4 py-4 md:px-8">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between">
        <Link
          href="/crowdfunding"
          className="flex items-center transition-opacity hover:opacity-80"
        >
          <Image
            src="/assets/logo-1.png"
            alt="RIVAL ITS Logo"
            width={86}
            height={24}
            priority
            className="h-6 w-auto object-contain"
          />
        </Link>

        {/* Same pill as the navbar's "Hubungi Kami", including its hover and
            focus treatment, so the two bars behave identically. */}
        <Link
          href="/"
          className="rounded-full border border-white/25 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/50 hover:bg-white/5"
        >
          Home
        </Link>
      </div>
    </header>
  );
}
