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
/**
 * How still the document height has to be before the plan is taken, and how
 * often it is sampled, in milliseconds.
 *
 * The plan is a measurement of the rendered page, so it is only worth taking
 * once the page has stopped rendering: fonts swapping in, images decoding and
 * cards arriving all change the bands, and a plan drawn mid-flight is a plan
 * that disagrees with the one after it.
 */
const QUIET_MS = 250;
const SAMPLE_MS = 50;
/**
 * The longest the quiet is waited for. A page that never settles — a looping
 * animation that resizes something, a feed that keeps appending — would
 * otherwise never get a backdrop at all.
 */
const SETTLE_CAP = 3000;
/** How long a resize has to stop before the page is planned again. */
const RESIZE_QUIET = 200;

type Side = "left" | "right";
type Band = { from: number; to: number };
/** A painted span, remembering what painted it. */
type Span = Band & { element: Element };
/** A bare stretch, remembering what closed the span above it. */
type Free = Band & { after: Element | null };
type Slot = {
  top: number;
  /**
   * What the piece is pinned to, and how far below that element's edge it
   * sits. Re-reading the anchor is how a piece stays with its part of the page
   * as images load in and push everything below them down — without it, a
   * fresh plan is drawn each time and the pieces appear to wander.
   */
  anchor: Element | null;
  anchorEdge: "top" | "bottom";
  offset: number;
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
function freeBands(spans: Span[], pageHeight: number): Free[] {
  const sorted = [...spans].sort((a, b) => a.from - b.from);
  const merged: Span[] = [];
  for (const span of sorted) {
    const last = merged.at(-1);
    if (!last || span.from > last.to) {
      merged.push({ ...span });
    } else if (span.to > last.to) {
      // The span that reaches furthest down is the one whose bottom edge the
      // band below is measured from.
      last.to = span.to;
      last.element = span.element;
    }
  }

  const bands: Free[] = [];
  let cursor = 0;
  let after: Element | null = null;
  for (const span of merged) {
    if (span.from - cursor >= MIN_BAND) {
      bands.push({ from: cursor, to: span.from, after });
    }
    if (span.to > cursor) {
      cursor = span.to;
      after = span.element;
    }
  }
  if (pageHeight - cursor >= MIN_BAND) {
    bands.push({ from: cursor, to: pageHeight, after });
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
    const painted: Record<Side, Span[]> = { left: [], right: [] };
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
          element,
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
            anchor: band.after,
            anchorEdge: "bottom",
            offset: middle - height / 2 - band.from,
            width: boxWidth,
            height,
            side,
            // Overlap, not containment: a piece is centred on its band, and
            // a band commonly starts above the section that marked it — the
            // gap opens where the last card ended, not where the copy begins.
            flipped: flipped.some(
              (band) =>
                middle + height / 2 > band.from &&
                middle - height / 2 < band.to,
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
  const footer = document.querySelector("footer");
  const box = footer?.getBoundingClientRect();
  const middle = box
    ? box.top +
      offset +
      box.height * FOOTER_ANCHOR -
      boxHeight / 2 -
      FOOTER_LIFT
    : pageHeight - boxHeight - CLEARANCE;
  const top = Math.max(0, middle);
  const anchored: Slot = {
    top,
    anchor: footer ?? null,
    anchorEdge: "top",
    offset: box ? top - (box.top + offset) : top,
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
    // Two frame handles rather than one: a restick arriving while a replan is
    // still queued used to cancel it, which quietly dropped the plan.
    let planFrame = 0;
    let stickFrame = 0;
    let sampler = 0;
    let resizer = 0;
    let done = false;

    /**
     * Choose the pieces and where they go. Taken once, off a page that has
     * stopped moving, and again only if the window is resized — a plan drawn
     * against a half-arrived page reads different bands, so re-choosing later
     * is what made the pieces land somewhere new on every refresh.
     */
    const replan = () => {
      cancelAnimationFrame(planFrame);
      planFrame = requestAnimationFrame(() => setSlots(plan(footerOnly)));
    };

    /**
     * Keep the pieces already chosen with the part of the page they were put
     * against. Nothing is re-chosen here: each one is simply re-read off its
     * anchor, so a lazily loaded card pushing the page down carries its piece
     * along instead of stranding it.
     */
    const restick = () => {
      cancelAnimationFrame(stickFrame);
      stickFrame = requestAnimationFrame(() => {
        setSlots((current) => {
          if (current.length === 0) return current;
          return current.map((slot) => {
            if (!slot.anchor?.isConnected) return slot;
            const rect = slot.anchor.getBoundingClientRect();
            const edge = slot.anchorEdge === "top" ? rect.top : rect.bottom;
            const top = Math.max(0, edge + window.scrollY + slot.offset);
            return top === slot.top ? slot : { ...slot, top };
          });
        });
      });
    };

    /**
     * Watch the document height until it holds still, then plan against it.
     *
     * Height is the one number that moves whenever anything the plan cares
     * about moves — a font swapping in, an image decoding, a card mounting —
     * so waiting on it covers all of them without having to enumerate them.
     */
    let height = -1;
    let quiet = 0;
    const opened = performance.now();
    const sample = () => {
      const measured = document.documentElement.scrollHeight;
      if (measured === height) {
        quiet += SAMPLE_MS;
      } else {
        height = measured;
        quiet = 0;
      }

      if (quiet >= QUIET_MS || performance.now() - opened >= SETTLE_CAP) {
        done = true;
        replan();
        return;
      }
      sampler = window.setTimeout(sample, SAMPLE_MS);
    };
    sample();

    // Fonts reflow every block of copy at once, and can land after a stretch
    // of quiet has already been counted, so their arrival restarts the count.
    document.fonts?.ready.then(() => {
      if (!done) quiet = 0;
    });

    // A resize invalidates the geometry outright, so that one really does have
    // to re-choose — but only once the dragging stops.
    const onResize = () => {
      window.clearTimeout(resizer);
      resizer = window.setTimeout(replan, RESIZE_QUIET);
    };
    window.addEventListener("resize", onResize);
    // The document may keep growing after all that; the pieces travel with it.
    const observer = new ResizeObserver(restick);
    observer.observe(document.body);

    return () => {
      done = true;
      cancelAnimationFrame(planFrame);
      cancelAnimationFrame(stickFrame);
      window.clearTimeout(sampler);
      window.clearTimeout(resizer);
      window.removeEventListener("resize", onResize);
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
            // Keyed by where it sits in the plan rather than by its position:
            // a restick moves the top, and remounting on that would tear the
            // canvas down and sample the drawing again for no reason.
            key={`${slot.side}-${index}`}
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
