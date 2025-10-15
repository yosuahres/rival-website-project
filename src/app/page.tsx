import Image from "next/image"; // Keep this if other images are used, otherwise remove
import Link from "next/link";
import type { Metadata } from "next";
import NextImage from "@/components/NextImage"; // Import custom NextImage component

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to RIVAL ITS - Indonesia's premier robotic team pushing boundaries in technology and innovation.",
};

export default function Home() {
  return (
    <>
      {/* Hero Section*/}
      <section className="flex items-center justify-center px-8 py-60 flex-1">
        <div className="flex items-center justify-center">
          {/* Center Content */}
          <div className="text-center">
            <p className="text-white text-4xl mb-6 tracking-wide">
              "Sat Set Wat Wet Rival Juara"
            </p>
            
            <h1 className="mb-8">
              <div className="text-white font-black text-7xl md:text-6xl leading-none mb-2">
                Welcome to RIVAL ITS
              </div>
              <div className="text-white font-black text-7xl md:text-6xl leading-none">
                Robotic Team Official Website
              </div>
            </h1>

            <p className="text-white text-2xl max-w-6xl mx-auto mb-10 leading-relaxed">
              RIVAL ITS represents excellence in robotics, innovation, and teamwork. 
              Join us on our journey to push the boundaries of technology 
              and inspire the next generation of engineers.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
