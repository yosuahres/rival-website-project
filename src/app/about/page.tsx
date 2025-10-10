import type { Metadata } from "next";
import { generatePageMetadata, metadataTemplates } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata(metadataTemplates.about);

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <section className="flex-1 flex items-center justify-center px-8 py-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-white font-black text-6xl mb-8">
            About RIVAL ITS
          </h1>
          <p className="text-white text-lg leading-relaxed">
            RIVAL ITS is Indonesia's premier robotics team, dedicated to pushing 
            the boundaries of technology and innovation. Our passionate team of 
            engineers and innovators work together to create cutting-edge robotic 
            solutions that inspire the next generation.
          </p>
        </div>
      </section>
    </div>
  );
}