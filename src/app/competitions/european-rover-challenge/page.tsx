import Image from "next/image";
import CompetitionTasksCarousel from "@/components/CompetitionTasksCarousel";

const europeanRoverChallengeTasks = [
  {
    id: 1,
    title: "Autonomous Waste Sorting",
    description:
      "Robot 2 autonomously sorts waste items moving along the vibrating conveyor into five categories — ferro, nonferro, leaf, paper, and plastic. Each correctly sorted item earns 1 point.",
    image: "/images/task-kri1.jpg",
  },
  {
    id: 2,
    title: "Trash Bin Transfer",
    description:
      "Teams design robots capable of precise object detection, grasping, and manipulation in various environmental conditions.",
    image: "/images/task-kri2.jpg",
  },
];

export default function EuropeanRoverChallengePage() {
  return (
    <div className="min-h-screen bg-[#1e5f4e]">
      <section className="relative h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <Image
            src="/images/foreground-kri.jpg"
            alt="Competition background"
            className="w-full h-full object-cover object-center"
            style={{ opacity: 0.5, objectPosition: "center 55%" }}
            fill={true}
          />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-bold mb-6 mt-15">
            European Rover Challenge (Remote)
          </h1>
          <a
            href="https://kontesrobotindonesia.id/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1e5f4e] hover:bg-[#16473a] px-6 py-4 rounded-2xl font-bold text-xl transition-colors inline-block shadow-lg"
          >
            Learn more
          </a>
        </div>
      </section>

      <section className="w-full bg-[#1e5f4e] bg-opacity-70 py-8 flex items-center justify-center">
        <div className="max-w-7xl w-full min-h-[120px] mx-auto">
          <p className="text-lg text-white p-6 text-justify font-bold">XX</p>
        </div>
      </section>

      <section className="relative w-full min-h-[180px] sm:min-h-[300px] flex items-center justify-center py-8 sm:py-14 overflow-hidden">
        <div className="absolute inset-0 bg-[#1e5f4e] opacity-70"></div>
        <Image
          src="/images/foreground-kri2.JPG"
          alt="Stats background"
          className="absolute inset-0 mx-auto max-w-2xl sm:max-w-7xl w-full h-full object-cover object-center z-0"
          style={{ objectPosition: "center 60%", opacity: 0.3 }}
          fill={true}
        />

        <div className="relative z-10 w-full flex justify-center items-center">
          <div
            className="flex flex-row items-end gap-8 sm:gap-16 md:gap-32 mx-auto max-w-xs sm:max-w-none"
            style={{ justifyContent: "center", width: "fit-content" }}
          >
            {/* 2025 stat */}
            <div className="flex flex-col items-center justify-center">
              <div className="text-5xl sm:text-7xl md:text-9xl font-extrabold mb-2">
                11<sup className="text-xl sm:text-2xl md:text-4xl">th</sup>
              </div>
              <div
                className="text-sm sm:text-sm
               opacity-80"
              >
                OUT OF 30 COUNTRY WORLDWIDE
              </div>
              <div className="text-2xl sm:text-4xl md:text-5xl font-extrabold mt-2">
                2025
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-[#1e5f4e] px-8 mt-20">{/* spacer */}</div>

      <CompetitionTasksCarousel
        tasks={europeanRoverChallengeTasks}
        backgroundImage="/images/foreground-kri3.jpg"
      />
    </div>
  );
}
