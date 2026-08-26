"use client";
import Image from "next/image";
import { type TranslationKey, useTranslation } from "@/i18n";
import { BLUR_PLACEHOLDERS } from "@/lib/blur-placeholders";

// The roster art is a set of 2828x4000 cut-outs rendered into circles no
// wider than 256px, so `sizes` is what stops next/image handing the browser
// a multi-megabyte original for a thumbnail. Without it `fill` assumes the
// image spans the viewport and picks the largest variant it has.
const AVATAR_SIZES = "(min-width: 640px) 256px, 144px";

/**
 * The groups the roster is walked in, and the order they appear on the page.
 *
 * The id is what the section anchor and the member records are keyed on, so it
 * stays put whichever language is showing; the heading beside it is looked up.
 */
const ROLES = [
  { id: "advisor", label: "teams.role.advisor" },
  { id: "leader", label: "teams.role.leader" },
  { id: "electrical", label: "teams.role.electrical" },
  { id: "mechanical", label: "teams.role.mechanical" },
  { id: "programming", label: "teams.role.programming" },
  { id: "nonTech", label: "teams.role.nonTech" },
] as const satisfies readonly { id: string; label: TranslationKey }[];

type RoleId = (typeof ROLES)[number]["id"];

/**
 * A member's standing within their division. The advisor and the team leader
 * head the whole team rather than a division, so they carry their own titles;
 * everyone else's reads as a rank applied to a division name.
 */
type Rank = "advisor" | "teamLeader" | "leader" | "expert" | "staff";

/** The division name each rank is phrased against. */
const DIVISION_KEYS = {
  electrical: "teams.division.electrical",
  mechanical: "teams.division.mechanical",
  programming: "teams.division.programming",
  nonTech: "teams.division.nonTech",
} as const satisfies Partial<Record<RoleId, TranslationKey>>;

const RANK_KEYS = {
  advisor: "teams.position.advisor",
  teamLeader: "teams.position.teamLeader",
  leader: "teams.position.leader",
  expert: "teams.position.expert",
  staff: "teams.position.staff",
} as const satisfies Record<Rank, TranslationKey>;

type Member = {
  name: string;
  image: string;
  role: RoleId;
  rank: Rank;
  offset: { x: number; y: number };
};

const TEAM_MEMBERS: Member[] = [
  {
    name: "Moh Ismarintan Zazuli",
    image: "/images/teams/advisor/ismarintan.webp",
    role: "advisor",
    rank: "advisor",
    offset: { x: 0, y: 0 },
  },
  {
    name: "Aditya Dharma Saputra",
    image: "/images/teams/leader/dharma.webp",
    role: "leader",
    rank: "teamLeader",
    offset: { x: 0, y: 15 },
  },
  {
    name: "Mochammad Rifki Al Syawal",
    image: "/images/teams/electrical/syawal.webp",
    role: "electrical",
    rank: "leader",
    offset: { x: 0, y: 15 },
  },
  {
    name: "Valencia Stevie F. H.",
    image: "/images/teams/electrical/tip.webp",
    role: "electrical",
    rank: "expert",
    offset: { x: 20, y: 0 },
  },
  {
    name: "Melyana Putri Tiyarno",
    image: "/images/teams/electrical/melyana.webp",
    role: "electrical",
    rank: "expert",
    offset: { x: -20, y: 0 },
  },
  {
    name: "Evan Javier Firdausi Malik",
    image: "/images/teams/electrical/evan.webp",
    role: "electrical",
    rank: "expert",
    offset: { x: -20, y: 0 },
  },
  {
    name: "Ademas Fazri Sunaryo",
    image: "/images/teams/electrical/ademas.webp",
    role: "electrical",
    rank: "expert",
    offset: { x: -10, y: 0 },
  },
  {
    name: "I Ketut Pajar Mahensanjaya",
    image: "/images/teams/electrical/pajar.webp",
    role: "electrical",
    rank: "staff",
    offset: { x: -15, y: 20 },
  },
  {
    name: "Ahmad Kagendra Nouval Arianto",
    image: "/images/teams/electrical/nouval.webp",
    role: "electrical",
    rank: "staff",
    offset: { x: 20, y: 20 },
  },

  {
    name: "Rizal Khoirul Atok",
    image: "/images/teams/mechanical/atok.webp",
    role: "mechanical",
    rank: "leader",
    offset: { x: -10, y: 20 },
  },
  {
    name: "Andreas Agung Servia Pintarta",
    image: "/images/teams/mechanical/andre.webp",
    role: "mechanical",
    rank: "expert",
    offset: { x: 5, y: 10 },
  },
  {
    name: "Muhammad Rizal Hakim",
    image: "/images/teams/mechanical/rizal.webp",
    role: "mechanical",
    rank: "expert",
    offset: { x: -10, y: 0 },
  },
  {
    name: "Naafi' Aziz Salam",
    image: "/images/teams/mechanical/naafi.webp",
    role: "mechanical",
    rank: "staff",
    offset: { x: 0, y: 0 },
  },
  {
    name: "Wisnu Istiawan",
    image: "/images/teams/mechanical/wisnu.webp",
    role: "mechanical",
    rank: "staff",
    offset: { x: -10, y: 25 },
  },
  {
    name: "Rifqi Haikal Zahran",
    image: "/images/teams/mechanical/rifqi.webp",
    role: "mechanical",
    rank: "staff",
    offset: { x: -10, y: 25 },
  },

  {
    name: "Zalfa Nafila Khairunnisa",
    image: "/images/teams/programming/zalfa.webp",
    role: "programming",
    rank: "leader",
    offset: { x: 10, y: 0 },
  },
  {
    name: "Moh. Wildan Risqi Maulidi",
    image: "/images/teams/programming/wildan.webp",
    role: "programming",
    rank: "expert",
    offset: { x: -5, y: 20 },
  },
  {
    name: "Naufal Daffa Alfa Zain",
    image: "/images/teams/programming/naufal.webp",
    role: "programming",
    rank: "expert",
    offset: { x: 15, y: 0 },
  },
  {
    name: "Raditya Zhafran Pranuja",
    image: "/images/teams/programming/radit.webp",
    role: "programming",
    rank: "expert",
    offset: { x: -5, y: 0 },
  },
  {
    name: "Budiman Setiono",
    image: "/images/teams/programming/budi.webp",
    role: "programming",
    rank: "staff",
    offset: { x: -10, y: 0 },
  },
  {
    name: "Narendra Andhi Putra Pratama",
    image: "/images/teams/programming/naren.webp",
    role: "programming",
    rank: "staff",
    offset: { x: 5, y: 10 },
  },

  {
    name: "Karina Maheswari",
    image: "/images/teams/non-tech/kar.webp",
    role: "nonTech",
    rank: "leader",
    offset: { x: 0, y: 0 },
  },
  {
    name: "Oktavian Rifki Danendra",
    image: "/images/teams/non-tech/rifki.webp",
    role: "nonTech",
    rank: "expert",
    offset: { x: -10, y: 0 },
  },
  {
    name: "Alif Gibran",
    image: "/images/teams/non-tech/gib.webp",
    role: "nonTech",
    rank: "expert",
    offset: { x: -10, y: 0 },
  },
  {
    name: "Kaysa Tsana Adilah",
    image: "/images/teams/non-tech/kay.webp",
    role: "nonTech",
    rank: "expert",
    offset: { x: 0, y: 0 },
  },
  {
    name: "Enno Ajeng Larasati",
    image: "/images/teams/non-tech/enno.webp",
    role: "nonTech",
    rank: "staff",
    offset: { x: 0, y: 0 },
  },
  {
    name: "Daffa Ramadhani Nugroho",
    image: "/images/teams/non-tech/dap.webp",
    role: "nonTech",
    rank: "staff",
    offset: { x: 0, y: 0 },
  },
  {
    name: "Dion Hardi Saputra",
    image: "/images/teams/non-tech/dion.webp",
    role: "nonTech",
    rank: "staff",
    offset: { x: 5, y: 0 },
  },
];

export default function Teams() {
  const { t } = useTranslation();

  // "Leader of Electrical" and the like are built from the two halves rather
  // than stored whole, so a locale writes each rank and each division once and
  // can put them in whichever order it reads best.
  const positionOf = (member: Member) => {
    const division = DIVISION_KEYS[member.role as keyof typeof DIVISION_KEYS];
    return division
      ? t(RANK_KEYS[member.rank], { division: t(division) })
      : t(RANK_KEYS[member.rank]);
  };

  return (
    <div className="flex flex-col min-h-full">
      <section className="relative mx-3 md:mx-4 flex aspect-[6/7] items-center justify-center overflow-hidden rounded-4xl md:aspect-auto md:py-96">
        <div className="absolute inset-0 -z-50">
          <Image
            src="/images/teams/hero-background.webp"
            alt={t("teams.heroAlt")}
            fill
            sizes="100vw"
            placeholder="blur"
            blurDataURL={
              BLUR_PLACEHOLDERS["/images/teams/hero-background.webp"]
            }
            className="object-cover object-center grayscale"
            priority
          />
          {/* Keeps the title legible over the brightest part of the photo and
              blends the frame's bottom edge into the black section beneath it. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70"
          />
        </div>

        <div className="w-full relative z-10">
          <div className="w-full">
            <div className="text-center">
              <h1 className="text-white font-black text-5xl md:text-7xl mb-6 sm:mb-8">
                {t("teams.title")}
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="flex-1">
        <div className="w-full">
          <div className="w-full">
            <div className="text-center">
              {ROLES.map((role, index) => {
                const membersInRole = TEAM_MEMBERS.filter(
                  (member) => member.role === role.id,
                );
                return (
                  <div key={role.id}>
                    <div id={role.id} className="mb-8 sm:mb-12">
                      <h2 className="text-white font-bold text-2xl sm:text-4xl mt-8 sm:mt-12 mb-6 sm:mb-8 capitalize text-center">
                        {t(role.label)}
                      </h2>
                      <div
                        className={
                          index === 0 || index === 1
                            ? "flex justify-center gap-3 sm:gap-4 mt-8 sm:mt-12"
                            : "w-full grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-12"
                        }
                      >
                        {membersInRole.length > 0 ? (
                          membersInRole.map((member) => (
                            <div
                              key={member.name}
                              className="flex flex-col items-center"
                            >
                              <div className="w-36 h-36 sm:w-64 sm:h-64 rounded-full overflow-hidden flex items-center justify-center mb-3 sm:mb-4 bg-white/10 relative">
                                <Image
                                  src={member.image}
                                  alt={t("teams.memberAlt", {
                                    name: member.name,
                                  })}
                                  fill
                                  sizes={AVATAR_SIZES}
                                  placeholder="blur"
                                  blurDataURL={BLUR_PLACEHOLDERS[member.image]}
                                  // The advisor and the team leader sit above
                                  // the fold; everything below waits until it
                                  // is scrolled near.
                                  priority={index < 2}
                                  className="object-cover object-center"
                                  style={{
                                    transform: `translate(${member.offset.x}px, ${member.offset.y}px)`,
                                  }}
                                />
                              </div>
                              <p className="text-white font-medium text-base sm:text-xl text-center">
                                {member.name}
                              </p>
                              <p className="text-white/70 text-xs sm:text-base text-center capitalize">
                                {positionOf(member)}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-[#398561] col-span-full">
                            {t("teams.empty", { role: t(role.label) })}
                          </p>
                        )}
                      </div>
                    </div>
                    {index < ROLES.length - 1 && (
                      <svg
                        aria-hidden="true"
                        className="w-full h-16 my-8 sm:my-12 relative z-10"
                        viewBox="0 0 1200 100"
                        preserveAspectRatio="none"
                      >
                        <path
                          d={
                            index === 0
                              ? "M0,50 Q600,-30 1200,50"
                              : "M0,50 Q300,20 600,50 T1200,50"
                          }
                          stroke="white"
                          strokeWidth="4"
                          fill="none"
                        />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
