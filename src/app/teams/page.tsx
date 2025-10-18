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
      name: "dharma",
      image: "/personal-data/dharma.png",
      role: "advisor team",
    },
    {
      name: "Valencia Stevie F. H.",
      image: "/personal-data/stevie.png",
      role: "electrical team",
    },
    { name: "mely", image: "/personal-data/mely.png", role: "electrical team" },
    { name: "evan", image: "/personal-data/evan.png", role: "electrical team" },
    {
      name: "ademas",
      image: "/personal-data/ademas.png",
      role: "electrical team",
    },
    { name: "atok", image: "/personal-data/atok.png", role: "mechanical team" },
    { name: "anam", image: "/personal-data/anam.png", role: "mechanical team" },
    {
      name: "andre",
      image: "/personal-data/andre.png",
      role: "mechanical team",
    },
    {
      name: "rijal",
      image: "/personal-data/rijal.png",
      role: "mechanical team",
    },
    { name: "karina", image: "/personal-data/karina.png", role: "outreach" },
    { name: "gibran", image: "/personal-data/gibran.png", role: "outreach" },
    { name: "kaysa", image: "/personal-data/kaysa.png", role: "outreach" },
    {
      name: "Wildan",
      image: "/personal-data/wildan.png",
      role: "programming team",
    },
    {
      name: "naufal",
      image: "/personal-data/naufal.png",
      role: "programming team",
    },
    {
      name: "radit",
      image: "/personal-data/radit.png",
      role: "programming team",
    },
  ];

  const roles = [
    "advisor team",
    "electrical team",
    "mechanical team",
    "programming team",
    "outreach",
  ];

  return (
    <div className="flex flex-col min-h-full">
      <section className="flex-1 px-8 py-35 relative">
        {/* Left-side navigation for roles */}
        <div className="absolute top-[250px] left-8 w-[300px]">
          <RoleNavigation roles={roles} />
        </div>

        {/* Main content wrapper */}
        <div className="w-full">
          {/* Constrained container for the title */}
          <div className="w-full max-w-4xl mx-auto">
            <div className="text-center">
              <h1 className="text-white font-black text-6xl mb-8">
                Meet the Team
              </h1>
            </div>
          </div>

          {/* Full-width line (moved outside the max-w-4xl container) */}
          <div className="w-full h-1 bg-white my-8 animate-line-grow"></div>

          {/* Constrained container for the team grid */}
          <div className="w-full max-w-4xl mx-auto">
            <div className="text-center">
              {roles.map((role) => {
                const membersInRole = teamMembers.filter(
                  (member) => member.role === role,
                );
                return (
                  <div
                    id={role.replace(/\s+/g, "-")}
                    key={role}
                    className="mb-12"
                  >
                    {/* Centered title */}
                    <h2 className="text-white font-bold text-4xl mt-12 mb-8 capitalize text-center">
                      {role}
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                      {membersInRole.length > 0 ? (
                        membersInRole.map((member) => (
                          <div
                            key={member.name}
                            className="bg-white/10 rounded-2xl p-6 flex flex-col items-center"
                          >
                            <div className="w-[400px] h-[400px] rounded-full overflow-hidden flex items-center justify-center mb-4">
                              <Image
                                src={member.image}
                                alt={`Team member ${member.name}`}
                                width={200}
                                height={200}
                                className="h-full object-cover"
                              />
                            </div>
                            <p className="text-white font-medium text-xl">
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
