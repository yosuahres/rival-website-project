"use client";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Teams() {
  const isMobile = useIsMobile();
  const teamMembers = [
    {
      name: "Moh Ismarintan Zazuli",
      image: "/personal-data/super-marin2.png",
      role: "team advisor",
      position: "Team Advisor",
      offset: { x: 0, y: 0 },
    },
    {
      name: "Aditya Dharma Saputra",
      image: "/personal-data/lead-dharma.png",
      role: "team leader",
      position: "Team Leader",
      offset: { x: 0, y: 15 },
    },
    {
      name: "Mochammad Rifki Al Syawal",
      image: "/personal-data/elc-syawal.png",
      role: "electrical team",
      position: "Leader of Electrical",
      offset: { x: 0, y: 15 },
    },
    {
      name: "Valencia Stevie F. H.",
      image: "/personal-data/elc-tip.png",
      role: "electrical team",
      position: "Expert Staff of Electrical",
      offset: { x: 20, y: 0 },
    },
    {
      name: "Melyana Putri Tiyarno",
      image: "/personal-data/elc-melyana.png",
      role: "electrical team",
      position: "Expert Staff of Electrical",
      offset: { x: -20, y: 0 },
    },
    {
      name: "Evan Javier Firdausi Malik",
      image: "/personal-data/elc-evan.png",
      role: "electrical team",
      position: "Expert Staff of Electrical",
      offset: { x: -20, y: 0 },
    },
    {
      name: "Ademas Fazri Sunaryo",
      image: "/personal-data/elc-ademas.png",
      role: "electrical team",
      position: "Expert Staff of Electrical",
      offset: { x: -10, y: 0 },
    },
    {
      name: "I Ketut Pajar Mahensanjaya",
      image: "/personal-data/elc-pajar.png",
      role: "electrical team",
      position: "Staff of Electrical",
      offset: { x: -15, y: 20 },
    },
    {
      name: "Ahmad Kagendra Nouval Arianto",
      image: "/personal-data/elc-nouval.png",
      role: "electrical team",
      position: "Staff of Electrical",
      offset: { x: 20, y: 20 },
    },

    {
      name: "Rizal Khoirul Atok",
      image: "/personal-data/mech-atok.png",
      role: "mechanical team",
      position: "Leader of Mechanical",
      offset: { x: -10, y: 20 },
    },
    {
      name: "Andreas Agung Servia Pintarta",
      image: "/personal-data/mech-andre.png",
      role: "mechanical team",
      position: "Expert Staff of Mechanical",
      offset: { x: 5, y: 10 },
    },
    {
      name: "Muhammad Rizal Hakim",
      image: "/personal-data/mech-rizal.png",
      role: "mechanical team",
      position: "Expert Staff of Mechanical",
      offset: { x: -10, y: 0 },
    },
    {
      name: "Naafi' Aziz Salam",
      image: "/personal-data/mech-naafi.png",
      role: "mechanical team",
      position: "Staff of Mechanical",
      offset: { x: 0, y: 0 },
    },
    {
      name: "Wisnu Istiawan",
      image: "/personal-data/mech-wisnu.png",
      role: "mechanical team",
      position: "Staff of Mechanical",
      offset: { x: -10, y: 25 },
    },
    {
      name: "Rifqi Haikal Zahran",
      image: "/personal-data/mech-rifqi.png",
      role: "mechanical team",
      position: "Staff of Mechanical",
      offset: { x: -10, y: 25 },
    },
    
    {
      name: "Zalfa Nafila Khairunnisa",
      image: "/personal-data/prog-zalfa.png",
      role: "programming team",
      position: "Leader of Programming",
      offset: { x: 10, y: 0 },
    },
    {
      name: "Moh. Wildan Risqi Maulidi",
      image: "/personal-data/prog-wildan.png",
      role: "programming team",
      position: "Expert Staff of Programming",
      offset: { x: -5, y: 20 },
    },
    {
      name: "Naufal Daffa Alfa Zain",
      image: "/personal-data/prog-naufal.png",
      role: "programming team",
      position: "Expert Staff of Programming",
      offset: { x: 15, y: 0 },
    },
    {
      name: "Raditya Zhafran Pranuja",
      image: "/personal-data/prog-radit.png",
      role: "programming team",
      position: "Expert Staff of Programming",
      offset: { x: -5, y: 0 },
    },
    {
      name: "Budiman Setiono",
      image: "/personal-data/prog-budi.png",
      role: "programming team",
      position: "Staff of Programming",
      offset: { x: -10, y: 0 },
    },
    {
      name: "Narendra Andhi Putra Pratama",
      image: "/personal-data/prog-naren.png",
      role: "programming team",
      position: "Staff of Programming",
      offset: { x: 5, y: 10 },
    },
    {
      name: "Karina Maheswari",
      image: "/personal-data/ofc-kar.png",
      role: "non-tech",
      position: "Leader of Non-Tech",
      offset: { x: 0, y: 0 },
    },
    {
      name: "Oktavian Rifki Danendra",
      image: "/personal-data/ofc-rifki.png",
      role: "non-tech",
      position: "Expert Staff of Non-Tech",
      offset: { x: -10, y: 0 },
    },
    {
      name: "Alif Gibran",
      image: "/personal-data/ofc-gib.png",
      role: "non-tech",
      position: "Expert Staff of Non-Tech",
      offset: { x: -10, y: 0 },
    },
    {
      name: "Kaysa Tsana Adilah",
      image: "/personal-data/ofc-kay.png",
      role: "non-tech",
      position: "Expert Staff of Non-Tech",
      offset: { x: 0, y: 0 },
    },
    {
      name: "Enno Ajeng Larasati",
      image: "/personal-data/ofc-enno.png",
      role: "non-tech",
      position: "Staff of Non-Tech",
      offset: { x: 0, y: 0 },
    },
    {
      name: "Daffa Ramadhani Nugroho",
      image: "/personal-data/ofc-dap.png",
      role: "non-tech",
      position: "Staff of Non-Tech",
      offset: { x: 0, y: 0 },
    },
    {
      name: "Dion Hardi Saputra",
      image: "/personal-data/ofc-dion.png",
      role: "non-tech",
      position: "Staff of Non-Tech",
      offset: { x: 5, y: 0 },
    },
  ];
  
  const roles = [
    "team advisor",
    "team leader",
    "electrical team",
    "mechanical team",
    "programming team",
    "non-tech",
  ];

  return (
    <div className="flex flex-col min-h-full">
      <section className="py-80 sm:py-96 relative overflow-hidden mt-10 sm:mt-15" style={{clipPath: "polygon(0 0, 100% 0, 100% 88%, 80% 93%, 50% 96%, 20% 93%, 0 88%)"}}>
        <div className="absolute inset-0 -z-50">
          <Image
            src="/personal-data/hero-teams.png"
            alt="Team background"
            fill
            className="object-cover object-center opacity-50"
            priority
          />
        </div>

        <div className="w-full relative z-10">
          <div className="w-full">
            <div className="text-center">
              <h1 className="text-white font-black text-4xl sm:text-6xl mb-6 sm:mb-8">
                Meet the Team
              </h1>
            </div>
          </div>
        </div>
      </section>

      <svg
        className="w-full relative z-10"
        viewBox="0 0 100 30"
        preserveAspectRatio="none"
        style={{ height: "80px", marginTop: "-105px" }}
      >
        <polyline
          points="0,0 20,15 50,28 80,15 100,0"
          stroke="white"
          strokeWidth="3"
          fill="none"
          strokeLinejoin="round"
        />
      </svg>

      <section className="flex-1">
        <div className="w-full">
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
                              <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden flex items-center justify-center mb-4 bg-white/10 relative">
                                <Image
                                  src={member.image}
                                  alt={`Team member ${member.name}`}
                                  fill
                                  className="object-cover object-center"
                                  style={{
                                    transform: `translate(${member.offset.x}px, ${member.offset.y}px)`
                                  }}
                                />
                              </div>
                              <p className="text-white font-medium text-lg sm:text-xl text-center">
                                {member.name.charAt(0).toUpperCase() +
                                  member.name.slice(1)}
                              </p>
                              <p className="text-white/70 text-sm sm:text-base text-center capitalize">
                                {member.position}
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
                        className="w-full h-16 my-8 sm:my-12 relative z-10"
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
