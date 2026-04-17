"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const newsData = [
  {
    id: 1,
    title: "ITS Kembali Rebut Kali Keenam Gelar Juara Umum KRI 2024",
    source: "ITS News",
    date: "2024",
    description:
      "Pertegas kehebatannya di bidang robotika, Institut Teknologi Sepuluh Nopember (ITS) kembali berjaya dengan membawa pulang gelar Juara Umum untuk kali keenam pada ajang Kontes Robot Indonesia (KRI) 2024.",
    link: "https://share.google/M0yHCGKkA072weOaZ",
    image: "/news/its-kri.jpg",
  },
  {
    id: 2,
    title: "Tim Rival ITS Raih Best Rookie Team di Australia",
    source: "tempo.co",
    date: "2026",
    description:
      "RIVAL ITS team from Institut Teknologi Sepuluh Nopember (ITS) achieved the prestigious Best Rookie Team award at the Australian Rover Challenge.",
    link: "https://share.google/OQUUIVQCaTW0vqb0N",
    image: "/news/tempo.jpg",
  },
  {
    id: 3,
    title: "Debut Internasional, Tim RIVAL ITS Raih Best Rookie Team",
    source: "ITS News",
    date: "2026",
    description:
      "RIVAL ITS continues to represent Institut Teknologi Sepuluh Nopember with distinction in robotics competitions and international platforms.",
    link: "https://share.google/0lUcd9oB65gW3Er26",
    image: "/news/its.jpeg",
  },
];

export default function News() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#021507]">
      {/* News Cards Section */}
      <div className="pt-32 pb-20 px-8 md:px-16 lg:px-32">
        <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsData.map((news) => (
            <div
              key={news.id}
              className="flex flex-col items-center text-center"
            >
              {/* Image */}
              <div
                className="w-full h-48 bg-cover bg-center mb-6 rounded"
                style={{
                  backgroundImage: `url('${news.image}')`,
                }}
              />

              {/* Date and Source */}
              <p className="text-gray-400 text-sm font-mono mb-4">
                {news.source} • {news.date}
              </p>

              {/* Headline */}
              <h3 className="text-white text-2xl font-bold leading-tight mb-4 text-red-500 font-serif">
                {news.title}
              </h3>

              {/* Description */}
              <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3">
                {news.description}
              </p>

              {/* Read More */}
              <Link
                href={news.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-500 hover:text-red-400 font-semibold text-sm underline transition-colors"
              >
                Read More
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
