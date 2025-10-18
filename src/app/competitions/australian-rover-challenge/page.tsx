import Image from "next/image";
import CompetitionTasksCarousel from "@/components/CompetitionTasksCarousel";

const australianRoverChallengeTasks = [
  {
    id: 1,
    title: "Autonomous Waste Sorting",
    description:
      "Robot 2 autonomously sorts waste items moving along the vibrating conveyor into five categories — ferro, nonferro, leaf, paper, and plastic. Each correctly sorted item earns 1 point.",
    image: "/images/foreground-kri.jpg",
  },
  {
    id: 2,
    title: "Trash Bin Transfer",
    description:
      "Teams design robots capable of precise object detection, grasping, and manipulation in various environmental conditions.",
    image: "/images/foreground-kri2.JPG",
  },
];

export default function AustralianRoverChallengePage() {
  return (
    <div className="min-h-screen bg-[#1e5f4e]">
      <section className="relative h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <Image
            src="/images/foreground-arc.png"
            alt="Competition background"
            className="w-full h-full object-cover object-center"
            style={{ opacity: 0.5, objectPosition: "center 55%" }}
            fill={true}
          />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-6xl font-bold mb-6">
            Australian Rover Challenge 2026
          </h1>
          <a
            href="https://set.adelaide.edu.au/atcsr/australian-rover-challenge/about-the-competition"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1e5f4e] hover:bg-[#16473a] px-16 py-6 rounded-2xl font-bold text-2xl transition-colors inline-block shadow-lg"
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

      <section className="relative w-full min-h-[300px] flex items-center justify-center py-14 overflow-hidden">
        <div className="absolute inset-0 bg-[#1e5f4e] opacity-70"></div>
        <Image
          src="/images/foreground-kri3.jpg"
          alt="Stats background"
          className="absolute inset-0 mx-auto max-w-7xl w-full h-full object-cover object-center z-0"
          style={{ objectPosition: "center 60%", opacity: 0.3 }}
          fill={true}
        />

        {/* <img
          src="/images/foreground-kri2.JPG"
          alt="Stats background"
          className="absolute inset-0 w-full h-full max-w-8xl object-cover object-center z-0"
          style={{ objectPosition: "center 60%", opacity: 0.3 }}
        /> */}
        <div className="relative z-10 w-full flex justify-center items-center">
          <div
            className="flex flex-row items-end gap-32 mx-auto"
            style={{ justifyContent: "center", width: "fit-content" }}
          >
            <h1 className="text-6xl font-bold mb-6">Our First Year !</h1>
          </div>
        </div>
      </section>

      <div className="bg-[#1e5f4e] px-8 mt-20">{/* spacer */}</div>

      <CompetitionTasksCarousel
        tasks={australianRoverChallengeTasks}
        backgroundImage="/images/ROVER1.png"
      />
    </div>
  );
}
