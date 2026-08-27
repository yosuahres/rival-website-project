"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import HomeHeroCarousel from "@/components/HomeHeroCarousel";
import { type TranslationKey, useTranslation } from "@/i18n";
import { BUTTON_LIGHT } from "@/lib/button";
import {
  PARTNERS_FEATURE,
  PARTNERS_LEAD,
  PARTNERS_SUPPORTING,
  type Partner,
} from "@/lib/partners";
import { SOCIALS } from "@/lib/socials";

/**
 * Photograph filling the tile on the closing card — the rover on the ARCh
 * field, cropped square and sized for the tile so next/image doesn't have to
 * decode the 6000x4000 original behind it.
 */
const CLOSING_PHOTO = "/images/home/closing-rover.webp";

/**
 * The three-column results strip. The placing, its suffix and the year read
 * the same in every language and stay in English; the scope line and the
 * contest under it come from the dictionary.
 */
const ACHIEVEMENTS = [
  {
    digit: "1",
    ordinal: "st",
    scope: "home.stats.s1.scope",
    detail: "home.stats.s1.detail",
    year: "2024",
  },
  {
    digit: "6",
    ordinal: "th",
    scope: "home.stats.s2.scope",
    detail: "home.stats.s2.detail",
    year: "2026",
  },
  {
    digit: "1",
    ordinal: "st",
    scope: "home.stats.s3.scope",
    detail: "home.stats.s3.detail",
    year: "2026",
  },
] as const satisfies readonly {
  digit: string;
  ordinal: string;
  scope: TranslationKey;
  detail: TranslationKey;
  year: string;
}[];

/**
 * Logo heights, by tier. Top-tier sponsors render larger; within a tier a wide
 * wordmark is a step shorter than a square mark, since at equal height it runs
 * several times wider and reads as oversized.
 */
const LOGO_HEIGHTS = {
  lead: { normal: "h-40 md:h-60", wide: "h-24 md:h-36" },
  base: { normal: "h-24 md:h-36", wide: "h-14 md:h-20" },
} as const;

const logoClass = (
  partner: Partner,
  tier: keyof typeof LOGO_HEIGHTS = "base",
) =>
  `w-auto max-w-full object-contain ${LOGO_HEIGHTS[tier][partner.wide ? "wide" : "normal"]}`;

export default function Home() {
  const { t } = useTranslation();
  const teamSectionRef = useRef<HTMLDivElement>(null);
  const [teamImageLoaded, setTeamImageLoaded] = useState(false);

  useEffect(() => {
    // Reveal the section's heavy asset once it approaches the viewport, so it
    // doesn't compete with above-the-fold content on first paint. The observer
    // fires once and then stops watching.
    const target = teamSectionRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setTeamImageLoaded(true);
        observer.disconnect();
      },
      { threshold: 0.2 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* The visible hero is a rotating reel whose largest word is just the
          wordmark, so the document's one real heading is carried here: it
          states what the site is for a crawler and a screen reader without
          competing with the reel's typography. */}
      <h1 className="sr-only">{t("home.srTitle")}</h1>

      <HomeHeroCarousel />

      {/* The backdrop piece beside this one reads better facing the other way:
          the rover then leans into the heading rather than away from it. */}
      <section
        data-backdrop-flip
        className="px-5 pt-4 pb-14 md:px-2 md:pt-25 md:pb-25"
      >
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="mb-5 font-medium text-[1.65rem] text-white leading-tight md:mb-6 md:text-4xl lg:text-5xl">
            {t("home.introTitle")}
          </h2>
          <p className="mx-auto max-w-[60rem] text-base text-white md:text-lg">
            {t("home.introBody")}
          </p>
        </div>
      </section>

      <section className="bg-[#121317] px-4 md:px-6">
        <div
          ref={teamSectionRef}
          className="relative mx-auto h-[320px] w-full max-w-7xl overflow-hidden rounded-2xl shadow-lg md:h-[480px] lg:h-[600px]"
        >
          <Image
            src="/images/home/team-showcase.webp"
            alt={t("home.teamPhotoAlt")}
            width={1920}
            height={1080}
            className={`h-full w-full object-cover object-center transition-opacity duration-700 ${teamImageLoaded ? "opacity-100" : "opacity-0"}`}
            priority
          />
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto flex max-w-7xl items-start justify-between gap-4 px-4 sm:gap-8 md:items-center md:gap-0 md:px-0">
          {ACHIEVEMENTS.map((achievement) => {
            const detail = t(achievement.detail);
            return (
              <div
                key={achievement.scope}
                className="flex flex-1 flex-col items-center"
              >
                <span className="font-bold text-3xl text-white leading-none sm:text-4xl md:text-[5.5vw]">
                  {achievement.digit}
                  {achievement.ordinal}
                </span>
                <span className="mt-3 mb-3 text-center font-medium text-sm text-white sm:mt-5 sm:mb-5 sm:text-lg md:text-2xl">
                  {t(achievement.scope)}
                </span>
                <span className="text-center text-gray-300 text-xs sm:text-sm md:text-base">
                  {detail && (
                    <>
                      {detail}
                      <br />
                    </>
                  )}
                  ({achievement.year})
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Closing statement: heading across the top with the supporting copy
          directly beneath it, and the team anchored to the bottom right. */}
      <section className="px-4 pb-24 md:px-6">
        {/* The whole card is the link to the team page, so the "Learn more"
            pill is a span — an <a> inside an <a> is invalid. */}
        <Link
          href="/teams"
          className="group relative mx-auto block max-w-7xl cursor-pointer overflow-hidden rounded-3xl bg-[#16171b] px-6 py-10 md:px-12 md:py-12"
        >
          <h2 className="max-w-lg font-bold text-base text-white leading-tight md:text-xl lg:text-2xl">
            {t("home.cta.titleLine1")}
            <br /> {t("home.cta.titleLine2")}
          </h2>

          <p className="max-w-lg font-bold text-base text-gray-500 leading-tight md:text-xl lg:text-2xl">
            {t("home.cta.body")}
          </p>

          <div className="mt-6 grid items-end gap-8 md:grid-cols-2 md:gap-12">
            <div className="order-2 md:order-1">
              <span className={`${BUTTON_LIGHT} group-hover:bg-gray-200`}>
                {t("common.learnMore")}
              </span>
            </div>
            {/* The tile is a plain photograph; hovering the card eases it
                in a touch so it reads as part of the same link. */}
            <div className="relative order-1 aspect-square w-full overflow-hidden rounded-2xl border border-white/15 bg-[#0d3b28] shadow-lg md:order-2">
              <Image
                src={CLOSING_PHOTO}
                alt=""
                fill
                sizes="(min-width: 768px) 40vw, 90vw"
                className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 motion-reduce:transition-none"
              />
            </div>
          </div>

          {/* White wash on hover, over the card and the photo alike. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-white/0 transition-colors duration-300 group-hover:bg-white/[0.06]"
          />
        </Link>
      </section>

      <section className="px-4 pb-24 md:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-start gap-x-10 gap-y-6">
          <span className="text-lg text-white md:text-xl">
            {t("common.followUs")}
          </span>
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
                className="h-7 w-7"
                fill="currentColor"
                viewBox="0 0 24 24"
                role="img"
                aria-labelledby={`${social.label}-home-title`}
              >
                <title id={`${social.label}-home-title`}>{social.label}</title>
                <path d={social.path} />
              </svg>
            </a>
          ))}
        </div>
      </section>

      {/* Sponsor wall. Rows mirror the footer's grouping — two lead, one
          feature, then three across. The backdrop is kept out of it: the wall
          is mostly air, so a stipple beside it has room to sit but reads as
          clutter against the logos. */}
      <section data-no-backdrop className="px-4 pb-24 md:px-6">
        <div className="mx-auto max-w-7xl px-2 py-8 md:px-6 md:py-12">
          <p className="text-center font-semibold text-gray-400 text-xs uppercase tracking-[0.2em]">
            {t("home.sponsorsEyebrow")}
          </p>
          <h2 className="mt-4 text-center font-bold text-3xl text-white md:text-5xl">
            {t("home.sponsorsTitle")}
          </h2>

          {/* Rows mirror the footer's old grouping — two lead, one feature,
              then three across. Every logo is sized by a shared HEIGHT rather
              than a shared box: the files range from square marks to wide
              wordmarks, so matching boxes would render the wordmarks tiny. */}
          <div className="mt-20 flex flex-col items-center">
            <div className="flex w-full flex-wrap items-center justify-center gap-x-16">
              {PARTNERS_LEAD.map((partner) => (
                <Image
                  key={partner.src}
                  src={partner.src}
                  alt={partner.alt}
                  width={partner.width}
                  height={partner.height}
                  className={logoClass(partner, "lead")}
                />
              ))}
            </div>

            <div className="flex w-full flex-wrap items-center justify-center gap-x-16">
              {PARTNERS_FEATURE.map((partner) => (
                <Image
                  key={partner.src}
                  src={partner.src}
                  alt={partner.alt}
                  width={partner.width}
                  height={partner.height}
                  className={logoClass(partner, "lead")}
                />
              ))}
            </div>

            <div className="mx-auto grid w-fit max-w-full grid-cols-3 items-center justify-items-center gap-x-14 gap-y-8 md:gap-x-24 md:gap-y-12">
              {PARTNERS_SUPPORTING.map((partner) => (
                <Image
                  key={partner.src}
                  src={partner.src}
                  alt={partner.alt}
                  width={partner.width}
                  height={partner.height}
                  className={logoClass(partner)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
