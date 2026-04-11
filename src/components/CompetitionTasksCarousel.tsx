"use client";

import Image from "next/image";
import { useState } from "react";

interface Task {
  id: number;
  title: string;
  description: string;
  image: string;
  videoLink?: string;
}

interface CompetitionTasksCarouselProps {
  tasks: Task[];
  backgroundImage?: string;
}

export default function CompetitionTasksCarousel({
  tasks,
  backgroundImage,
}: CompetitionTasksCarouselProps) {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(
    null,
  );
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTaskChange = (newIndex: number, direction: "left" | "right") => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSlideDirection(direction);

    setTimeout(() => {
      setCurrentTaskIndex(newIndex);
      setSlideDirection(null);
      setIsAnimating(false);
    }, 150);
  };

  const nextTask = () => {
    const newIndex = (currentTaskIndex + 1) % tasks.length;
    handleTaskChange(newIndex, "right");
  };

  const prevTask = () => {
    const newIndex = (currentTaskIndex - 1 + tasks.length) % tasks.length;
    handleTaskChange(newIndex, "left");
  };

  const currentTask = tasks[currentTaskIndex];

  return (
    <section
      className="py-20 px-8 bg-gray-900 relative overflow-hidden"
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {}
      }
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-gray-900 opacity-70"></div>
      )}
      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-5xl font-bold text-white text-center mb-8">
          COMPETITION TASKS
        </h2>

        <div className="relative flex flex-col items-center justify-center overflow-hidden min-h-[650px] md:h-[650px] p-4 gap-8">
          <div className="relative flex items-center justify-center gap-4 md:gap-8 w-full">
            <button
              type="button"
              onClick={prevTask}
              className="z-10 hidden md:flex w-16 h-16 items-center justify-center rounded-full bg-[#398561] hover:bg-white hover:text-[#398561] text-white focus:outline-none text-4xl leading-none flex-shrink-0 transition-all"
              style={{ lineHeight: "1" }}
              disabled={isAnimating}
            >
              &larr;
            </button>

            <div
              className={`relative h-[300px] w-full max-w-3xl shadow-xl bg-white rounded-xl transition-transform duration-300 ease-in-out md:h-100
              ${
                slideDirection === "right"
                  ? "-translate-x-full opacity-0"
                  : slideDirection === "left"
                    ? "translate-x-full opacity-0"
                    : "translate-x-0 opacity-100"
              }`}
            >
              {currentTask.videoLink ? (
                <a
                  href={currentTask.videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full rounded-lg cursor-pointer group relative"
                >
                  <Image
                    src={currentTask.image}
                    alt={currentTask.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg group-hover:brightness-75 transition-all duration-200"
                  />
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg group-hover:bg-black group-hover:bg-opacity-40 transition-all duration-200">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-200 shadow-lg">
                      <svg className="w-10 h-10 text-[#398561] ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <polygon points="5 3 19 12 5 21"></polygon>
                      </svg>
                    </div>
                  </div>
                </a>
              ) : (
                <Image
                  src={currentTask.image}
                  alt={currentTask.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              )}

              <button
                type="button"
                onClick={prevTask}
                className="z-10 md:hidden absolute left-2 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-[#398561] hover:bg-white hover:text-[#398561] text-white focus:outline-none text-3xl leading-none transition-all"
                style={{ lineHeight: "1" }}
                disabled={isAnimating}
              >
                &larr;
              </button>

              <button
                type="button"
                onClick={nextTask}
                className="z-10 md:hidden absolute right-2 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-[#398561] hover:bg-white hover:text-[#398561] text-white focus:outline-none text-3xl leading-none transition-all"
                style={{ lineHeight: "1" }}
                disabled={isAnimating}
              >
                &rarr;
              </button>
            </div>

            <button
              type="button"
              onClick={nextTask}
              className="z-10 hidden md:flex w-16 h-16 items-center justify-center rounded-full bg-[#398561] hover:bg-white hover:text-[#398561] text-white focus:outline-none text-4xl leading-none flex-shrink-0 transition-all"
              style={{ lineHeight: "1" }}
              disabled={isAnimating}
            >
              &rarr;
            </button>
          </div>

          <div
            className={`relative text-center max-w-5xl px-4 transition-transform duration-300 ease-in-out
            ${
              slideDirection === "right"
                ? "-translate-x-full opacity-0"
                : slideDirection === "left"
                  ? "translate-x-full opacity-0"
                  : "translate-x-0 opacity-100"
            }`}
          >
            <h3 className="text-4xl font-bold text-white mb-4">
              {currentTask.title}
            </h3>
            <p className="text-gray-300 text-lg mt-4">
              {currentTask.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
