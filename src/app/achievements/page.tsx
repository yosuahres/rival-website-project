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
 * The two wreaths, and the proportions each one's opening allows.
 *
 * The wall wears the regular laurel: wider than it is tall, closed at the
 * foot, with a clear channel around 0.74 of its width through the middle — so
 * a record sits wholly inside it, competition line and all.
 *
 * The olive is for records set apart. It is taller than wide, its crown open
 * and its stems crossing high, which leaves a broad opening up top (0.82 of
 * the width) but nothing usable below 0.65 — so its caption hangs beneath the
 * leaves instead, and "PLACE" comes off the ordinal, the title naming the
 * placing itself.
 *
 * Sizes are `cqw`, percent of the badge's own width, so each badge is one
 * rigid drawing: change its width and wreath and lettering move together.
 * Both sets were checked against the artwork's alpha and hold at any size —
 * the laurel with 0.12 of the badge's width to spare at its tightest, the
 * olive with 0.35.
 */
const FRAMES = {
  laurel: {
    art: (tier: Tier) => `/images/achievements/wreath-${tier}.png`,
    width: 544,
    height: 431,
    aspect: "aspect-[544/431]",
    top: "top-[40%]",
    captionBelow: false,
    digit: "text-[16cqw]",
    ordinal: "text-[6cqw]",
    place: "text-[4.7cqw]",
    lead: "text-[8cqw]",
    title: "text-[8cqw]",
    leadTitle: (long: boolean) => (long ? "text-[8cqw]" : "text-[10cqw]"),
    subtitle: "",
    event: "text-[5cqw]",
  },
  olive: {
    art: (tier: Tier) => `/images/achievements/olive-${tier}.png`,
    width: 556,
    height: 591,
    aspect: "aspect-[556/591]",
    // Above centre: the crown narrows again higher than the widest point, and
    // the tall digits are what would catch there.
    top: "top-[36%]",
    captionBelow: true,
    digit: "text-[15cqw]",
    ordinal: "text-[5.5cqw]",
    place: "",
    lead: "text-[7.5cqw]",
    title: "text-[9cqw]",
    leadTitle: (long: boolean) => (long ? "text-[7.5cqw]" : "text-[9cqw]"),
    subtitle: "text-[6.5cqw]",
    event: "text-[7cqw]",
  },
} as const;

/**
 * Type size for the title of a `lead` badge.
 *
 * Such a badge has spent its first line on the quiet word, so the award itself
 * steps up — the ranked badges reach that weight through the rank row instead.
 * How far it can step up is a question of length: "ROOKIE" clears the leaves
 * at the larger size and "STRATEGY" does not.
 */
function leadTitleSize(
  f: (typeof FRAMES)[keyof typeof FRAMES],
  title: string,
  titleLine2?: string,
): string {
  const longest = Math.max(title.length, titleLine2?.length ?? 0);
  return f.leadTitle(longest > 6);
}

/**
 * One wreath badge.
 *
 * Every measurement inside is in `cqw` — percent of the badge's own width —
 * with the badge declared as the query container. The whole thing is therefore
 * one rigid drawing: change its width and the wreath and every line of type
 * move together at a fixed ratio. Nothing needs re-tuning per breakpoint, and
 * the leaves can never close in on lettering that stayed put.
 *
 * The proportions come from the artwork, whose opening was measured off its
 * alpha: widest a fifth of the way down (0.82 of the width), still 0.75 at the
 * waist, but shut by 0.65 where the stems cross. So the text block sits above
 * centre at 36% — the crown narrows again higher than that, and the tall
 * digits are what would catch — and the competition line goes *below* the
 * wreath, there being no room for it inside. At these sizes the widest line
 * ("WORLDWIDE") leaves 0.14 of the badge's width to spare.
 *
 * The tier's two inks arrive as custom properties rather than classes, since
 * Tailwind cannot build an arbitrary value out of a runtime string.
 */
function AchievementBadge({
  record,
  className,
}: {
  record: Achievement;
  className: string;
}) {
  const { t } = useTranslation();
  const { rank, lead, title, titleLine2, event } = record;
  const tier = tierOf(record);
  const { ink, inkMuted } = TIERS[tier];
  // Only the records set apart wear the olive; the wall keeps the laurel.
  const f = FRAMES[record.solo ? "olive" : "laurel"];

  const caption = (
    <p className={`text-[color:var(--ink-muted)] leading-[1.35] ${f.event}`}>
      {event}
    </p>
  );

  return (
    <li
      className={`flex flex-col items-center opacity-100 transition-opacity duration-300 hover:opacity-60 ${className}`}
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
      <div className={`relative w-full ${f.aspect}`}>
        <Image
          src={f.art(tier)}
          alt=""
          aria-hidden="true"
          width={f.width}
          height={f.height}
          sizes="240px"
          className="pointer-events-none absolute inset-0 h-full w-full scale-90 select-none object-contain"
        />

        <div
          className={`-translate-x-1/2 -translate-y-1/2 absolute left-1/2 w-[62%] text-center text-[color:var(--ink)] ${f.top}`}
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
                  separation the pair needs is then set deliberately.

                  An olive badge drops "PLACE" — its title names the placing
                  ("BEST / RANK"), so the word would only repeat it. */}
              <span className="flex flex-col items-start gap-[0.5cqw]">
                <span className={`font-extrabold leading-[0.72] ${f.ordinal}`}>
                  {rank.ordinal}
                </span>
                {!f.captionBelow && (
                  <span
                    className={`font-extrabold leading-[0.85] tracking-[0.02em] ${f.place}`}
                  >
                    {t("achievements.place")}
                  </span>
                )}
              </span>
            </div>
          )}

          {lead && (
            <p className={`font-extrabold uppercase leading-[0.9] ${f.lead}`}>
              {lead}
            </p>
          )}

          {/* On an olive badge the two title lines are a pair rather than one
              wrapped name — "BEST" states it, "RANK" qualifies — so the second
              line steps down instead of matching. */}
          <p
            className={`font-extrabold uppercase leading-[1.05] ${
              lead
                ? `mt-[1.5cqw] ${leadTitleSize(f, title, titleLine2)}`
                : f.title
            } ${rank ? "mt-[2cqw]" : ""}`}
          >
            {title}
            {titleLine2 &&
              (f.subtitle ? (
                <span className={`block leading-[1.15] ${f.subtitle}`}>
                  {titleLine2}
                </span>
              ) : (
                <>
                  <br />
                  {titleLine2}
                </>
              ))}
          </p>

          {!f.captionBelow && (
            <div className="mx-auto mt-[2cqw] w-[86%]">{caption}</div>
          )}
        </div>
      </div>

      {/* Outside the wreath box, so it inherits none of the centring that
          holds the lettering inside the leaves — it has to say so itself. */}
      {f.captionBelow && (
        <div className="mt-[3cqw] px-1 text-center">{caption}</div>
      )}
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
            {/* Four across from `lg` up, two below that — phones included.
                Wrapping flex rather than a grid so a part-full last row
                centres under the ones above it — eleven badges four-up would
                otherwise leave the last three hanging off to the left.

                The row is capped well short of the page: four columns of a
                full-width container would make each badge 400px-odd, and these
                are meant to read small. The cap is what fixes their size, the
                column count following from it — with `gap-x-10` throughout, a
                badge is 25% of 980px less its 30px share of the gutters, about
                215px.

                Four-up waits for `lg` rather than `md` because the cap has not
                bound yet at `md`: the container is the viewport there, so four
                columns would give 150px badges and a 6px competition line.

                Phones stay two-up as well: a badge is its own query container,
                so at roughly 155px on a 375px screen the wreath and its
                lettering shrink together and the pair still reads — and two
                columns keep the wall looking like a wall rather than a
                single-file list eleven screens long. */}
            <ul className="mx-auto flex max-w-[1360px] flex-wrap justify-center gap-x-8 gap-y-10 md:gap-y-12">
              {WALL.map((achievement) => (
                <AchievementBadge
                  key={`${achievement.title}-${achievement.event}`}
                  record={achievement}
                  className="w-[calc(50%-16px)] lg:w-[calc(25%-24px)]"
                />
              ))}
            </ul>

            {SOLO.length > 0 && (
              /* Fixed width rather than a share of the row: this badge is
                 meant to read as a footnote to the wall, so it holds the same
                 modest size whatever the viewport does. */
              <ul className="mt-14 flex flex-wrap justify-center gap-x-10 gap-y-8 md:mt-20">
                {SOLO.map((achievement) => (
                  <AchievementBadge
                    key={`${achievement.title}-${achievement.event}`}
                    record={achievement}
                    className="w-[190px]"
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
