"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import DotImage from "@/components/DotImage";
import { INDEXABLE_ROUTES } from "@/lib/routes";

/**
 * The assembly drawings that carry a transparent background, which is what the
 * stipple needs — alpha is what tells it where the hardware is. The rest of the
 * archive is scene renders on opaque ground, and would stipple as a filled
 * rectangle.
 */
const PIECES = [
  "/archive/images/rover1.webp",
  "/archive/images/arm2.webp",
  "/archive/images/assemblykosong.webp",
  "/archive/images/wheel-drive.webp",
  "/archive/images/arm1.webp",
  "/archive/images/rover5.webp",
] as const;

/** Narrower than this and there is no room for anything at all. */
const MIN_WIDTH = 340;
/**
 * Below this the page stops having two halves worth speaking of: the content
 * runs the full width, so there is nowhere for a piece to sit that is not
 * behind the reading. Narrow pages carry the footer piece alone, drawn wide
 * enough to be worth seeing.
 */
const NARROW = 768;
/**
 * How much of the width the footer piece takes on a narrow page. Well short of
 * the full width: at phone size the footer is shallow and the piece has copy
 * either side of it, so it reads as a mark in the corner rather than a wash
 * behind the whole thing.
 */
const NARROW_RATIO = 0.62;
/**
 * Pages that carry nothing but the footer piece. The partners page is a wall of
 * sponsor marks from top to bottom, and a second set of artwork behind them
 * competes with the logos it is meant to sit under — but the footer is the same
 * on every page, so it keeps the one that belongs to the site rather than to
 * the page.
 */
const FOOTER_ONLY: readonly string[] = ["/partners"];

/** A band shorter than this cannot hold anything, whatever the window. */
const MIN_BAND = 260;
/** Clearance kept between a piece and whatever bounds its band. */
const CLEARANCE = 16;
/** How much of its half a piece takes, and the widest it ever gets. */
const SIZE_RATIO = 0.98;
const MAX_SIZE = 1240;
/** Ceiling on a piece's height, as a share of the window. */
const MAX_HEIGHT_RATIO = 0.9;
/**
 * How far a piece may exceed the band it sits in. The drawing is fitted by
 * height, so the depth of the gap is what caps its size — and the gaps between
 * sections are shallow. Letting it run past the band draws it far larger, and
 * the sections above and below paint over the excess in the page's own colour,
 * so what shows through the gap is a big machine rather than a small whole one.
 */
const OVERFLOW = 1.6;
/**
 * The tallest a box may be relative to its width. Measured, the artwork inside
 * these files runs from 0.86 to 1.51 wide-to-tall, so a box kept wider than all
 * of them makes height the binding constraint when the artwork is fitted, which
 * is what keeps the pieces reading as one size whichever drawing turns up.
 * Width and height are otherwise set independently: tying the two together is
 * what used to hold the drawings down to a third of the space they had.
 */
const BOX_ASPECT = 1.15;
/**
 * How far a piece may be scaled down to fit a band that is nearly, but not
 * quite, deep enough for the standard box. Without this the shallower gaps —
 * a centred block of copy between two sections, say — go empty for the sake of
 * a few dozen pixels.
 */
const MIN_SCALE = 0.55;
/**
 * The drawing every page carries in its footer, and the side it sits on. The
 * footer paints nothing, so this one always lands: it is what guarantees a page
 * has a piece on it even when the body above is packed edge to edge with cards.
 * Fixed rather than rotated, so it reads as part of the furniture of the site.
 */
const FOOTER_PIECE = PIECES.indexOf("/archive/images/rover1.webp");
const FOOTER_SIDE: Side = "right";
/**
 * How far into the footer the piece centres. Set above the middle so a box
 * taller than the footer leans up into the quiet end of the page rather than
 * down across the columns of links.
 */
const FOOTER_ANCHOR = 0.25;
/** A little more clearance on top of that anchor, in pixels. */
const FOOTER_LIFT = 50;
/** Roughly how many pieces a screenful of scrolling should turn up. */
const PER_SCREEN = 3;
/** Every piece is a canvas full of dots, so the page gets a budget. */
const MAX_PIECES = 10;

type Side = "left" | "right";
type Band = { from: number; to: number };
type Slot = {
  top: number;
  width: number;
  height: number;
  side: Side;
  /** Set where the drawing is fixed rather than taken from the rotation. */
  piece?: number;
  mirrored?: boolean;
  /** Faced the other way, for a band that asked for it. */
  flipped?: boolean;
};

/**
 * Does this element paint over what is behind it?
 *
 * Anything that does owns the band of page it covers, and a stipple hidden
 * behind it is a stipple nobody sees. Fixed elements are exempt: the splash
 * screen and the mobile menu pass over the whole page without belonging to any
 * part of it.
 */
function paints(element: Element) {
  if (
    element instanceof HTMLImageElement ||
    element instanceof HTMLVideoElement ||
    element instanceof HTMLCanvasElement ||
    element instanceof SVGElement
  ) {
    return true;
  }

  const style = getComputedStyle(element);
  if (style.position === "fixed") return false;
  if (style.visibility === "hidden" || style.opacity === "0") return false;
  if (style.backgroundImage !== "none") return true;

  const values = style.backgroundColor.match(/\(([^)]+)\)/)?.[1];
  if (!values) return false;
  const parts = values.split(",").map((part) => Number.parseFloat(part));
  return (parts[3] ?? 1) > 0.05;
}

/** The stretches of a side left over once the painted spans are merged. */
function freeBands(spans: Band[], pageHeight: number): Band[] {
  const sorted = [...spans].sort((a, b) => a.from - b.from);
  const merged: Band[] = [];
  for (const span of sorted) {
    const last = merged.at(-1);
    if (last && span.from <= last.to) last.to = Math.max(last.to, span.to);
    else merged.push({ ...span });
  }

  const bands: Band[] = [];
  let cursor = 0;
  for (const span of merged) {
    if (span.from - cursor >= MIN_BAND) {
      bands.push({ from: cursor, to: span.from });
    }
    cursor = Math.max(cursor, span.to);
  }
  if (pageHeight - cursor >= MIN_BAND) {
    bands.push({ from: cursor, to: pageHeight });
  }
  return bands;
}

/**
 * Walks the page looking for stretches of the left and right margin that
 * nothing paints over, and lays pieces down the ones it finds.
 *
 * This is measured rather than guessed because the pages do not agree with each
 * other: some open on a full-bleed hero, some run a solid-backed section
 * straight across, and either will swallow a piece whole. Reading the rendered
 * page is the only way to know where the margin is actually bare.
 */
function plan(footerOnly: boolean): Slot[] {
  const window_ = window;
  const width = window_.innerWidth;
  if (width < MIN_WIDTH) return [];

  const pageHeight = document.documentElement.scrollHeight;
  const offset = window_.scrollY;

  // The biggest box the window will take, which every piece reaches for: as
  // wide as its half allows, and as tall as that width and the window permit.
  const narrow = width < NARROW;
  const boxWidth = narrow
    ? width * NARROW_RATIO
    : Math.min((width / 2) * SIZE_RATIO, MAX_SIZE);
  const boxHeight = Math.min(
    boxWidth / BOX_ASPECT,
    window_.innerHeight * MAX_HEIGHT_RATIO,
  );
  const shortest = boxHeight * MIN_SCALE;
  const spacing = window_.innerHeight / PER_SCREEN;
  const slots: Slot[] = [];
  // Half the page each, rather than the thin margins outside the content
  // column: copy paints nothing, so a piece can run right under a paragraph
  // and still be clear of every card and photograph on the page.
  // A narrow page gets the footer piece and nothing else: with no side margin
  // to speak of, everything the walk finds sits squarely behind the reading.
  if (!footerOnly && !narrow) {
    const strips: Record<Side, Band> = {
      left: { from: 0, to: width / 2 },
      right: { from: width / 2, to: width },
    };
    const painted: Record<Side, Band[]> = { left: [], right: [] };
    /** Stretches a page has asked to have its piece face the other way in. */
    const flipped: Band[] = [];

    for (const element of document.body.querySelectorAll("*")) {
      if (element.closest("[data-cad-backdrop]")) continue;
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;

      if (element.hasAttribute("data-backdrop-flip")) {
        flipped.push({ from: rect.top + offset, to: rect.bottom + offset });
      }

      const sides = (["left", "right"] as const).filter(
        (side) => rect.right > strips[side].from && rect.left < strips[side].to,
      );
      if (sides.length === 0) continue;
      // `data-no-backdrop` keeps a section clear by hand, for the places where a
      // piece is technically in the open but visually in the way.
      if (!element.hasAttribute("data-no-backdrop") && !paints(element))
        continue;

      for (const side of sides) {
        painted[side].push({
          from: rect.top + offset,
          to: rect.bottom + offset,
        });
      }
    }

    const bands = {
      left: freeBands(painted.left, pageHeight),
      right: freeBands(painted.right, pageHeight),
    };

    // Spread pieces evenly down every bare stretch, so a long run carries several
    // rather than a single lonely one. Each is as large as the window allows, or
    // as large as the band will carry at full overflow, whichever is smaller.
    const candidates: Slot[] = [];
    for (const side of ["left", "right"] as const) {
      for (const band of bands[side]) {
        const room = band.to - band.from - CLEARANCE * 2;
        if (room < shortest / OVERFLOW) continue;

        const height = Math.min(boxHeight, room * OVERFLOW);
        const count = Math.max(1, Math.floor(room / (height * 0.9)));
        for (let index = 0; index < count; index += 1) {
          const middle = band.from + CLEARANCE + (room * (index + 0.5)) / count;
          candidates.push({
            top: middle - height / 2,
            width: boxWidth,
            height,
            side,
            flipped: flipped.some(
              (band) => middle >= band.from && middle <= band.to,
            ),
          });
        }
      }
    }

    // Take them left, right, left, right down the page, spaced far enough apart
    // to land at the wanted density. Only when the wanted side has nothing left
    // to offer below the last piece does the other side stand in — better a
    // repeated side than a blank half of the page.
    candidates.sort((a, b) => a.top - b.top);

    let wanted: Side = "left";
    let floor = 0;
    while (slots.length < MAX_PIECES) {
      const clear = candidates.filter(
        (candidate) => candidate.top >= floor && !slots.includes(candidate),
      );
      const next =
        clear.find((candidate) => candidate.side === wanted) ?? clear[0];
      if (!next) break;

      slots.push(next);
      floor = next.top + spacing;
      wanted = next.side === "left" ? "right" : "left";
    }
  }

  // The footer piece is placed rather than found, so every page ends on one
  // whatever the body above it did. Centred on the footer, or on the foot of
  // the page if there is somehow no footer to centre on.
  const footer = document.querySelector("footer")?.getBoundingClientRect();
  const middle = footer
    ? footer.top +
      offset +
      footer.height * FOOTER_ANCHOR -
      boxHeight / 2 -
      FOOTER_LIFT
    : pageHeight - boxHeight - CLEARANCE;
  const anchored: Slot = {
    top: Math.max(0, middle),
    width: boxWidth,
    height: boxHeight,
    side: FOOTER_SIDE,
    piece: FOOTER_PIECE,
    mirrored: false,
  };

  return [
    // Anything the walk found that would crowd the footer piece gives way to
    // it, since that one is the piece the page is guaranteed.
    ...slots.filter((slot) => anchored.top - slot.top >= spacing),
    anchored,
  ];
}

/**
 * Where in the piece list a page starts.
 *
 * Taken from the route list rather than hashed, so consecutive pages open on
 * different hardware instead of colliding by chance. Anything unlisted (the
 * 404, say) falls back to a hash of its path.
 */
function startingPiece(pathname: string) {
  const listed = INDEXABLE_ROUTES.findIndex((route) => route.path === pathname);
  if (listed >= 0) return listed;
  return Math.abs(
    Array.from(pathname).reduce(
      (hash, character) => (hash * 31 + character.charCodeAt(0)) | 0,
      7,
    ),
  );
}

/**
 * Pieces of the rover, stippled and set faint in the margins of the page.
 *
 * Pinned to the document rather than to the viewport, so they sit where they
 * are put and scroll away with everything else instead of trailing the reader
 * down the page.
 */
export default function CadBackdrop() {
  const pathname = usePathname() ?? "/";
  const [slots, setSlots] = useState<Slot[]>([]);
  const footerOnly = FOOTER_ONLY.includes(pathname);

  // Layout keys this component by route, so a navigation remounts it and the
  // plan below is always measured against the page currently on screen.
  useEffect(() => {
    let frame = 0;
    const remeasure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setSlots(plan(footerOnly)));
    };

    remeasure();
    // Images and fonts land after the first paint and move everything below
    // them, so the page is worth a second look once it has settled.
    window.addEventListener("load", remeasure);
    // Catches the rest: a resize, a lazy section, a route that grew.
    const observer = new ResizeObserver(remeasure);
    observer.observe(document.body);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("load", remeasure);
      observer.disconnect();
    };
  }, [footerOnly]);

  const first = startingPiece(pathname);

  return (
    <div
      data-cad-backdrop=""
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {slots.map((slot, index) => {
        const piece = slot.piece ?? (first + index) % PIECES.length;
        // Every other piece is mirrored as it goes down the page; a band
        // marked to face the other way inverts that for the one it holds.
        const mirrored =
          (slot.mirrored ?? (first + index) % 2 === 1) !==
          Boolean(slot.flipped);
        // A mirror swaps the element's edges too, so a piece that is to end up
        // against the left of the page has to be drawn against the right of
        // its own box.
        const away = slot.side === "left" ? "right" : "left";
        return (
          <div
            // Position is the identity here: two slots can legitimately show
            // the same piece, and a slot keeps its place across a re-measure.
            key={`${slot.side}-${slot.top}`}
            className="cad-piece absolute"
            style={{
              top: slot.top,
              width: slot.width,
              height: slot.height,
              // Sat against its own edge of the page, filling its half.
              [slot.side]: 0,
            }}
          >
            <DotImage
              src={PIECES[piece]}
              // Held against the outside edge rather than centred in its half,
              // so it reads as furniture in the corner of the page instead of
              // drifting into the middle of the copy.
              align={mirrored ? away : slot.side}
              className={`h-full w-full opacity-[0.22] ${
                mirrored ? "scale-x-[-1]" : ""
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}
