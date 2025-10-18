import Image from "next/image";
import CompetitionTasksCarousel from "@/components/CompetitionTasksCarousel";

const indonesianRobotContestTasks = [
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

export default function IndonesianRobotContestPage() {
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
          <h1 className="text-6xl font-bold mb-6">Indonesian Robot Contest</h1>
          <a
            href="https://kontesrobotindonesia.id/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1e5f4e] hover:bg-[#16473a] px-16 py-6 rounded-2xl font-bold text-2xl transition-colors inline-block shadow-lg"
          >
            Learn more
          </a>
        </div>
      </section>

      {/* Description Section (separated) */}
      <section className="w-full bg-[#1e5f4e] bg-opacity-70 py-8 flex items-center justify-center">
        <div className="max-w-7xl w-full min-h-[120px] mx-auto">
          <p className="text-lg text-white p-6 text-justify font-bold">
            The Indonesian Robot Contest (KRI) is an annual student competition
            in the field of robot design and engineering, open to all university
            students across the Republic of Indonesia under the Ministry of
            Higher Education, Science, and Technology (Kemdiktisaintek). KRI is
            organized by the Directorate of Learning and Student Affairs,
            Directorate General of Higher Education of Kemdiktisaintek, Republic
            of Indonesia. The first KRI was held in 2003 under the Directorate
            General of Higher Education, Ministry of Education and Culture at
            that time.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative w-full min-h-[300px] flex items-center justify-center py-14 overflow-hidden">
        <div className="absolute inset-0 bg-[#1e5f4e] opacity-70"></div>
        <Image
          src="/images/foreground-kri2.JPG"
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
            {/* 2025 stat */}
            <div className="flex flex-col items-center justify-center">
              <div className="text-9xl font-extrabold mb-2">
                1<sup className="text-4xl">st</sup>
              </div>
              <div className="text-lg opacity-80">OUT OF 36 TEAMS</div>
              <div className="text-5xl font-extrabold mt-2">2024</div>
            </div>
            {/* 2024, 2023, 2022 grouped closer together */}
            <div className="flex flex-row items-end gap-4">
              <div className="flex flex-col items-center justify-end mx-6">
                <div className="text-8xl font-bold mb-2">
                  4<sup className="text-3xl">th</sup>
                </div>
                {/* <div className="text-base opacity-80">NATIONAL RUNNER-UP</div> */}
                <div className="text-3xl font-bold mt-2">2023</div>
              </div>
              <div className="flex flex-col items-center justify-end mx-6">
                <div className="text-8xl font-bold mb-2">
                  1<sup className="text-3xl">st</sup>
                </div>
                {/* <div className="text-base opacity-80">NATIONAL CHAMPION</div> */}
                <div className="text-3xl font-bold mt-2">2022</div>
              </div>
              <div className="flex flex-col items-center justify-end mx-6">
                <div className="text-8xl font-bold mb-2">
                  1<sup className="text-3xl">st</sup>
                </div>
                {/* <div className="text-base opacity-80">NATIONAL CHAMPION</div> */}
                <div className="text-3xl font-bold mt-2">2021</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-[#1e5f4e] px-8 mt-20">{/* spacer */}</div>

      <CompetitionTasksCarousel
        tasks={indonesianRobotContestTasks}
        backgroundImage="/images/foreground-kri3.jpg"
      />
    </div>
  );
}
