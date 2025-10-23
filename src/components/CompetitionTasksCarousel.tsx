"use client";

import Image from "next/image";
import { useState } from "react";

interface Task {
  id: number;
  title: string;
  description: string;
  image: string;
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

        <div className="relative flex flex-col items-center justify-between overflow-hidden min-h-[650px] md:h-[650px] p-4">
          <div
            className={`relative h-[300px] w-full max-w-3xl shadow-xl bg-white rounded-xl mb-8 transition-transform duration-300 ease-in-out md:h-100
            ${
              slideDirection === "right"
                ? "-translate-x-full opacity-0"
                : slideDirection === "left"
                  ? "translate-x-full opacity-0"
                  : "translate-x-0 opacity-100"
            }`}
          >
            <Image
              src={currentTask.image}
              alt={currentTask.title}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
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

          <div className="relative flex justify-between w-full max-w-xs px-4 mt-8 md:absolute md:bottom-auto md:top-1/2 md:left-0 md:transform md:-translate-x-1/2 md:translate-x-0 md:-translate-y-1/2 md:max-w-none md:px-0">
            <button
              type="button"
              onClick={prevTask}
              className="z-10 w-16 h-16 flex items-center justify-center rounded-full bg-[#1e5f4e] hover:bg-white text-white focus:outline-none text-4xl"
              style={{ paddingBottom: "2px" }}
              disabled={isAnimating}
            >
              &larr;
            </button>

            <button
              type="button"
              onClick={nextTask}
              className="z-10 w-16 h-16 flex items-center justify-center rounded-full bg-[#1e5f4e] hover:bg-white text-white focus:outline-none text-4xl"
              style={{ paddingBottom: "2px" }}
              disabled={isAnimating}
            >
              &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
