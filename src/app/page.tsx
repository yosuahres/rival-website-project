"use client";

import type { Metadata } from "next";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const _metadata: Metadata = {
  title: "Home",
  description:
    "Welcome to RIVAL ITS - Indonesia's premier robotic team pushing boundaries in technology and innovation.",
};

export default function Home() {
  const isMobile = useIsMobile();
  const teamSectionRef = useRef<HTMLDivElement>(null);
  const lastImageRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [teamImageLoaded, setTeamImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
    setTeamImageLoaded(false);

    const teamObserver = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setTeamImageLoaded(true);
      },
      { threshold: 0.2 },
    );
    if (teamSectionRef.current) {
      teamObserver.observe(teamSectionRef.current);
    }

    const lastObserver = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setImageLoaded(true);
      },
      { threshold: 0.2 },
    );
    if (lastImageRef.current) {
      lastObserver.observe(lastImageRef.current);
    }

    return () => {
      teamObserver.disconnect();
      lastObserver.disconnect();
    };
  }, []);

  return (
    <>
      <section
        className="flex items-center justify-between px-8 py-50 flex-1 relative rounded-bl-4xl rounded-br-4xl"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className="absolute inset-0 w-full h-full rounded-br-4xl rounded-bl-4xl"
          style={{
            backgroundImage: "url('/images/header.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.7,
            zIndex: 0,
            pointerEvents: "none",
            transform: "scaleX(-1)",
          }}
        />
        <div
          className="flex items-center justify-center flex-1 relative"
          style={{ zIndex: 1 }}
        >
          <Image
            src="/images/vertical.webp"
            alt="RIVAL ITS Logo"
            width={220}
            height={220}
            priority
          />
        </div>
        <div className="flex-1 relative" style={{ zIndex: 1 }} />
      </section>

      <section className="py-25 px-2">
        <div className="mx-auto text-center max-w-7xl">
          <h2 className="text-2xl md:text-4xl lg:text-5xl text-white mb-6 font-medium">
            Designing, Building, and Competing in Advanced Robotics Systems
          </h2>
          <p className="text-lg text-white mx-auto">
            RIVAL ITS is a student robotic team based in Indonesia, 
            dedicated to design and build advanced robots for national 
            and international competitions. Our mission is to push the 
            boundaries of technology and innovation, while fostering a 
            collaborative and inclusive environment for students to learn and grow.
          </p>
        </div>
      </section>

      <section className="py-0 px-0 bg-[#021507]">
        <div
          ref={teamSectionRef}
          className="w-full overflow-hidden shadow-lg"
          style={{ height: "600px", position: "relative" }}
        >
          <Image
            src="/images/home.webp"
            alt="RIVAL ITS Team"
            width={1920}
            height={1080}
            className={`w-full h-full object-cover object-center transition-opacity duration-700 ${teamImageLoaded ? "opacity-100" : "opacity-0"}`}
            priority
          />
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16 md:gap-0">
          <div className="flex-1 flex flex-col items-center">
            <span className="text-5xl md:text-[8vw] font-bold text-[#FFFFFF] leading-none">
              1st
            </span>
            <span className="text-2xl md:text-3xl text-white font-medium mt-6 mb-6">
              in Indonesia
            </span>
            <span className="text-lg md:text-xl text-gray-300 text-center">
              Indonesian Thematic Robot Contest
              <br />
              (2024)
            </span>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <span className="text-5xl md:text-[8vw] font-bold text-[#FFFFFF] leading-none">
              6th
            </span>
            <span className="text-2xl md:text-3xl text-white font-medium mt-6 mb-6">
              Worldwide
            </span>
            <span className="text-lg md:text-xl text-gray-300 text-center">
              Australian Rover Challenge (ARCh)
              <br />
              (2026)
            </span>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <span className="text-5xl md:text-[8vw] font-bold text-[#FFFFFF] leading-none">
              1st
            </span>
            <span className="text-2xl md:text-3xl text-white font-medium mt-6 mb-6">
              Indonesian rover team
            </span>
            <span className="text-lg md:text-xl text-gray-300 text-center">
              (2026)
            </span>
          </div>
        </div>
      </section>

      <section className="py-0 px-0 bg-[#021507]">
        <div
          ref={lastImageRef}
          className="w-full overflow-hidden shadow-lg relative"
          style={{ height: "600px" }}
        >
          <video
            src="/videos/videoprofil.mp4"
            poster="/images/home3.png"
            controls={false}
            muted
            loop
            autoPlay
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <h2 className="text-white text-2xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg mb-6 text-center">
              Through student leadership and teamwork, we innovate and excel.
            </h2>
            <p className="text-white text-sm md:text-lg lg:text-2xl font-base drop-shadow-lg text-center max-w-6xl">
              We design, build, and test the next generation of robots right
              here in Indonesia - and inspire future generations to do the same.
            </p>
          </div>
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        </div>
      </section>
    </>
  );
}
