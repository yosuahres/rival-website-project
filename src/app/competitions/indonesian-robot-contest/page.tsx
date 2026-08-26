"use client";

import Image from "next/image";
import CompetitionTasksCarousel from "@/components/CompetitionTasksCarousel";
import { useTranslation } from "@/i18n";
import { BUTTON_PRIMARY } from "@/lib/button";

const INDONESIAN_ROBOT_CONTEST_TASKS = [
  {
    id: 1,
    title: "competitions.irc.task1.title",
    description: "competitions.irc.task1.description",
    image:
      "/images/competitions/indonesian-robot-contest/task-1-autonomous-waste-sorting.webp",
    videoLink: "https://www.youtube.com/live/jGzVkDfhV1g",
  },
  {
    id: 2,
    title: "competitions.irc.task2.title",
    description: "competitions.irc.task2.description",
    image:
      "/images/competitions/indonesian-robot-contest/task-2-trash-bin-transfer.webp",
    videoLink: "https://www.youtube.com/live/9n7s8l3Xo2g",
  },
] as const;

export default function IndonesianRobotContestPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <section className="relative mx-3 md:mx-4 aspect-[6/7] md:aspect-auto md:h-[60vh] flex items-center justify-center overflow-hidden rounded-4xl">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <Image
            src="/images/competitions/indonesian-robot-contest/hero-background.webp"
            alt={t("competitions.heroAlt")}
            quality={50}
            priority
            sizes="100vw"
            className="w-full h-full object-cover object-center grayscale"
            style={{ objectPosition: "center 55%" }}
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
            {t("competitions.irc.title")}
          </h1>
          <a
            href="https://kontesrobotindonesia.id/index.html"
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
            {t("competitions.irc.intro")}
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative w-full min-h-[180px] sm:min-h-[300px] flex items-center justify-center py-8 sm:py-14 overflow-hidden">
        <Image
          src="/images/competitions/indonesian-robot-contest/stats-background.webp"
          alt={t("competitions.statsAlt")}
          quality={50}
          sizes="(max-width: 640px) 100vw, 1280px"
          className="absolute inset-0 mx-auto max-w-2xl sm:max-w-7xl w-full h-full object-cover object-center z-0"
          style={{ objectPosition: "center 60%", opacity: 0.3 }}
          fill={true}
        />

        <div className="relative z-10 w-full flex justify-center items-center">
          <div
            className="flex flex-row items-end gap-8 sm:gap-16 md:gap-32 mx-auto max-w-xs sm:max-w-none"
            style={{ justifyContent: "center", width: "fit-content" }}
          >
            <div className="flex flex-col items-center justify-center">
              <div className="text-5xl sm:text-7xl md:text-9xl font-extrabold mb-2">
                1<sup className="text-xl sm:text-2xl md:text-4xl">st</sup>
              </div>
              <div
                className="text-sm sm:text-sm
               opacity-80"
              >
                {t("competitions.irc.outOf")}
              </div>
              <div className="text-2xl sm:text-4xl md:text-5xl font-extrabold mt-2">
                2024
              </div>
            </div>

            <div className="flex flex-row items-end gap-2 sm:gap-4">
              <div className="flex flex-col items-center justify-end mx-2 sm:mx-6">
                <div className="text-4xl sm:text-6xl md:text-8xl font-bold mb-2">
                  4<sup className="text-lg sm:text-xl md:text-3xl">th</sup>
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold mt-2">
                  2023
                </div>
              </div>
              <div className="flex flex-col items-center justify-end mx-2 sm:mx-6">
                <div className="text-4xl sm:text-6xl md:text-8xl font-bold mb-2">
                  1<sup className="text-lg sm:text-xl md:text-3xl">st</sup>
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold mt-2">
                  2022
                </div>
              </div>
              <div className="flex flex-col items-center justify-end mx-2 sm:mx-6">
                <div className="text-4xl sm:text-6xl md:text-8xl font-bold mb-2">
                  1<sup className="text-lg sm:text-xl md:text-3xl">st</sup>
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold mt-2">
                  2021
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="px-8 mt-20">{/* spacer */}</div>

      <CompetitionTasksCarousel
        tasks={INDONESIAN_ROBOT_CONTEST_TASKS}
        backgroundImage="/images/competitions/indonesian-robot-contest/tasks-background.webp"
      />
    </div>
  );
}
