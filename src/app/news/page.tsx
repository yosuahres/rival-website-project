"use client";
import Link from "next/link";
import { useTranslation } from "@/i18n";
import { withBasePath } from "@/lib/base-path";

const newsData = [
  {
    id: 1,
    title: "ITS Kembali Rebut Kali Keenam Gelar Juara Umum KRI 2024",
    source: "ITS News",
    date: "2024",
    description:
      "Pertegas kehebatannya di bidang robotika, Institut Teknologi Sepuluh Nopember (ITS) kembali berjaya dengan membawa pulang gelar Juara Umum untuk kali keenam pada ajang Kontes Robot Indonesia (KRI) 2024.",
    link: "https://share.google/M0yHCGKkA072weOaZ",
    image: "/images/news/its-kri.jpg",
  },
  {
    id: 2,
    title: "Tim Rival ITS Raih Best Rookie Team di Australia",
    source: "tempo.co",
    date: "2026",
    description:
      "RIVAL ITS team from Institut Teknologi Sepuluh Nopember (ITS) achieved the prestigious Best Rookie Team award at the Australian Rover Challenge.",
    link: "https://share.google/OQUUIVQCaTW0vqb0N",
    image: "/images/news/tempo.jpg",
  },
  {
    id: 3,
    title: "Debut Internasional, Tim RIVAL ITS Raih Best Rookie Team",
    source: "ITS News",
    date: "2026",
    description:
      "RIVAL ITS continues to represent Institut Teknologi Sepuluh Nopember with distinction in robotics competitions and international platforms.",
    link: "https://share.google/0lUcd9oB65gW3Er26",
    image: "/images/news/its.jpeg",
  },
];

// A small right-pointing chevron that nudges forward on hover, mirroring the
// "Learn more ›" affordance used across the site's link rows.
function Arrow() {
  return (
    <svg
      className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function MetaRow({ source, date }: { source: string; date: string }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400">
      <span>{date}</span>
      <span>{source}</span>
      <span className="flex items-center gap-2 text-gray-200 group-hover:text-white transition-colors">
        {t("common.learnMore")}
        <Arrow />
      </span>
    </div>
  );
}

export default function News() {
  const { t } = useTranslation();

  // The newest item anchors the page as the large left-hand feature; everything
  // else stacks in the compact right-hand rail.
  const [featured, ...rest] = newsData;

  return (
    <div className="min-h-screen bg-transparent">
      <div className="pt-16 pb-24 px-8 md:px-16 lg:px-32">
        {/* Page header */}
        <header className="mb-16 lg:mb-20">
          <h1 className="text-white text-4xl md:text-5xl font-medium tracking-tight">
            {t("news.title")}
          </h1>
          {/* The break is explicit so the subtitle always sets as two lines on
              wide screens instead of wrapping into three. */}
          <p className="mt-2 text-3xl md:text-4xl lg:text-5xl font-light leading-tight text-gray-400 max-w-5xl">
            {t("news.subtitleLine1")}
            <br className="hidden md:inline" /> {t("news.subtitleLine2")}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-16">
          {/* Featured story */}
          {/* The negative margin cancels the card padding, so the resting
              headline still lines up with the page header; only the hovered
              card grows outward. */}
          <Link
            href={featured.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-3xl p-6 -m-6 ring-1 ring-transparent transition duration-300 hover:bg-white/[0.04] hover:ring-white/15"
          >
            <h2 className="text-white text-3xl md:text-4xl lg:text-[2.75rem] font-medium leading-tight tracking-tight">
              {featured.title}
            </h2>

            <div className="mt-6">
              <MetaRow source={featured.source} date={featured.date} />
            </div>

            <div
              className="mt-8 w-full aspect-[4/5] bg-cover bg-center rounded-2xl"
              style={{
                backgroundImage: `url('${withBasePath(featured.image)}')`,
              }}
              role="img"
              aria-label={featured.title}
            />
          </Link>

          {/* Remaining stories */}
          <div className="flex flex-col">
            {rest.map((news, index) => (
              <Link
                key={news.id}
                href={news.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-start justify-between gap-6 py-8 ${
                  index === 0 ? "lg:pt-0" : "border-t border-white/10"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-white text-xl md:text-2xl font-medium leading-snug tracking-tight group-hover:text-red-500 transition-colors">
                    {news.title}
                  </h3>
                  <div className="mt-5">
                    <MetaRow source={news.source} date={news.date} />
                  </div>
                </div>

                <div
                  className="shrink-0 w-28 h-28 md:w-44 md:h-44 bg-cover bg-center rounded-2xl"
                  style={{
                    backgroundImage: `url('${withBasePath(news.image)}')`,
                  }}
                  role="img"
                  aria-label={news.title}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
