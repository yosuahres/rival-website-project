import Link from "next/link";
import Carousel from "@/components/crowdfunding/Carousel";
import ProgressBar from "@/components/crowdfunding/ProgressBar";
import { getSiteSettings } from "@/lib/crowdfunding/settings";

// The progress numbers live in public.site_settings and are edited from /admin,
// so this page must not be cached at build time.
export const dynamic = "force-dynamic";

const CAROUSEL_IMAGES = [
  { src: "/assets/carousel-front/slide1.jpg", alt: "Rival slide 1" },
  { src: "/assets/carousel-front/slide2.jpg", alt: "Rival slide 2" },
  { src: "/assets/carousel-front/slide3.jpg", alt: "Rival slide 3" },
  // { src: "/assets/carousel-front/slide4.jpg", alt: "Rival slide 4" },
  { src: "/assets/carousel-front/slide5.jpg", alt: "Rival slide 5" },
];

export default async function CrowdfundingPage() {
  const { current_amount, goal_amount } = await getSiteSettings();

  return (
    <main className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="bg-gradient-to-r from-[#bdb88e] via-[#d4cfb0] to-[#8eac7a] bg-clip-text text-center text-3xl font-extrabold leading-tight tracking-tight text-transparent sm:text-4xl md:text-5xl">
        #ChaseTheDream
      </h1>
      <p className="-mt-8 text-center text-base font-medium text-white/70 sm:text-lg">
        RIVAL ITS Team — Crowdfunding
      </p>

      <ProgressBar current={current_amount} goal={goal_amount} />

      <Link
        href="/crowdfunding/support"
        className="inline-flex items-center justify-center rounded-full bg-[#bdb88e] px-8 py-3 text-lg font-semibold text-[#231f20] shadow-lg transition-all hover:scale-105 hover:bg-[#8eac7a] hover:shadow-xl active:scale-100"
      >
        Support Us
      </Link>

      <Carousel images={CAROUSEL_IMAGES} />

      <h2 className="text-center font-[family-name:var(--font-exo2)] text-3xl font-bold text-white">
        RIVAL ITS TEAM
      </h2>
    </main>
  );
}
