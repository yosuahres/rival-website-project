"use client";

import type { Metadata } from "next";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const _metadata: Metadata = {
  title: "Home",
  description:
    "Welcome to RIVAL ITS - Indonesia's premier robotic team pushing boundaries in technology and innovation.",
};

export default function Home() {
  const teamSectionRef = useRef<HTMLDivElement>(null);
  const lastImageRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [teamImageLoaded, setTeamImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
    setTeamImageLoaded(false);

    // Fade in team image when in view
    const teamObserver = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setTeamImageLoaded(true);
      },
      { threshold: 0.2 },
    );
    if (teamSectionRef.current) {
      teamObserver.observe(teamSectionRef.current);
    }

    // Fade in last image when in view
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
          backgroundSize: "120%",
          backgroundPosition: "5px center",
          transform: "scaleX(-1)",
        }}
      >
        <div
          className="absolute inset-0 w-full h-full rounded-br-4xl rounded-bl-4xl"
          style={{
            backgroundImage: "url('/images/foreground-arc.png')",
            backgroundSize: "120%",
            backgroundPosition: "5px center",
            opacity: 0.7,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
        <div
          className="flex items-center justify-center flex-1 relative"
          style={{ transform: "scaleX(-1)", zIndex: 1 }}
        >
          <Image
            src="/images/vertical.png"
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
          <h2 className="text-5xl text-white mb-6 font-medium">
            A student robotic team designing and building robots for competition
          </h2>
          <p className="text-lg text-white mx-auto">
            RIVAL ITS is a student robotic team based in Indonesia, dedicated to
            designing and building advanced robots for international
            competitions. Our mission is to push the boundaries of technology
            and innovation, while fostering a collaborative and inclusive
            environment for students to learn and grow.
          </p>
        </div>
      </section>

      <section className="py-0 px-0 bg-black">
        <div
          ref={teamSectionRef}
          className="w-full overflow-hidden shadow-lg"
          style={{ height: "600px", position: "relative" }}
        >
          <Image
            src="/images/home.jpg"
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
            <span className="text-[10vw] md:text-[8vw] font-bold text-[#FFD700] leading-none">
              1st
            </span>
            <span className="text-2xl md:text-3xl text-white font-medium mt-6 mb-6">
              in Indonesia
            </span>
            <span className="text-lg md:text-xl text-gray-300 text-center">
              Indonesian Robot Contest
              <br />
              (2024)
            </span>
          </div>
        </div>
      </section>

      <section className="py-0 px-0 bg-black">
        <div
          ref={lastImageRef}
          className="w-full overflow-hidden shadow-lg relative"
          style={{ height: "600px" }}
        >
          <Image
            src="/images/home3.jpg"
            alt="RIVAL ITS Team 2"
            width={1920}
            height={1080}
            className={`w-full h-full object-cover object-center transition-opacity duration-700 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            priority
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <h2 className="text-white text-4xl md:text-5xl font-bold drop-shadow-lg mb-6 text-center">
              Through student leadership and teamwork, we innovate and excel.
            </h2>
            <p className="text-white text-xl md:text-2xl font-base  drop-shadow-lg text-center max-w-6xl">
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
