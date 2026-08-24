/**
 * The team's competition results, in the order the Hall of Fame shows them.
 *
 * Everything here is KRTMI — Kontes Robot Tematik Indonesia, the Indonesian
 * Thematic Robot Contest — apart from the 2026 Australian Rover Challenge,
 * the team's first international outing. KRTMI runs a regional round and a
 * national final, which is the distinction the `title` line carries.
 *
 * Every entry is rendered inside the same laurel wreath, so the fields are
 * sized for that frame rather than for prose: `rank` is the one glyph that
 * reads from across the room, `title` the award in a word or two, and `event`
 * the line of fine print underneath. Keep each title line under ~9 characters
 * — longer runs past the leaves and crowds the wreath.
 */
/**
 * The medals a record can show in, best first. Ordering the wall is a matter
 * of walking this list, so the sequence here is the sequence on the page.
 */
export const TIER_ORDER = ["gold", "silver", "bronze", "steel"] as const;

export type Tier = (typeof TIER_ORDER)[number];

export type Achievement = {
  /**
   * Placement digit and its ordinal suffix, split because the badge sets them
   * at different sizes: the digit is the badge's largest glyph and the suffix
   * rides above "PLACE" beside it.
   *
   * Left unset for awards that are not a placing — a "Best Design" is not a
   * 1st of anything — in which case the badge drops the whole rank line and
   * gives the title the room instead. Such an entry usually wants a `lead`.
   */
  rank?: { digit: string; ordinal: string };
  /**
   * Small qualifier set above the title, in place of the rank row: the
   * un-ranked counterpart of "1st PLACE". Lets a name like "BEST ROOKIE TEAM"
   * break the way the ranked badges do — a quiet lead-in over the award
   * itself — instead of running as one flat two-line block.
   */
  lead?: string;
  /** Award or category won, already in the caps the badge displays. */
  title: string;
  /** Second title line, for names that will not fit on one. */
  titleLine2?: string;
  /** Competition and year, in the fine print under the title. */
  event: string;
  /**
   * Show this record on its own, beneath the wall, at a fraction of the size.
   *
   * For results that belong on the page without claiming a place in the tier
   * grid — a distant placing at a first outing, say. One flag rather than the
   * page naming the record, so a second such entry needs no further thought.
   */
  solo?: boolean;
  /**
   * Metal to show this record in, overriding the one its placing implies.
   *
   * Only for results the ranking reads wrong. Sixth in the world at the team's
   * first international outing is a headline, not a consolation, so it keeps
   * gold beside the Best Rookie Team award it was won alongside rather than
   * dropping to steel with the also-rans.
   */
  tier?: Tier;
};

const KRTMI = "Indonesian Thematic Robot Contest";

export const ACHIEVEMENTS: readonly Achievement[] = [
  {
    lead: "BEST",
    title: "ROOKIE",
    titleLine2: "TEAM",
    event: "Australian Rover Challenge 2026",
  },

  {
    rank: { digit: "6", ordinal: "th" },
    title: "WORLDWIDE",
    event: "Australian Rover Challenge 2026",
    tier: "gold",
  },

  {
    rank: { digit: "13", ordinal: "th" },
    title: "BEST",
    titleLine2: "RANK",
    event: "European Rover Challenge Remote 2025",
    solo: true,
    // White rather than the steel a 13th would take by default: standing on
    // its own below the wall, it reads as its own thing rather than as the
    // dullest medal in the set.
    tier: "silver",
  },

  {
    rank: { digit: "1", ordinal: "st" },
    title: "NATIONAL",
    event: `${KRTMI} 2024`,
  },

  // "Juara Harapan 1" — the placing directly below third. Shown as 4th, which
  // is how the Indonesian Robot Contest page already renders this same result.
  {
    rank: { digit: "4", ordinal: "th" },
    title: "NATIONAL",
    event: `${KRTMI} 2023`,
  },
  {
    rank: { digit: "2", ordinal: "nd" },
    title: "REGIONAL",
    event: `${KRTMI} 2023`,
  },

  {
    rank: { digit: "1", ordinal: "st" },
    title: "NATIONAL",
    event: `${KRTMI} 2022`,
  },
  {
    rank: { digit: "1", ordinal: "st" },
    title: "REGIONAL",
    event: `${KRTMI} 2022`,
  },
  // The special awards carry their round in the fine print instead of the
  // title line, which they have spent on the award itself.
  {
    lead: "BEST",
    title: "DESIGN",
    event: `${KRTMI}, National 2022`,
  },

  {
    rank: { digit: "1", ordinal: "st" },
    title: "NATIONAL",
    event: `${KRTMI} 2021`,
  },
  {
    rank: { digit: "3", ordinal: "rd" },
    title: "REGIONAL",
    event: `${KRTMI} 2021`,
  },
  {
    lead: "BEST",
    title: "STRATEGY",
    event: `${KRTMI}, National 2021`,
  },
] as const;
