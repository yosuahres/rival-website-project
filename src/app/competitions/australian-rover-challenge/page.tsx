"use client";

import Image from "next/image";
import CompetitionTasksCarousel from "@/components/CompetitionTasksCarousel";
import { useTranslation } from "@/i18n";
import { BUTTON_PRIMARY } from "@/lib/button";

const AUSTRALIAN_ROVER_CHALLENGE_TASKS = [
  {
    id: 1,
    title: "competitions.arc.task1.title",
    description: "competitions.arc.task1.description",
    image:
      "/images/competitions/australian-rover-challenge/task-1-post-landing.webp",
    videoLink: "https://www.youtube.com/live/OL-GZQfJ3AQ?si=ddnjgknbIWuNDhUe",
  },
  {
    id: 2,
    title: "competitions.arc.task2.title",
    description: "competitions.arc.task2.description",
    image:
      "/images/competitions/australian-rover-challenge/task-2-space-resources.webp",
    videoLink: "https://www.youtube.com/live/Oe0o9es1_Q8?si=QY5_XCorFn6xtLQK",
  },
  {
    id: 3,
    title: "competitions.arc.task3.title",
    description: "competitions.arc.task3.description",
    image:
      "/images/competitions/australian-rover-challenge/task-3-excavation-and-construction.webp",
    videoLink: "https://www.youtube.com/live/MWcUxFiwad8?si=2w9qcM4wgIs_YjDI",
  },
  {
    id: 4,
    title: "competitions.arc.task4.title",
    description: "competitions.arc.task4.description",
    image:
      "/images/competitions/australian-rover-challenge/task-4-mapping-and-autonomous.webp",
    videoLink: "https://www.youtube.com/live/HbswUp7gHko?si=MMiIoeLgElbGIzMU",
  },
] as const;

export default function AustralianRoverChallengePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <section className="relative mx-3 md:mx-4 aspect-[6/7] md:aspect-auto md:h-[60vh] flex items-center justify-center overflow-hidden rounded-4xl">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <Image
            src="/images/competitions/australian-rover-challenge/hero-background.webp"
            alt={t("competitions.heroAlt")}
            quality={50}
            priority
            sizes="100vw"
            className="w-full h-full object-cover object-center grayscale"
            style={{ objectPosition: "center 20%" }}
            fill={true}
          />
          {/* Keeps the title legible over the brightest part of the photo and
              blends the frame's bottom edge into the black section beneath it. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70"
          />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-2xl md:text-5xl font-bold mb-6">
            {t("competitions.arc.title")}
          </h1>
          <a
            href="https://adelaide.edu.au/about/events/2026/australian-rover-challenge/"
            target="_blank"
            rel="noopener noreferrer"
            className={BUTTON_PRIMARY}
          >
            {t("common.learnMore")}
          </a>
        </div>
      </section>

      <section className="w-full py-8 flex items-center justify-center">
        <div className="max-w-7xl w-full min-h-[120px] mx-auto">
          <p className="text-lg text-white p-6 text-justify">
            {t("competitions.arc.intro")}
          </p>
        </div>
      </section>

      <section className="relative w-full min-h-[180px] sm:min-h-[300px] flex items-center justify-center py-8 sm:py-14 overflow-hidden">
        <Image
          src="/images/competitions/australian-rover-challenge/stats-background.webp"
          alt={t("competitions.statsAlt")}
          quality={50}
          sizes="(max-width: 640px) 100vw, 1280px"
          className="absolute inset-0 mx-auto max-w-2xl sm:max-w-7xl w-full h-full object-cover object-center z-0"
          style={{ objectPosition: "center 30%", opacity: 0.3 }}
          fill={true}
        />

        <div className="relative z-10 w-full flex justify-center items-center">
          <div
            className="flex flex-row items-end gap-8 sm:gap-16 md:gap-32 mx-auto max-w-xs sm:max-w-none"
            style={{ justifyContent: "center", width: "fit-content" }}
          >
            <div className="flex flex-col items-center justify-center">
              <div className="text-4xl sm:text-6xl md:text-8xl font-bold mb-2">
                6
                <sup className="text-lg sm:text-xl md:text-3xl">
                  {t("common.ordinal.th")}
                </sup>
              </div>
              <div className="text-2xl sm:text-4xl md:text-5xl font-extrabold mt-2">
                2026
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-[#398561] px-8 mt-20">{/* spacer */}</div>

      <CompetitionTasksCarousel
        tasks={AUSTRALIAN_ROVER_CHALLENGE_TASKS}
        backgroundImage="/images/competitions/australian-rover-challenge/tasks-background.webp"
      />
    </div>
  );
}
