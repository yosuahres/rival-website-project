"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "@/i18n";

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
          <Link
            href="/"
            className="hover:opacity-80 transition-opacity flex items-center"
          >
            <Image
              src="/images/brand/logo-vertical.webp"
              alt={t("nav.logoAlt")}
              width={50}
              height={30}
              className="object-contain"
              priority
            />
          </Link>

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

          {/* Main navigation links - hidden on small, flex on medium and up */}
          <div className="hidden md:flex items-center gap-8">
            <div
              className="relative"
              onMouseEnter={() => setIsProjectsOpen(true)}
              onMouseLeave={() => setIsProjectsOpen(false)}
              role="none"
            >
              <button
                type="button"
                className="text-white hover:opacity-80 transition-opacity text-lg flex items-center gap-1 font-medium"
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
                <div
                  className="absolute top-full left-0 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 mt-0"
                  role="menu"
                >
                  <Link
                    href="/competitions/indonesian-robot-contest"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                  >
                    {t("nav.irc")}
                  </Link>
                  <Link
                    href="/competitions/australian-rover-challenge"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                  >
                    {t("nav.arc")}
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/news"
              className="text-white hover:opacity-80 transition-opacity text-lg font-medium"
            >
              {t("nav.news")}
            </Link>
            <Link
              href="/teams"
              className="text-white hover:opacity-80 transition-opacity text-lg font-medium"
            >
              {t("nav.teams")}
            </Link>
            <Link
              href="/partners"
              className="text-white hover:opacity-80 transition-opacity text-lg font-medium"
            >
              {t("nav.partnership")}
            </Link>
            <Link
              href="/recruitment"
              className="text-white hover:opacity-80 transition-opacity text-lg font-medium"
            >
              {t("nav.recruitment")}
            </Link>
            <Link
              href="/contact"
              className="text-white hover:opacity-80 transition-opacity text-lg font-medium"
            >
              {t("nav.contact")}
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <a
              href="https://instagram.com/rival_its"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:opacity-80"
            >
              <svg
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
                role="img"
                aria-labelledby="instagram-navbar-title"
              >
                <title id="instagram-navbar-title">Instagram</title>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/company/rival-its"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:opacity-80"
            >
              <svg
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
                role="img"
                aria-labelledby="linkedin-navbar-title"
              >
                <title id="linkedin-navbar-title">LinkedIn</title>
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.843-1.563 3.041 0 3.602 2.003 3.602 4.605v5.591z" />
              </svg>
            </a>
            <a
              href="https://tiktok.com/@rival_its"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:opacity-80"
            >
              <svg
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
                role="img"
                aria-labelledby="tiktok-navbar-title"
              >
                <title id="tiktok-navbar-title">TikTok</title>
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.75 2.9 2.9 0 0 1 2.31-4.64 2.88 2.88 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
              </svg>
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
              <Link
                href="/contact"
                className="text-white hover:opacity-80 transition-opacity text-2xl font-medium text-right w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav.contact")}
              </Link>
            </div>
            <div className="flex items-center gap-4 mt-auto self-end">
              <LanguageSwitcher size="lg" />
              <a
                href="https://instagram.com/rival_its"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:opacity-80"
              >
                <svg
                  width="30"
                  height="30"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-labelledby="instagram-navbar-title-mobile"
                >
                  <title id="instagram-navbar-title-mobile">Instagram</title>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/rival-its"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:opacity-80"
              >
                <svg
                  width="30"
                  height="30"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-labelledby="linkedin-navbar-title-mobile"
                >
                  <title id="linkedin-navbar-title-mobile">LinkedIn</title>
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.843-1.563 3.041 0 3.602 2.003 3.602 4.605v5.591z" />
                </svg>
              </a>
              <a
                href="https://tiktok.com/@rival_its"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:opacity-80"
              >
                <svg
                  width="30"
                  height="30"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-labelledby="tiktok-navbar-title-mobile"
                >
                  <title id="tiktok-navbar-title-mobile">TikTok</title>
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.75 2.9 2.9 0 0 1 2.31-4.64 2.88 2.88 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
                </svg>
              </a>
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
