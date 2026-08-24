"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import HomeHeroCarousel from "@/components/HomeHeroCarousel";

const ACHIEVEMENTS = [
  {
    rank: "1st",
    scope: "in Indonesia",
    detail: "Indonesian Thematic Robot Contest",
    year: "2024",
  },
  {
    rank: "6th",
    scope: "Worldwide",
    detail: "Australian Rover Challenge (ARCh)",
    year: "2026",
  },
  { rank: "1st", scope: "Indonesian rover team", detail: "", year: "2026" },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com/rival_its",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/rival-its",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@rival_its",
    path: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.75 2.9 2.9 0 0 1 2.31-4.64 2.88 2.88 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z",
  },
];

export default function Home() {
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
      <HomeHeroCarousel />

      <section className="px-5 pt-4 pb-14 md:px-2 md:pt-25 md:pb-25">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="mb-5 font-medium text-[1.65rem] text-white leading-tight md:mb-6 md:text-4xl lg:text-5xl">
            Designing, Building, and Competing in Advanced Robotics Systems
          </h2>
          <p className="mx-auto text-base text-white md:text-lg">
            RIVAL ITS is a student robotic team based in Indonesia, dedicated to
            design and build advanced robots for national and international
            competitions. Our mission is to push the boundaries of technology
            and innovation, while fostering a collaborative and inclusive
            environment for students to learn and grow.
          </p>
        </div>
      </section>

      <section className="bg-[#121317] px-5 md:px-6">
        <div
          ref={teamSectionRef}
          className="relative mx-auto h-[320px] w-full max-w-6xl overflow-hidden rounded-2xl shadow-lg md:h-[480px] lg:h-[600px]"
        >
          <Image
            src="/images/home/team-showcase.webp"
            alt="RIVAL ITS Team"
            width={1920}
            height={1080}
            className={`h-full w-full object-cover object-center transition-opacity duration-700 ${teamImageLoaded ? "opacity-100" : "opacity-0"}`}
            priority
          />
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto flex max-w-7xl items-start justify-between gap-4 px-4 sm:gap-8 md:items-center md:gap-0 md:px-0">
          {ACHIEVEMENTS.map((achievement) => (
            <div
              key={`${achievement.rank}-${achievement.scope}`}
              className="flex flex-1 flex-col items-center"
            >
              <span className="font-bold text-4xl text-white leading-none sm:text-5xl md:text-[8vw]">
                {achievement.rank}
              </span>
              <span className="mt-3 mb-3 text-center font-medium text-base text-white sm:mt-6 sm:mb-6 sm:text-xl md:text-3xl">
                {achievement.scope}
              </span>
              <span className="text-center text-gray-300 text-xs sm:text-base md:text-xl">
                {achievement.detail && (
                  <>
                    {achievement.detail}
                    <br />
                  </>
                )}
                ({achievement.year})
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Closing statement: heading across the top, supporting copy bottom
          left, and the team still anchored to the bottom right. */}
      <section className="px-4 pb-24 md:px-6">
        <div className="mx-auto max-w-7xl rounded-3xl bg-[#1c1d23] px-6 py-16 md:px-12 md:py-20">
          <h2 className="font-bold text-2xl text-white md:text-4xl lg:text-5xl">
            Through student leadership and teamwork,
            <br className="hidden md:block" />{" "}
            <span className="text-gray-400">we innovate and excel.</span>
          </h2>

          <div className="mt-16 grid items-end gap-10 md:grid-cols-2 md:gap-12">
            <p className="order-2 max-w-xl font-base text-base text-gray-300 md:order-1 md:text-lg">
              We design, build, and test the next generation of robots right
              here in Indonesia - and inspire future generations to do the same.
            </p>
            <div className="relative order-1 aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-lg md:order-2">
              <Image
                src="/images/recruitment/hero-background.webp"
                alt=""
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 md:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-start gap-x-10 gap-y-6">
          <span className="text-lg text-white md:text-xl">Follow us</span>
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
    </>
  );
}
