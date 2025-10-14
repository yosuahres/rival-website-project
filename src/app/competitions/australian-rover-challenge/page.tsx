import Image from 'next/image';
import CompetitionTasksCarousel from '@/components/CompetitionTasksCarousel';

const australianRoverChallengeTasks = [
  {
    id: 1,
    title: 'Autonomous Navigation',
    description: 'Robots must navigate through a complex obstacle course autonomously, demonstrating advanced pathfinding and sensor integration capabilities.',
    image: '/images/foreground-kri.jpg', 
  },
  {
    id: 2,
    title: 'Object Manipulation',
    description: 'Teams design robots capable of precise object detection, grasping, and manipulation in various environmental conditions.',
    image: '/images/foreground-kri2.JPG', 
  },
  {
    id: 3,
    title: 'Team Collaboration',
    description: 'Multiple robots work together to solve complex tasks, requiring advanced communication and coordination protocols.',
    image: '/images/foreground-kri.jpg', 
  },
];

export default function AustralianRoverChallengePage() {
  return (
    <div className="min-h-screen bg-[#1e5f4e]">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center">
        {/* Background image with reduced opacity */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img 
            src="/images/foreground-arc.jpeg" 
            alt="Competition background"
            className="w-full h-full object-cover object-center" 
            style={{ opacity: 0.5, objectPosition: 'center 55%' }}
          />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-6xl font-bold mb-6">Australian Rover Challenge</h1>
          <a
            href="https://set.adelaide.edu.au/atcsr/australian-rover-challenge/"
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
          The Indonesian Robot Contest (KRI) is an annual student competition in the field of robot design and engineering, 
          open to all university students across the Republic of Indonesia under the Ministry of Higher Education, Science, 
          and Technology (Kemdiktisaintek). KRI is organized by the Directorate of Learning and Student Affairs, Directorate General 
          of Higher Education of Kemdiktisaintek, Republic of Indonesia. The first KRI was held in 2003 under the Directorate General of Higher Education, 
          Ministry of Education and Culture at that time.
          </p>
        </div>
      </section>

      {/* Stats Section */}
  <section className="relative w-full min-h-[300px] flex items-center justify-center py-14 overflow-hidden">
        {/* Background image and overlay */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/images/ROVER5.png"
            alt="Stats background"
            className="w-full h-full object-cover object-center"
            style={{ objectPosition: 'center 60%', opacity: 0.3, height: '300px' }}
          />
        </div>
        <div className="relative z-10 w-full flex justify-center items-center">
          <div className="flex flex-row items-end gap-32 mx-auto" style={{ justifyContent: 'center', width: 'fit-content' }}>
            {/* as this first year no stats */}
          
          </div>
        </div>
      </section>

      <CompetitionTasksCarousel tasks={australianRoverChallengeTasks} />
    </div>
  );
}
