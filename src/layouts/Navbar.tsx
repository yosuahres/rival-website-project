"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "@/i18n";
import { WHATSAPP_URL } from "@/lib/site";
import { SOCIALS } from "@/lib/socials";

export default function Navbar() {
  const { t } = useTranslation();
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProjectsSubMenu, setIsProjectsSubMenu] = useState(false); // NEW
  const [scrolledDown, setScrolledDown] = useState(false);
  const [atTop, setAtTop] = useState(true);

  // Hide the bar while scrolling down, bring it back on the way up.
  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      // Resting at the top the bar has nothing but page background behind it,
      // so it shows none of the scrolled treatment. Tracked separately from
      // the direction below, which deliberately ignores small movements.
      setAtTop(y <= 20);
      const delta = y - lastY;
      // Ignore jitter: only react once the page has actually moved a few
      // pixels, so a trackpad twitch can't flap the bar in and out. lastY is
      // left alone below the threshold so small moves accumulate.
      if (Math.abs(delta) < 6) return;
      // Near the top there is nothing to gain by hiding, and elastic
      // overscroll can report a downward delta while bouncing back.
      setScrolledDown(y > 80 && delta > 0);
      lastY = y;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    // Restoring a page mid-scroll should not start out looking untouched.
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Never slide away with a menu open — it would drag the open panel offscreen.
  const hideNavbar = scrolledDown && !isMobileMenuOpen && !isProjectsOpen;

  // Publish whether the bar is on screen, so a page that pins a bar of its own
  // to the top (see the recruitment page) can step out of the way when this one
  // slides back in. Written onto the body rather than shared through context:
  // the two bars sit in separate layouts with no common provider between them.
  useEffect(() => {
    document.body.dataset.siteNavbarState = hideNavbar ? "hidden" : "shown";
    return () => {
      delete document.body.dataset.siteNavbarState;
    };
  }, [hideNavbar]);

  return (
    <>
      {/* The bar keeps a row of the page's own background to itself rather than
          floating over the hero: it is part of the flow, so every page's first
          image starts below it. Sticky rather than fixed so it still rides
          along once the page scrolls. */}
      <nav
        data-site-navbar
        className={`w-full sticky top-0 left-0 z-50 px-4 md:px-8 py-4 transition-transform duration-300 ease-out ${
          hideNavbar ? "-translate-y-[calc(100%_+_1.5rem)]" : "translate-y-0"
        }`}
      >
        {/* At rest the bar simply continues the page background — nothing is
            behind it to blur or darken. The two layers below cross-fade with
            it as soon as the page moves and content starts passing underneath. */}
        <div
          aria-hidden="true"
          className={`site-navbar-surface pointer-events-none absolute inset-0 transition-opacity duration-300 ${
            atTop ? "opacity-100" : "opacity-0"
          }`}
        />
        {/* Blur that fades out towards the bottom. backdrop-filter cannot be
            graded on its own, so the blurring layer is masked with a gradient
            and extends past the bar so the falloff has room to happen. */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 top-0 -bottom-6 backdrop-blur-lg transition-opacity duration-300 ${
            atTop ? "opacity-0" : "opacity-100"
          }`}
          style={{
            maskImage:
              "linear-gradient(to bottom, #000 0%, #000 45%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, #000 0%, #000 45%, transparent 100%)",
          }}
        />
        {/* Matching dark scrim, so the links stay legible over bright content
            without a hard edge where the bar ends. */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 top-0 -bottom-6 bg-gradient-to-b from-[#121317]/90 via-[#121317]/45 to-transparent transition-opacity duration-300 ${
            atTop ? "opacity-0" : "opacity-100"
          }`}
        />
        <div className="relative max-w-[1400px] mx-auto flex items-center justify-between">
          {/* Left cluster: logo sits directly beside the menu links. */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="hover:opacity-80 transition-opacity flex items-center"
            >
              <Image
                src="/images/brand/logo-vertical.webp"
                alt={t("nav.logoAlt")}
                width={42}
                height={25}
                className="object-contain"
                priority
              />
            </Link>

            {/* Main navigation links - hidden on small, flex on medium and up */}
            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className="rounded-full border border-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/25"
              >
                {t("nav.home")}
              </Link>
              <div
                className="relative"
                onMouseEnter={() => setIsProjectsOpen(true)}
                onMouseLeave={() => setIsProjectsOpen(false)}
                role="none"
              >
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-full border border-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/25"
                  aria-haspopup="true"
                  aria-expanded={isProjectsOpen ? "true" : "false"}
                >
                  {t("nav.projects")}
                  <svg
                    className={`w-4 h-4 transition-transform ${isProjectsOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    role="img"
                    aria-labelledby="projects-dropdown-icon"
                  >
                    <title id="projects-dropdown-icon">
                      {t("nav.projectsDropdown")}
                    </title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {isProjectsOpen && (
                  /* The padding here is the visual gap below the bar; keeping it
                     on the wrapper rather than a margin means the pointer never
                     leaves the hover target while crossing into the panel. */
                  <div
                    className="absolute top-full left-2 z-50 pt-2"
                    role="none"
                  >
                    <div
                      className="w-64 rounded-2xl border border-white/10 bg-[#1c1d23]/95 p-2 shadow-2xl backdrop-blur-md"
                      role="menu"
                    >
                      <Link
                        href="/competitions/indonesian-robot-contest"
                        className="block rounded-xl px-4 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        {t("nav.irc")}
                      </Link>
                      <Link
                        href="/competitions/australian-rover-challenge"
                        className="block rounded-xl px-4 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        {t("nav.arc")}
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/news"
                className="rounded-full border border-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/25"
              >
                {t("nav.news")}
              </Link>
              <Link
                href="/teams"
                className="rounded-full border border-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/25"
              >
                {t("nav.teams")}
              </Link>
              <Link
                href="/achievements"
                className="rounded-full border border-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/25"
              >
                {t("nav.achievements")}
              </Link>
              <Link
                href="/partners"
                className="rounded-full border border-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/25"
              >
                {t("nav.partnership")}
              </Link>
              <Link
                href="/recruitment"
                className="rounded-full border border-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/25"
              >
                {t("nav.recruitment")}
              </Link>
            </div>
          </div>

          {/* Hamburger icon for mobile */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white focus:outline-none"
              aria-label={t("nav.toggleMenu")}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-labelledby="mobile-menu-icon-title"
              >
                <title id="mobile-menu-icon-title">Mobile Menu Icon</title>
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <LanguageSwitcher />
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/25 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/50 hover:bg-white/5"
            >
              {t("nav.contact")}
            </a>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - full screen, black background */}
      {isMobileMenuOpen && !isProjectsSubMenu && (
        <div className="md:hidden fixed inset-0 z-[100] bg-black">
          {/* Logo and close button row, centered, same height as competition submenu */}
          <div className="flex items-center justify-center px-6 pt-6 pb-10 relative">
            {/* Logo center */}
            <div className="flex justify-center">
              <Image
                src="/images/brand/logo-vertical.webp"
                alt={t("nav.logoAlt")}
                width={70}
                height={50}
                className="object-contain"
                priority
              />
            </div>
            {/* Close button - absolute positioned */}
            <button
              type="button"
              className="text-white text-3xl absolute right-6"
              aria-label={t("nav.closeMenu")}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              &times;
            </button>
          </div>
          <div className="flex flex-col items-end p-6 pt-6 space-y-8 h-full overflow-y-auto">
            <div className="flex flex-col items-end space-y-4 w-full">
              <Link
                href="/"
                className="text-white hover:opacity-80 transition-opacity text-2xl font-medium text-right w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav.home")}
              </Link>
              <div className="relative w-full flex flex-col items-end">
                <button
                  type="button"
                  className="text-white hover:opacity-80 transition-opacity text-2xl flex items-center gap-1 font-medium"
                  aria-haspopup="true"
                  aria-expanded={isProjectsOpen ? "true" : "false"}
                  onClick={() => setIsProjectsSubMenu(true)} // OPEN SUBMENU
                >
                  {t("nav.projects")}
                  <svg
                    className="w-6 h-6 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    role="img"
                    aria-labelledby="projects-dropdown-icon-mobile"
                  >
                    <title id="projects-dropdown-icon-mobile">
                      {t("nav.projectsDropdown")}
                    </title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
              <Link
                href="/news"
                className="text-white hover:opacity-80 transition-opacity text-2xl font-medium text-right w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav.news")}
              </Link>
              <Link
                href="/teams"
                className="text-white hover:opacity-80 transition-opacity text-2xl font-medium text-right w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav.teams")}
              </Link>
              <Link
                href="/achievements"
                className="text-white hover:opacity-80 transition-opacity text-2xl font-medium text-right w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav.achievements")}
              </Link>
              <Link
                href="/partners"
                className="text-white hover:opacity-80 transition-opacity text-2xl font-medium text-right w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav.partnership")}
              </Link>
              <Link
                href="/recruitment"
                className="text-white hover:opacity-80 transition-opacity text-2xl font-medium text-right w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav.recruitment")}
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:opacity-80 transition-opacity text-2xl font-medium text-right w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav.contact")}
              </a>
            </div>
            <div className="flex items-center gap-4 mt-auto self-end">
              <LanguageSwitcher size="lg" />
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-white hover:opacity-80"
                >
                  <svg
                    width="30"
                    height="30"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    role="img"
                    aria-labelledby={`${social.label}-navbar-mobile-title`}
                  >
                    <title id={`${social.label}-navbar-mobile-title`}>
                      {social.label}
                    </title>
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Projects Sub-Menu Overlay */}
      {isMobileMenuOpen && isProjectsSubMenu && (
        <div className="md:hidden fixed inset-0 z-[110] bg-black flex flex-col">
          {/* Top bar with logo and close, centered */}
          <div className="flex items-center justify-center w-full pt-6 pb-10 px-6 relative">
            {/* Logo center */}
            <div className="flex justify-center">
              <Image
                src="/images/brand/logo-vertical.webp"
                alt={t("nav.logoAlt")}
                width={70}
                height={50}
                className="object-contain"
                priority
              />
            </div>
            {/* Close button - absolute positioned */}
            <button
              type="button"
              className="text-white text-3xl absolute right-6"
              aria-label={t("nav.closeMenu")}
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsProjectsSubMenu(false);
              }}
            >
              &times;
            </button>
          </div>
          {/* Project links with Back as first item, right-aligned */}
          <div className="flex flex-col items-end px-6 space-y-8 mt-8">
            <button
              type="button"
              className="text-white text-2xl font-medium opacity-50 hover:opacity-80 transition-opacity flex items-center gap-2 justify-end w-full"
              onClick={() => setIsProjectsSubMenu(false)}
            >
              <span className="flex items-center gap-2">
                <svg
                  width="28"
                  height="28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  role="img"
                  aria-labelledby="back-icon-title"
                >
                  <title id="back-icon-title">{t("nav.back")}</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                {t("nav.back")}
              </span>
            </button>
            <Link
              href="/competitions/indonesian-robot-contest"
              className="text-white text-3xl md:text-4xl font-medium hover:opacity-80 transition-opacity text-right w-full"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsProjectsSubMenu(false);
              }}
            >
              {t("nav.irc")}
            </Link>
            <Link
              href="/competitions/australian-rover-challenge"
              className="text-white text-3xl md:text-4xl font-medium hover:opacity-80 transition-opacity text-right w-full"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsProjectsSubMenu(false);
              }}
            >
              {t("nav.arc")}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
