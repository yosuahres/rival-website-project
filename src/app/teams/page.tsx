import type { Metadata } from "next";
import Image from "next/image";
import RoleNavigation from "@/components/RoleNavigation";

export const metadata: Metadata = {
  title: "Our Teams",
  description:
    "Meet the talented teams that make up RIVAL ITS - from mechanical design to software development, each team brings unique expertise.",
};

export default function Teams() {
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
      name: "Khoirul Anam",
      image: "/personal-data/anam.png",
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
      <section className="flex-1 px-4 sm:px-8 py-20 sm:py-35 relative">
        <div className="hidden md:block sm:absolute sm:top-[250px] sm:left-8 sm:w-[300px] w-full static mb-8 sm:mb-0">
          <RoleNavigation roles={roles} />
        </div>

        <div className="w-full">
          <div className="w-full max-w-4xl mx-auto">
            <div className="text-center">
              <h1 className="text-white font-black text-4xl sm:text-6xl mb-6 sm:mb-8">
                Meet the Team
              </h1>
            </div>
          </div>

          <div className="w-full h-1 bg-white my-6 sm:my-8 animate-line-grow"></div>
          <div className="w-full max-w-4xl mx-auto">
            <div className="text-center">
              {roles.map((role) => {
                const membersInRole = teamMembers.filter(
                  (member) => member.role === role,
                );
                const isFew = membersInRole.length <= 2;
                return (
                  <div
                    id={role.replace(/\s+/g, "-")}
                    key={role}
                    className="mb-8 sm:mb-12"
                  >
                    <h2 className="text-white font-bold text-2xl sm:text-4xl mt-8 sm:mt-12 mb-6 sm:mb-8 capitalize text-center">
                      {role}
                    </h2>
                    <div
                      className={
                        isFew
                          ? "flex justify-center gap-6 sm:gap-8 mt-8 sm:mt-12 flex-wrap"
                          : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-12"
                      }
                    >
                      {membersInRole.length > 0 ? (
                        membersInRole.map((member) => (
                          <div
                            key={member.name}
                            className={
                              "bg-white/10 rounded-2xl p-4 sm:p-6 flex flex-col items-center" +
                              (isFew ? " w-80 max-w-xs" : "")
                            }
                          >
                            <div className="w-40 h-40 sm:w-[400px] sm:h-[400px] rounded-full overflow-hidden flex items-center justify-center mb-4">
                              <Image
                                src={member.image}
                                alt={`Team member ${member.name}`}
                                width={200}
                                height={200}
                                className="h-full object-cover"
                              />
                            </div>
                            <p className="text-white font-medium text-lg sm:text-xl">
                              {member.name.charAt(0).toUpperCase() +
                                member.name.slice(1)}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-[#1e5f4e] col-span-full">
                          No {role} members available.
                        </p>
                      )}
                    </div>
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
