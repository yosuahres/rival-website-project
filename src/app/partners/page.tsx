import type { Metadata } from "next";
import NextImage from '@/components/NextImage';

export const metadata: Metadata = {
  title: "Our Sponsors and Supporters",
  description: "Meet the amazing sponsors and supporters who help RIVAL ITS achieve excellence in robotics competition.",
};

export default function Sponsors() {
  return (
    <>
      <div className="min-h-screen">
        {/* Header Section */}
        <div className="text-[#1e5f4e] py-20 px-8">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Sponsors and Supporters
            </h1>
            <p className="text-lg md:text-xl leading-relaxed max-w-6xl mx-auto">
              By supporting RIVAL ITS, you are empowering our students with a platform to grow their skills and compete on the world stage. 
              We'd like to personally thank all of our supporters for their generosity!
            </p>
          </div>
        </div>

        {/* Sponsors Grid Section */}
        <div className="py-20 px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-center justify-items-center">
              
              {/* Existing Sponsor - Indah Puri */}
              <div className="flex justify-center">
                <NextImage 
                  src="/sponsors/indahpuri.png" 
                  alt="Indah Puri" 
                  width={250} 
                  height={150}
                  className="max-w-full h-auto"
                />
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Contact text above footer */}
      <div className="bg-black py-4 px-8">
        <p className="text-white text-sm">
          Please send any business and sponsorship related enquires to: 
          <span className="font-semibold"> official.krtmiits@gmail.com</span>
        </p>
      </div>
    </>
  );
}