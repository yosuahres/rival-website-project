import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Teams",
  description: "Meet the talented teams that make up RIVAL ITS - from mechanical design to software development, each team brings unique expertise.",
};

export default function Teams() {
  return (
    <div className="min-h-screen flex flex-col">
      <section className="flex-1 flex items-center justify-center px-8 py-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-white font-black text-6xl mb-8">
            Our Teams
          </h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <div className="bg-white/10 rounded-2xl p-6">
              <h3 className="text-white text-xl font-bold mb-4">Mechanical Team</h3>
              <p className="text-white/80">Designing and building robust mechanical systems</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-6">
              <h3 className="text-white text-xl font-bold mb-4">Software Team</h3>
              <p className="text-white/80">Developing intelligent control systems and AI</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-6">
              <h3 className="text-white text-xl font-bold mb-4">Electronics Team</h3>
              <p className="text-white/80">Creating advanced electronic circuits and sensors</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}