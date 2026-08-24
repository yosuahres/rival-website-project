"use client";

import Link from "next/link";
import NextImage from "@/components/NextImage";
import { useTranslation } from "@/i18n";
import { PARENT_ORGANIZATION, SITE_NAME, WHATSAPP_URL } from "@/lib/site";
import { SOCIALS } from "@/lib/socials";

/** Rendered as-is; the year is stamped at build time. */
const YEAR = new Date().getFullYear();

const Footer = () => {
  const { t } = useTranslation();

  const aboutLinks = [
    { label: t("nav.about"), href: "/about" },
    { label: t("nav.teams"), href: "/teams" },
    { label: t("nav.achievements"), href: "/achievements" },
    { label: t("nav.irc"), href: "/competitions/indonesian-robot-contest" },
    { label: t("nav.arc"), href: "/competitions/australian-rover-challenge" },
  ];

  const navLinks = [
    { label: t("nav.news"), href: "/news" },
    { label: t("nav.partnership"), href: "/partners" },
    { label: t("nav.recruitment"), href: "/recruitment" },
  ];

  return (
    <footer className="relative overflow-hidden px-4 py-16 text-white md:px-6 md:py-20">
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-16">
          {/* Identity block, sitting on its own skewed lattice. The pattern is
              tiled SVG rather than an image so it costs nothing to download and
              redraws at any size; the negative inset lets it bleed a little
              past the text it sits behind. */}
          <div className="relative max-w-md">
            <svg
              aria-hidden="true"
              className="-top-10 -left-10 pointer-events-none absolute h-[calc(100%+5rem)] w-[calc(100%+5rem)] text-white/[0.07] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_52%,transparent_92%)] [mask-image:radial-gradient(ellipse_at_center,black_52%,transparent_92%)]"
            >
              <defs>
                <pattern
                  id="footer-lattice"
                  width="110"
                  height="140"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(-24) skewX(-16) translate(-60 0)"
                >
                  <rect
                    width="110"
                    height="140"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#footer-lattice)" />
            </svg>

            <NextImage
              src="/images/brand/logo-its.png"
              alt={t("nav.logoAlt")}
              width={1000}
              height={275}
              className="relative h-auto w-[250px]"
            />
            <p className="relative mt-8 font-bold text-lg leading-snug">
              {SITE_NAME}
              <br />
              {t("footer.building")}
            </p>
            <address className="relative mt-4 space-y-1 text-gray-400 text-sm not-italic">
              <p>{t("footer.address")}</p>
              <p>{t("footer.street")}</p>
            </address>
          </div>

          {/* Link columns, with the social row hanging below them */}
          <div className="flex flex-col gap-12">
            <div className="flex gap-12 sm:gap-20">
              <nav aria-labelledby="footer-about-heading">
                <h2
                  id="footer-about-heading"
                  className="mb-6 font-bold text-base"
                >
                  {t("footer.aboutUs")}
                </h2>
                <ul className="space-y-4 text-gray-300 text-sm">
                  {aboutLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <nav aria-labelledby="footer-nav-heading">
                <h2
                  id="footer-nav-heading"
                  className="mb-6 font-bold text-base"
                >
                  {t("footer.navigations")}
                </h2>
                <ul className="space-y-4 text-gray-300 text-sm">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-white"
                    >
                      {t("nav.contact")}
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="flex items-center justify-between gap-8">
              <h2 className="font-bold text-base">{t("footer.socialMedia")}</h2>
              <div className="flex items-center gap-6">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="text-white transition-colors hover:text-gray-400"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      role="img"
                      aria-labelledby={`${social.label}-footer-title`}
                    >
                      <title id={`${social.label}-footer-title`}>
                        {social.label}
                      </title>
                      <path d={social.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-16 text-gray-500 text-sm lg:text-right">
          {PARENT_ORGANIZATION} © {YEAR} {SITE_NAME}. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
