import Image from "next/image"; 
import Link from "next/link";
import type { Metadata } from "next";
import NextImage from "@/components/NextImage";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to RIVAL ITS - Indonesia's premier robotic team pushing boundaries in technology and innovation.",
};

export default function Home() {
  return (
    <>
      {/* Hero Section*/}
      <section
        className="flex items-center justify-between px-8 py-80 flex-1 relative rounded-bl-4xl rounded-br-4xl"
        style={{
          backgroundImage: "url('/images/foreground-arc.png')",
          backgroundSize: "120%", 
          backgroundPosition: "5px center",
          transform: "scaleX(-1)",
        }}
      >
        {/* Left side: Logo centered vertically, un-mirrored */}
        <div className="flex items-center justify-center flex-1" style={{ transform: "scaleX(-1)" }}>
          <Image
            src="/images/vertical.png"
            alt="RIVAL ITS Logo"
            width={220}
            height={220}
            priority
          />
        </div>
        {/* Right side (empty or add content here) */}
        <div className="flex-1" />
      </section>

      {/* About Section */}
      <section className="py-20 px-2">
        <div className="mx-auto text-center max-w-7xl">
          <h2 className="text-5xl text-white mb-6 font-medium">A student robotic team designing and building robots for competition</h2>
          <p className="text-lg text-white mx-auto">
            RIVAL ITS is a student robotic team based in Indonesia, dedicated to designing and building advanced robots for international competitions.
            Our mission is to push the boundaries of technology and innovation, while fostering a collaborative and inclusive environment for students to learn and grow.
          </p>
        </div>         
      </section>

      
    </>
  );
}

