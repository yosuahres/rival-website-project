import type { Metadata } from "next";
import Image from "next/image";
import CompetitionTasksCarousel from "@/components/CompetitionTasksCarousel";

export const metadata: Metadata = {
  title: "KRI",
  description:
    "Indonesian Robot Contest 2026 Competition - RIVAL ITS participation details and tasks.",
};

const indonesianRobotContestTasks = [
  {
    id: 1,
    title: "Post Landing Tasks",
    description:
      "The rover must perform a series of activities immediately after landing to establish an operational In-Situ Resource Utilisation (ISRU) outpost, including conducting system checks, evaluating supply caches, performing maintenance, and connecting propellant hoses.",
    image: "/images/arm1.webp",
  },
  {
    id: 2,
    title: "Space Resources Task",
    description:
      "The rover must evaluate, collect, and extract critical lunar resources—specifically prospecting for ilmenite and icy regolith, and processing the icy regolith to extract the highest possible amount of liquid water.",
    image: "/images/assemblykosong.webp",
  },
  {
    id: 3,
    title: "Excavation and Construction Task",
    description:
      "The rover must prepare a landing site by clearing hazardous rocks, excavating regolith to construct a protective berm, and deploying dust-mitigating pavers.",
    image: "/images/ROVER4.webp",
  },
  {
    id: 4,
    title: "Mapping and Autonomous Task",
    description:
      "The rover is required to autonomously navigate to predefined landmarks and subsequently explore the area to construct a comprehensive map, reporting the coordinates of previously unknown landmarks",
    image: "/images/foreground-arc.webp",
  },
];

export default function IndonesianRobotContestPage() {
  return (
    <div className="min-h-screen bg-[#1e5f4e]">
      <section className="relative h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <Image
            src="/images/ROVER4.webp"
            alt="Competition background"
            className="w-full h-full object-cover object-center"
            style={{ opacity: 0.5, objectPosition: "center 55%" }}
            fill={true}
          />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-bold mb-6 mt-15">
            Australian Rover Challenge 2026
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
          <p className="text-lg text-white p-6 text-justify font-bold">
            The Australian Rover Challenge (ARCh) is an annual robotics
            competition held by the University of Adelaide, where university
            students from across Australia and around the globe, battle it out
            in a full-scale Lunar mission, using semi-autonomous rovers that
            they have designed and built themselves. Competitors showcase their
            skills in a custom built simulated lunar environment, and complete a
            range of tasks including navigation, resource, and construction.
            Unlike many other rover competitions across the world which focus on
            Martian exploration, the ARCh is focused specifically on completing
            tasks on a simulated Lunar surface.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative w-full min-h-[180px] sm:min-h-[300px] flex items-center justify-center py-8 sm:py-14 overflow-hidden">
        <div className="absolute inset-0 bg-[#1e5f4e] opacity-70"></div>
        <Image
          src="/images/fototeam1.webp"
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
            <div className="flex flex-col items-center justify-center">
              <div className="text-2xl sm:text-4xl md:text-5xl font-extrabold mt-2">
                OUR FIRST YEAR!
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-[#1e5f4e] px-8 mt-20">{/* spacer */}</div>

      <CompetitionTasksCarousel
        tasks={indonesianRobotContestTasks}
        backgroundImage="/images/fototeam2.webp"
      />
    </div>
  );
}
