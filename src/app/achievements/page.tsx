"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import FadeIn from "@/components/FadeIn";
import { useTranslation } from "@/i18n";
import {
  ACHIEVEMENTS,
  type Achievement,
  TIER_ORDER,
  type Tier,
} from "@/lib/achievements";

/**
 * The medal tiers, in the order the wall shows them.
 *
 * A tier is two inks plus a recoloured copy of the one wreath. The variants
 * are flat fills of the source artwork keeping its alpha, so all four carry
 * identical geometry — the opening measurements the layout depends on hold
 * whichever metal is showing.
 */
const TIERS: Record<Tier, { ink: string; inkMuted: string }> = {
  gold: { ink: "#EDB63C", inkMuted: "#D9A441" },
  silver: { ink: "#E9ECEE", inkMuted: "#BFC4C9" },
  bronze: { ink: "#C89258", inkMuted: "#A5713F" },
  steel: { ink: "#A6ABB0", inkMuted: "#878C91" },
};

/**
 * Which metal a record earns.
 *
 * Derived rather than stored: the placing already says it. A win and a named
 * award ("Best Design") both take gold — an award of that kind is a first of
 * its category, and reads as one on the wall. Anything below third falls to
 * steel. A record may set `tier` itself to overrule this, for the results the
 * bare ranking misreads.
 */
function tierOf({ rank, lead, tier }: Achievement): Tier {
  if (tier) return tier;
  if (lead || rank?.digit === "1") return "gold";
  if (rank?.digit === "2") return "silver";
  if (rank?.digit === "3") return "bronze";
  return "steel";
}

/**
 * Records grouped by metal, gold first.
 *
 * The sort is stable, so within a tier the order is whatever
 * `lib/achievements` authored — currently newest first. That keeps the two
 * orderings separate: the tier decides the row, the data file decides the
 * sequence inside it, and a new record needs no thought about placement.
 */
const BY_TIER = [...ACHIEVEMENTS].sort(
  (a, b) => TIER_ORDER.indexOf(tierOf(a)) - TIER_ORDER.indexOf(tierOf(b)),
);

/**
 * The wall, and the records that hang solo beneath it.
 *
 * Splitting on the flag rather than naming the record means a second such
 * entry needs no further thought. A solo record keeps its tier for colour, but
 * being outside the grid its tier no longer decides where it sits.
 */
const WALL = BY_TIER.filter((a) => !a.solo);
const SOLO = BY_TIER.filter((a) => a.solo);

/**
 * The indent that centres a short last row.
 *
 * The wall is laid on a track of twice as many columns as it shows cards,
 * every card spanning two of them. Spanned that way a card measures exactly
 * what it would in the plain track — the half-columns fall inside the cards,
 * not between them — so nothing about a full row changes. What the finer track
 * buys is the half-card step, which is precisely the indent a row one card
 * short of full needs to sit centred: each missing card pushes the row half a
 * card to the right, and a half card is one sub-column plus one gutter.
 *
 * So the offset is read off the remainder, per breakpoint, and lands on the
 * card that opens the last row. It is `col-start`, which only the opening card
 * needs — the rest of the row flows on behind it.
 */
function lastRowOffset(index: number): string {
  const classes: string[] = [];

  // Two-up: at most one card can be left over, and it wants half a card of
  // indent — one step of the four-column track.
  const opensTwoUp = WALL.length % 2 === 1 && index === WALL.length - 1;
  if (opensTwoUp) classes.push("md:col-start-2");

  // Three-up: one card over wants a full card of indent (two steps), two
  // cards over want half of one (a single step).
  const overflow = WALL.length % 3;
  const opensThreeUp = overflow > 0 && index === WALL.length - overflow;
  if (opensThreeUp) {
    classes.push(overflow === 1 ? "lg:col-start-3" : "lg:col-start-2");
  } else if (opensTwoUp) {
    // The two rows come up short in different places, so the card that opens
    // the short row at two-up need not be the one that opens it at three-up.
    // When it isn't, its `md` indent has to be lifted again: left standing it
    // would drag a card that should flow on mid-row back to a column already
    // behind it, and the grid answers that by breaking the row.
    classes.push("lg:col-start-auto");
  }

  return classes.join(" ");
}

/**
 * The two wreaths, and where each one's opening will take a line of type.
 *
 * The wreath now carries the placing and nothing else — a single short row —
 * so what matters per frame is only where the opening is widest and how large
 * that row can be set before the leaves close in.
 *
 * The wall wears the regular laurel: wider than it is tall, closed at the
 * foot, its channel around 0.74 of the width through the middle. The olive is
 * for records set apart — taller than wide, crown open, stems crossing high,
 * so its opening is broadest above centre and shut by 0.65 of the height.
 *
 * Sizes are `cqw`, percent of the *wreath's* own width, the wreath box being
 * declared a query container of its own. The drawing is therefore rigid: the
 * card can grow or shrink and wreath and lettering move together.
 */
const FRAMES = {
  laurel: {
    art: (tier: Tier) => `/images/achievements/wreath-${tier}.png`,
    width: 544,
    height: 431,
    aspect: "aspect-[544/431]",
    top: "top-[43%]",
    digit: "text-[24cqw]",
    ordinal: "text-[9cqw]",
    place: "text-[7cqw]",
    lead: "text-[13cqw]",
  },
  olive: {
    art: (tier: Tier) => `/images/achievements/olive-${tier}.png`,
    width: 556,
    height: 591,
    aspect: "aspect-[556/591]",
    // Above centre: the crown narrows again higher than the widest point, and
    // the tall digits are what would catch there.
    top: "top-[40%]",
    digit: "text-[22cqw]",
    ordinal: "text-[8cqw]",
    place: "text-[6.5cqw]",
    lead: "text-[12cqw]",
  },
} as const;

/**
 * One record: the wreath, and the plaque running out of it.
 *
 * The wreath holds the placing alone — "1st PLACE", or for an award that is
 * not a placing the quiet lead word it was given instead ("BEST"). Everything
 * that names the result — the category and the competition — sits on a
 * rectangle beside it, slid under the leaves by a negative margin so it reads
 * as stretching out of the wreath rather than as a second object parked next
 * to it. The wreath is painted after, and lifted, so the leaves stay on top of
 * the rectangle's hidden left end.
 *
 * Two nested query containers do the sizing. The card is one, so the plaque's
 * type tracks the column width; the wreath box is another, so everything
 * inside the leaves tracks the wreath instead and can never drift into them
 * when the columns change. Neither needs re-tuning per breakpoint.
 *
 * The tier's two inks arrive as custom properties rather than classes, since
 * Tailwind cannot build an arbitrary value out of a runtime string.
 */
function AchievementBadge({
  record,
  className = "",
}: {
  record: Achievement;
  className?: string;
}) {
  const { t } = useTranslation();
  const { rank, lead, title, titleLine2, event } = record;
  const tier = tierOf(record);
  const { ink, inkMuted } = TIERS[tier];
  // Only the records set apart wear the olive; the wall keeps the laurel.
  const f = FRAMES[record.solo ? "olive" : "laurel"];

  return (
    <li
      className={`flex items-center opacity-100 transition-opacity duration-300 hover:opacity-60 ${className}`}
      style={
        {
          // Declared inline rather than with Tailwind's `@container`, so the
          // cqw units below cannot be broken by a utility rename.
          containerType: "inline-size",
          "--ink": ink,
          "--ink-muted": inkMuted,
        } as CSSProperties
      }
    >
      <div
        className={`relative z-10 w-[44%] shrink-0 ${f.aspect}`}
        style={{ containerType: "inline-size" } as CSSProperties}
      >
        <Image
          src={f.art(tier)}
          alt=""
          aria-hidden="true"
          width={f.width}
          height={f.height}
          sizes="200px"
          className="pointer-events-none absolute inset-0 h-full w-full scale-90 select-none object-contain"
        />

        <div
          className={`-translate-x-1/2 -translate-y-1/2 absolute left-1/2 w-[74%] text-center text-[color:var(--ink)] ${f.top}`}
        >
          {rank && (
            <div className="flex items-end justify-center gap-[0.06em] leading-none">
              <span
                className={`font-extrabold leading-[0.8] tracking-tight ${f.digit}`}
              >
                {rank.digit}
              </span>
              {/* Suffix and "PLACE" share a column against the digit's right
                  flank, both riding its lower half. Leading is pulled under 1em
                  on each: neither word has a descender, so a full line box just
                  banks slack between the two and reads as a gap. What little
                  separation the pair needs is then set deliberately. */}
              <span className="flex flex-col items-start gap-[0.8cqw]">
                <span className={`font-extrabold leading-[0.72] ${f.ordinal}`}>
                  {rank.ordinal}
                </span>
                <span
                  className={`font-extrabold leading-[0.85] tracking-[0.02em] ${f.place}`}
                >
                  {t("achievements.place")}
                </span>
              </span>
            </div>
          )}

          {/* Not a placing: the lead word stands in the same slot, at a size
              that fills the opening the rank row would have. */}
          {!rank && lead && (
            <p className={`font-extrabold uppercase leading-[0.9] ${f.lead}`}>
              {lead}
            </p>
          )}
        </div>
      </div>

      {/* The plaque. Its left end runs under the wreath — hence the negative
          margin and the matching left padding, which puts the type clear of
          the leaves again. The overlap is kept small on purpose: the wreath's
          opening is transparent, so a deeper tuck would show the rectangle
          through the middle of the leaves, behind the placing. Ending under
          the right arm instead hides the corner in foliage. */}
      <div className="-ml-[7%] min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.05] py-[4cqw] pr-[5cqw] pl-[12cqw]">
        <p className="font-extrabold text-[5.2cqw] text-[color:var(--ink)] uppercase leading-[1.1]">
          {/* An award that spent its lead word inside the wreath is named by
              the title alone here; a ranked record's two title lines run on
              as one phrase, there being width for it beside the wreath. */}
          {title}
          {titleLine2 && ` ${titleLine2}`}
        </p>
        <p className="mt-[1.6cqw] text-[3.3cqw] text-white/60 leading-[1.35]">
          {event}
        </p>
      </div>
    </li>
  );
}

export default function Achievements() {
  const { t } = useTranslation();

  return (
    <>
      {/* Hero: same construction as the partners page — a photograph drained
          of colour, with the title centred on it as plain white type. The
          metals below are then the only saturated thing on the page. */}
      <section className="relative mx-3 md:mx-4 aspect-[6/7] md:aspect-auto md:min-h-[700px] flex items-center justify-center overflow-hidden rounded-4xl">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/achievements/hero-background.webp"
            alt={t("achievements.heroAlt")}
            width={1920}
            height={1080}
            priority
            className="w-full h-full object-cover grayscale"
          />
          {/* Keeps the title legible over the brightest part of the photo and
              blends the frame's bottom edge into the black section beneath it. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70"
          ></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
            {t("achievements.title")}
          </h1>
        </div>
      </section>

      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-[1800px]">
          <FadeIn>
            {/* Three across from `lg` up, two at `md`, one on phones — though
                the track is written at six and four, each card spanning two, so
                a last row that comes up short can be centred on the half-card
                step that buys (see `lastRowOffset`). A grid rather than the
                wrapping flex the stacked badges used: these cards are wide, and
                a row of them wants its plaques starting on the same vertical
                line, which equal columns give and a centred flex row does not.

                The cap is what fixes the card size, the column count following
                from it — three columns of 1240px less the gutters is about
                390px a card, so the wreath lands near 170px and the plaque
                gets the rest. Below `md` a single column is right: at two-up on
                a phone the plaque would be narrower than the words on it. */}
            <ul className="mx-auto grid max-w-[1240px] grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-y-10 lg:grid-cols-6">
              {WALL.map((achievement, index) => (
                <AchievementBadge
                  key={`${achievement.title}-${achievement.event}`}
                  record={achievement}
                  className={`md:col-span-2 ${lastRowOffset(index)}`}
                />
              ))}
            </ul>

            {SOLO.length > 0 && (
              /* One column's width rather than the row's: this badge is meant
                 to read as a footnote to the wall, so it holds the same size a
                 wall card has whatever the viewport does. */
              <ul className="mx-auto mt-14 grid max-w-[390px] grid-cols-1 gap-y-8 md:mt-20">
                {SOLO.map((achievement) => (
                  <AchievementBadge
                    key={`${achievement.title}-${achievement.event}`}
                    record={achievement}
                  />
                ))}
              </ul>
            )}
          </FadeIn>
        </div>
      </section>
    </>
  );
}
