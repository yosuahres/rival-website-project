import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to RIVAL ITS - Indonesia's premier robotic team pushing boundaries in technology and innovation.",
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-8 py-4 relative overflow-hidden">
        <div className="max-w-[1400px] w-full flex items-center justify-between gap-12 -mt-40">
          {/* robot left svg*/}
          {/* <div className="flex-shrink-0">
            <Image
              src="/peace-hand.svg"
              alt="Peace hand"
              width={180}
              height={270}
              className="animate-float"
            />
          </div> */}

          {/* Center Content */}
          <div className="flex-1 text-center">
            <p className="text-white text-lg mb-6 font-light tracking-wide">
              "Sat Set Wat Wet Rival Juara"
            </p>
            
            <h1 className="mb-8">
              <div className="text-white font-black text-7xl md:text-6xl leading-none mb-2">
                Welcome to RIVAL ITS
              </div>
              <div className="text-white font-black text-7xl md:text-6xl leading-none">
                Robotic Team Official Website
              </div>
              {/* <div className="text-white font-black text-7xl md:text-6xl leading-none">
                Official Website
              </div> */}
            </h1>

            <p className="text-white text-base max-w-2xl mx-auto mb-10 leading-relaxed">
              Rival represents excellence in robotics, innovation, and teamwork. 
              Join us on our journey to push the boundaries of technology 
              and inspire the next generation of engineers.
            </p>

            {/* CTA Buttons */}
            {/* <div className="flex gap-4 justify-center items-center">
              <Link 
                href="/acheter"
                className="px-8 py-4 bg-pink-400 hover:bg-pink-500 text-white font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Je suis acheteur
              </Link>
              <Link 
                href="/vendre"
                className="px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Je suis vendeur
              </Link>
            </div> */}
          </div>

          {/* robot right svg */}
          {/* <div className="flex-shrink-0">
            <Image
              src="/thumbs-up.svg"
              alt="Thumbs up"
              width={180}
              height={270}
              className="animate-float-delayed"
            />
          </div> */}
        </div>
      </section>
    </div>
  );
}
