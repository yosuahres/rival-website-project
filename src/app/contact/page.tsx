import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with RIVAL ITS - reach out for collaborations, partnerships, or to learn more about our robotics projects.",
};

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <section className="flex-1 flex items-center justify-center px-8 py-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-white font-black text-6xl mb-8">
            Contact Us
          </h1>
          <div className="bg-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <p className="text-white text-lg mb-6">
              Ready to collaborate or learn more about our robotics innovations?
            </p>
            <div className="space-y-4 text-white">
              <div>
                <strong>Email:</strong> contact@rival-its.org
              </div>
              <div>
                <strong>Location:</strong> Institut Teknologi Sepuluh Nopember, Surabaya
              </div>
              <div>
                <strong>Follow us:</strong> @rival_its
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}