import type { Metadata } from "next";
import Image from 'next/image'; // Assuming NextImage is not used, using default next/image

export const metadata: Metadata = {
  title: "Our Teams",
  description: "Meet the talented teams that make up RIVAL ITS - from mechanical design to software development, each team brings unique expertise.",
};

export default function Teams() {
  const teamMembers = [
    { name: 'ademas', image: '/personal-data/ademas.png' },
    { name: 'anam', image: '/personal-data/anam.png' },
    { name: 'andre', image: '/personal-data/andre.png' },
    { name: 'atok', image: '/personal-data/atok.png' },
    { name: 'dharma', image: '/personal-data/dharma.png' },
    { name: 'evan', image: '/personal-data/evan.png' },
    { name: 'gibran', image: '/personal-data/gibran.png' },
    { name: 'karina', image: '/personal-data/karina.png' },
    { name: 'kaysa', image: '/personal-data/kaysa.png' },
    { name: 'mely', image: '/personal-data/mely.png' },
    { name: 'naufal', image: '/personal-data/naufal.png' },
    { name: 'radit', image: '/personal-data/radit.png' },
    { name: 'rijal', image: '/personal-data/rijal.png' },
    { name: 'stevie', image: '/personal-data/stevie.png' },
    { name: 'wildan', image: '/personal-data/wildan.png' },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <section className="flex-1 px-8 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-white font-black text-6xl mb-8">
            Our Teams
          </h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {teamMembers.length > 0 ? (
              teamMembers.map((member, index) => (
                <div key={index} className="bg-white/10 rounded-2xl p-6 flex flex-col items-center">
                  <Image src={member.image} alt={`Team member ${member.name}`} width={200} height={200} className="rounded-full object-cover mb-4" />
                  <p className="text-white/80">{member.name.charAt(0).toUpperCase() + member.name.slice(1)}</p>
                </div>
              ))
            ) : (
              <p className="text-white/80 col-span-full">No team photos available.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
