import type { Metadata } from "next";
import Image from 'next/image'; 

export const metadata: Metadata = {
  title: "Our Teams",
  description: "Meet the talented teams that make up RIVAL ITS - from mechanical design to software development, each team brings unique expertise.",
};

export default function Teams() {
  const teamMembers = [
    { name: 'dharma', image: '/personal-data/dharma.png', role: 'advisor team' },
    { name: 'Valencia Stevie F. H.', image: '/personal-data/stevie.png', role: 'electrical team' },
    { name: 'mely', image: '/personal-data/mely.png', role: 'electrical team' },
    { name: 'evan', image: '/personal-data/evan.png', role: 'electrical team' },
    { name: 'ademas', image: '/personal-data/ademas.png', role: 'electrical team' },
    { name: 'atok', image: '/personal-data/atok.png', role: 'mechanical team' },
    { name: 'anam', image: '/personal-data/anam.png', role: 'mechanical team' },
    { name: 'andre', image: '/personal-data/andre.png', role: 'mechanical team' },
    { name: 'rijal', image: '/personal-data/rijal.png', role: 'mechanical team' },
    { name: 'karina', image: '/personal-data/karina.png', role: 'outreach' },
    { name: 'gibran', image: '/personal-data/gibran.png', role: 'outreach' },
    { name: 'kaysa', image: '/personal-data/kaysa.png', role: 'outreach' },
    { name: 'Wildan', image: '/personal-data/wildan.png', role: 'programming team' },
    { name: 'naufal', image: '/personal-data/naufal.png', role: 'programming team' },
    { name: 'radit', image: '/personal-data/radit.png', role: 'programming team' },
  ];

  const roles = ['advisor team', 'electrical team', 'mechanical team', 'programming team', 'outreach'];

  return (
    <div className="flex flex-col min-h-full">
      <section className="flex-1 px-8 py-35">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-white font-black text-6xl mb-8">
            Meet the Team
          </h1>

          {roles.map((role) => {
            const membersInRole = teamMembers.filter(member => member.role === role);
            return (
              <div key={role} className="mb-12">
                <h2 className="text-white font-bold text-4xl mt-12 mb-8 capitalize">
                  {role}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                  {membersInRole.length > 0 ? (
                    membersInRole.map((member, index) => (
                      <div key={index} className="bg-white/10 rounded-2xl p-6 flex flex-col items-center">
                        <div className="w-[200px] h-[200px] rounded-full overflow-hidden flex items-center justify-center mb-4">
                          <Image src={member.image} alt={`Team member ${member.name}`} width={200} height={200} className="object-cover" />
                        </div>
                        <p className="text-white">{member.name.charAt(0).toUpperCase() + member.name.slice(1)}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-[#1e5f4e] col-span-full">No {role} members available.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
