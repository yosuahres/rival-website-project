/**
 * Sponsor logos, in the order they are shown.
 *
 * `width`/`height` are the intrinsic pixel sizes of each file — Next needs them
 * to reserve space. They vary wildly (square marks, wide wordmarks), which is
 * why the wall sizes every logo by a shared HEIGHT and lets the width follow:
 * matching the boxes instead would make a wide wordmark tiny next to a square
 * mark.
 */
export type Partner = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /**
   * Set on very wide wordmarks. At a shared height these run several times
   * wider than a square mark and read as oversized, so the wall renders them
   * a step shorter to even out the visual weight.
   */
  wide?: boolean;
};

/** Two headline sponsors, on the top row. */
export const PARTNERS_LEAD: Partner[] = [
  {
    src: "/images/partners/platinum/andi-sobolangit.png",
    alt: "AndiSobolangit",
    width: 320,
    height: 320,
  },
  {
    src: "/images/partners/platinum/ancuk.png",
    alt: "Triguna",
    width: 320,
    height: 320,
  },
];

/** Single mid-tier sponsor, centred on its own row. */
export const PARTNERS_FEATURE: Partner[] = [
  {
    src: "/images/partners/silver/wika.png",
    alt: "wika",
    width: 320,
    height: 320,
  },
];

/** The remaining sponsors, laid out three to a row. */
export const PARTNERS_SUPPORTING: Partner[] = [
  {
    src: "/images/partners/winner/apd.png",
    alt: "APD",
    width: 240,
    height: 300,
  },
  {
    src: "/images/partners/winner/arl.png",
    alt: "ARL",
    width: 320,
    height: 320,
  },
  {
    src: "/images/partners/winner/gajelas.png",
    alt: "Akhishop",
    width: 800,
    height: 302,
    wide: true,
  },
  {
    src: "/images/partners/bronze/fure.png",
    alt: "Fure",
    width: 320,
    height: 320,
  },
  {
    src: "/images/partners/bronze/graha-pintar.png",
    alt: "GrahaPintar",
    width: 320,
    height: 320,
  },
  {
    src: "/images/partners/bronze/ipbth.png",
    alt: "IPBTH",
    width: 800,
    height: 357,
    wide: true,
  },
];
