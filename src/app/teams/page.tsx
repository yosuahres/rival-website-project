"use client";

import type { Metadata } from "next";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";

const metadata: Metadata = {
  title: "Our Teams",
  description:
    "Meet the talented teams that make up RIVAL ITS - from mechanical design to software development, each team brings unique expertise.",
};

export default function Teams() {
  const isMobile = useIsMobile();
  const teamMembers = [
    {
      name: "Moh Ismarintan Zazuli",
      image: "/personal-data/marin2.png",
      role: "advisor team",
    },
    {
      name: "Aditya Dharma Saputra",
      image: "/personal-data/dharma.png",
      role: "team leader",
    },
    {
      name: "Mochammad Rifki Al Syawal",
      image: "/personal-data/syawal.png",
      role: "electrical team",
    },
    {
      name: "Valencia Stevie F. H.",
      image: "/personal-data/stevie.png",
      role: "electrical team",
    },
    {
      name: "Melyana Putri Tiyarno",
      image: "/personal-data/mely.png",
      role: "electrical team",
    },
    {
      name: "Evan Javier Firdausi Malik",
      image: "/personal-data/evan.png",
      role: "electrical team",
    },
    {
      name: "Ademas Fazri Sunaryo",
      image: "/personal-data/ademas.png",
      role: "electrical team",
    },
    {
      name: "Rizal Khoirul Atok",
      image: "/personal-data/atok.png",
      role: "mechanical team",
    },
    {
      name: "Andreas Agung Servia Pintarta",
      image: "/personal-data/andre.png",
      role: "mechanical team",
    },
    {
      name: "Muhammad Rizal Hakim",
      image: "/personal-data/rijal.png",
      role: "mechanical team",
    },
    {
      name: "Karina Maheswari",
      image: "/personal-data/karina.png",
      role: "outreach",
    },
    {
      name: "Oktavian Rifki Danendra",
      image: "/personal-data/rifki.png",
      role: "outreach",
    },
    {
      name: "Alif Gibran",
      image: "/personal-data/gibran.png",
      role: "outreach",
    },
    {
      name: "Kaysa Tsana Adilah",
      image: "/personal-data/kaysa.png",
      role: "outreach",
    },
    {
      name: "Moh. Wildan Risqi Maulidi",
      image: "/personal-data/wildan.png",
      role: "programming team",
    },
    {
      name: "Zalfa Nafila Khairunnisa",
      image: "/personal-data/zalfa2.png",
      role: "programming team",
    },
    {
      name: "Naufal Daffa Alfa Zain",
      image: "/personal-data/naufal.png",
      role: "programming team",
    },
    {
      name: "Raditya Zhafran Pranuja",
      image: "/personal-data/radit.png",
      role: "programming team",
    },
  ];

  const roles = [
    "advisor team",
    "team leader",
    "electrical team",
    "mechanical team",
    "programming team",
    "outreach",
  ];

  return (
    <div className="flex flex-col min-h-full">
      <section className="flex-1 py-20 sm:py-35 relative">
        <div className="w-full">
          <div className="w-full">
            <div className="text-center">
              <h1 className="text-white font-black text-4xl sm:text-6xl mb-6 sm:mb-8">
                Meet the Team
              </h1>
            </div>
          </div>

          <div className="w-full h-1 bg-white my-6 sm:my-8 animate-line-grow"></div>
          <div className="w-full">
            <div className="text-center">
              {roles.map((role, index) => {
                const membersInRole = teamMembers.filter(
                  (member) => member.role === role,
                );
                return (
                  <div key={role}>
                    <div
                      id={role.replace(/\s+/g, "-")}
                      className="mb-8 sm:mb-12"
                    >
                      <h2 className="text-white font-bold text-2xl sm:text-4xl mt-8 sm:mt-12 mb-6 sm:mb-8 capitalize text-center">
                        {role}
                      </h2>
                      <div
                        className={
                          index === 0 || index === 1
                            ? "flex justify-center gap-3 sm:gap-4 mt-8 sm:mt-12"
                            : "w-full grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-12"
                        }
                      >
                        {membersInRole.length > 0 ? (
                          membersInRole.map((member) => (
                            <div
                              key={member.name}
                              className="flex flex-col items-center"
                            >
                              <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden flex items-center justify-center mb-4 bg-white/10">
                                <Image
                                  src={member.image}
                                  alt={`Team member ${member.name}`}
                                  width={200}
                                  height={200}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <p className="text-white font-medium text-lg sm:text-xl text-center">
                                {member.name.charAt(0).toUpperCase() +
                                  member.name.slice(1)}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-[#398561] col-span-full">
                            No {role} members available.
                          </p>
                        )}
                      </div>
                    </div>
                    {index < roles.length - 1 && (
                      <svg
                        className="w-full h-16 my-8 sm:my-12"
                        viewBox="0 0 1200 100"
                        preserveAspectRatio="none"
                      >
                        <path
                          d={
                            index === 0
                              ? "M0,50 Q600,-30 1200,50"
                              : "M0,50 Q300,20 600,50 T1200,50"
                          }
                          stroke="white"
                          strokeWidth="4"
                          fill="none"
                        />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
