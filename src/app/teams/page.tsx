"use client";
import Image from "next/image";

export default function Teams() {
  const teamMembers = [
    {
      name: "Moh Ismarintan Zazuli",
      image: "/images/teams/advisor/ismarintan.png",
      role: "team advisor",
      position: "Team Advisor",
      offset: { x: 0, y: 0 },
    },
    {
      name: "Aditya Dharma Saputra",
      image: "/images/teams/leader/dharma.png",
      role: "team leader",
      position: "Team Leader",
      offset: { x: 0, y: 15 },
    },
    {
      name: "Mochammad Rifki Al Syawal",
      image: "/images/teams/electrical/syawal.png",
      role: "electrical team",
      position: "Leader of Electrical",
      offset: { x: 0, y: 15 },
    },
    {
      name: "Valencia Stevie F. H.",
      image: "/images/teams/electrical/tip.png",
      role: "electrical team",
      position: "Expert Staff of Electrical",
      offset: { x: 20, y: 0 },
    },
    {
      name: "Melyana Putri Tiyarno",
      image: "/images/teams/electrical/melyana.png",
      role: "electrical team",
      position: "Expert Staff of Electrical",
      offset: { x: -20, y: 0 },
    },
    {
      name: "Evan Javier Firdausi Malik",
      image: "/images/teams/electrical/evan.png",
      role: "electrical team",
      position: "Expert Staff of Electrical",
      offset: { x: -20, y: 0 },
    },
    {
      name: "Ademas Fazri Sunaryo",
      image: "/images/teams/electrical/ademas.png",
      role: "electrical team",
      position: "Expert Staff of Electrical",
      offset: { x: -10, y: 0 },
    },
    {
      name: "I Ketut Pajar Mahensanjaya",
      image: "/images/teams/electrical/pajar.png",
      role: "electrical team",
      position: "Staff of Electrical",
      offset: { x: -15, y: 20 },
    },
    {
      name: "Ahmad Kagendra Nouval Arianto",
      image: "/images/teams/electrical/nouval.png",
      role: "electrical team",
      position: "Staff of Electrical",
      offset: { x: 20, y: 20 },
    },

    {
      name: "Rizal Khoirul Atok",
      image: "/images/teams/mechanical/atok.png",
      role: "mechanical team",
      position: "Leader of Mechanical",
      offset: { x: -10, y: 20 },
    },
    {
      name: "Andreas Agung Servia Pintarta",
      image: "/images/teams/mechanical/andre.png",
      role: "mechanical team",
      position: "Expert Staff of Mechanical",
      offset: { x: 5, y: 10 },
    },
    {
      name: "Muhammad Rizal Hakim",
      image: "/images/teams/mechanical/rizal.png",
      role: "mechanical team",
      position: "Expert Staff of Mechanical",
      offset: { x: -10, y: 0 },
    },
    {
      name: "Naafi' Aziz Salam",
      image: "/images/teams/mechanical/naafi.png",
      role: "mechanical team",
      position: "Staff of Mechanical",
      offset: { x: 0, y: 0 },
    },
    {
      name: "Wisnu Istiawan",
      image: "/images/teams/mechanical/wisnu.png",
      role: "mechanical team",
      position: "Staff of Mechanical",
      offset: { x: -10, y: 25 },
    },
    {
      name: "Rifqi Haikal Zahran",
      image: "/images/teams/mechanical/rifqi.png",
      role: "mechanical team",
      position: "Staff of Mechanical",
      offset: { x: -10, y: 25 },
    },

    {
      name: "Zalfa Nafila Khairunnisa",
      image: "/images/teams/programming/zalfa.png",
      role: "programming team",
      position: "Leader of Programming",
      offset: { x: 10, y: 0 },
    },
    {
      name: "Moh. Wildan Risqi Maulidi",
      image: "/images/teams/programming/wildan.png",
      role: "programming team",
      position: "Expert Staff of Programming",
      offset: { x: -5, y: 20 },
    },
    {
      name: "Naufal Daffa Alfa Zain",
      image: "/images/teams/programming/naufal.png",
      role: "programming team",
      position: "Expert Staff of Programming",
      offset: { x: 15, y: 0 },
    },
    {
      name: "Raditya Zhafran Pranuja",
      image: "/images/teams/programming/radit.png",
      role: "programming team",
      position: "Expert Staff of Programming",
      offset: { x: -5, y: 0 },
    },
    {
      name: "Budiman Setiono",
      image: "/images/teams/programming/budi.png",
      role: "programming team",
      position: "Staff of Programming",
      offset: { x: -10, y: 0 },
    },
    {
      name: "Narendra Andhi Putra Pratama",
      image: "/images/teams/programming/naren.png",
      role: "programming team",
      position: "Staff of Programming",
      offset: { x: 5, y: 10 },
    },
    {
      name: "Karina Maheswari",
      image: "/images/teams/non-tech/kar.png",
      role: "non-tech",
      position: "Leader of Non-Tech",
      offset: { x: 0, y: 0 },
    },
    {
      name: "Oktavian Rifki Danendra",
      image: "/images/teams/non-tech/rifki.png",
      role: "non-tech",
      position: "Expert Staff of Non-Tech",
      offset: { x: -10, y: 0 },
    },
    {
      name: "Alif Gibran",
      image: "/images/teams/non-tech/gib.png",
      role: "non-tech",
      position: "Expert Staff of Non-Tech",
      offset: { x: -10, y: 0 },
    },
    {
      name: "Kaysa Tsana Adilah",
      image: "/images/teams/non-tech/kay.png",
      role: "non-tech",
      position: "Expert Staff of Non-Tech",
      offset: { x: 0, y: 0 },
    },
    {
      name: "Enno Ajeng Larasati",
      image: "/images/teams/non-tech/enno.png",
      role: "non-tech",
      position: "Staff of Non-Tech",
      offset: { x: 0, y: 0 },
    },
    {
      name: "Daffa Ramadhani Nugroho",
      image: "/images/teams/non-tech/dap.png",
      role: "non-tech",
      position: "Staff of Non-Tech",
      offset: { x: 0, y: 0 },
    },
    {
      name: "Dion Hardi Saputra",
      image: "/images/teams/non-tech/dion.png",
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
      <section className="relative mx-3 md:mx-4 flex aspect-[6/7] items-center justify-center overflow-hidden rounded-4xl md:aspect-auto md:py-96">
        <div className="absolute inset-0 -z-50">
          <Image
            src="/images/teams/hero-background.png"
            alt="Team background"
            fill
            className="object-cover object-center grayscale"
            priority
          />
          {/* Keeps the title legible over the brightest part of the photo and
              blends the frame's bottom edge into the black section beneath it. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70"
          />
        </div>

        <div className="w-full relative z-10">
          <div className="w-full">
            <div className="text-center">
              <h1 className="text-white font-black text-5xl md:text-7xl mb-6 sm:mb-8">
                Meet the Team
              </h1>
            </div>
          </div>
        </div>
      </section>

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
                            : "w-full grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-12"
                        }
                      >
                        {membersInRole.length > 0 ? (
                          membersInRole.map((member) => (
                            <div
                              key={member.name}
                              className="flex flex-col items-center"
                            >
                              <div className="w-36 h-36 sm:w-64 sm:h-64 rounded-full overflow-hidden flex items-center justify-center mb-3 sm:mb-4 bg-white/10 relative">
                                <Image
                                  src={member.image}
                                  alt={`Team member ${member.name}`}
                                  fill
                                  className="object-cover object-center"
                                  style={{
                                    transform: `translate(${member.offset.x}px, ${member.offset.y}px)`,
                                  }}
                                />
                              </div>
                              <p className="text-white font-medium text-base sm:text-xl text-center">
                                {member.name.charAt(0).toUpperCase() +
                                  member.name.slice(1)}
                              </p>
                              <p className="text-white/70 text-xs sm:text-base text-center capitalize">
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
                        aria-hidden="true"
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
