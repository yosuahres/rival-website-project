import type { Metadata } from "next";
import { supabase } from '../../lib/supabase';
import Image from 'next/image'; // Assuming NextImage is not used, using default next/image

export const metadata: Metadata = {
  title: "Our Teams",
  description: "Meet the talented teams that make up RIVAL ITS - from mechanical design to software development, each team brings unique expertise.",
};

async function getTeamPhotos() {
  const { data, error } = await supabase.storage.from('personal-image').list('', {
    limit: 15,
    offset: 0,
    sortBy: { column: 'name', order: 'asc' },
  });

  if (error) {
    console.error('Error fetching team photos:', error);
    return [];
  }

  const photoUrls = data.map((file) => {
    const { data: publicUrlData } = supabase.storage.from('personal-image').getPublicUrl(file.name);
    return publicUrlData.publicUrl;
  });

  return photoUrls;
}

export default async function Teams() {
  const teamPhotos = await getTeamPhotos();

  return (
    <div className="flex flex-col min-h-full">
      <section className="flex-1 px-8 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-white font-black text-6xl mb-8">
            Our Teams
          </h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {teamPhotos.length > 0 ? (
              teamPhotos.map((url, index) => (
                <div key={index} className="bg-white/10 rounded-2xl p-6 flex flex-col items-center">
                  <Image src={url} alt={`Team member ${index + 1}`} width={200} height={200} className="rounded-full object-cover mb-4" />
                  <p className="text-white/80">Team Member {index + 1}</p>
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
