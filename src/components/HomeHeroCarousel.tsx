"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { type TranslationKey, useTranslation } from "@/i18n";

/**
 * A name pinned to something in a slide's photograph: a pill carrying the name
 * and a leader line running from it to the thing itself. Both positions are
 * fractions of the source image rather than of the card, so a callout keeps
 * pointing at the same hardware however the card is cropped.
 */
type Annotation = {
  /** Hardware names read the same in every language, so this is not a key. */
  name: string;
  /** Where the pill's centre sits. */
  pill: { x: number; y: number };
  /** Where the leader line lands. */
  point: { x: number; y: number };
};

type Slide = {
  id: string;
  /** Full-bleed backdrop of the card: either the profile video or a still. */
  media:
    | { kind: "video"; src: string; poster: string }
    | { kind: "image"; src: string };
  title?: TranslationKey;
  subtitle?: TranslationKey;
  /** Centred artwork used instead of a text headline (the brand lockup). */
  logo?: { src: string; alt: TranslationKey };
  /** Where the card's content sits. Defaults to the centred treatment. */
  align?: "center" | "top-left";
  /** Read out on the control that steps to this card. */
  label: TranslationKey;
  /** Names called out on the backdrop, in that photograph's own coordinates. */
  annotations?: { aspect: number; items: readonly Annotation[] };
};

// Order is what the reel opens on: the card written first is the one centred
// when the page loads, with the rest peeking out either side of it.
const SLIDES: Slide[] = [
  {
    id: "brand",
    media: { kind: "image", src: "/images/home/hero-background.jpg" },
    logo: {
      src: "/images/brand/logo-vertical.webp",
      alt: "hero.brand.logoAlt",
    },
    align: "top-left",
    label: "hero.brand.label",
    annotations: {
      aspect: 1280 / 854,
      items: [
        {
          name: "AEROVAL",
          pill: { x: 0.8, y: 0.28 },
          point: { x: 0.64, y: 0.55 },
        },
      ],
    },
  },
  {
    id: "rival-its",
    media: {
      kind: "video",
      src: "/videos/videoprofil-720.mp4",
      poster: "/images/home/video-profile-poster.webp",
    },
    label: "hero.rival.label",
  },
  {
    id: "arch",
    media: {
      kind: "image",
      src: "/images/competitions/australian-rover-challenge/hero-background.webp",
    },
    title: "hero.arch.title",
    subtitle: "hero.arch.subtitle",
    align: "top-left",
    label: "hero.arch.label",
  },
];

/**
 * The backdrop video for a slide.
 *
 * A stopped <video> is chrome bait: Safari paints a start-playback button over
 * it and Firefox paints a click-to-play overlay whenever autoplay is refused,
 * neither of which an author stylesheet can reliably reach. So the element is
 * kept fully out of the paint tree — `visibility: hidden`, not just zero
 * opacity — until a `playing` event proves it is actually running, and the
 * poster underneath carries the card until then. A browser that never grants
 * autoplay therefore shows a plain still and nothing else.
 */
function SlideVideo({ src }: { src: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // React assigns `muted` as a DOM property, and Safari has usually already
    // begun evaluating the source by the time it lands — so the element looks
    // unmuted at exactly the moment the autoplay policy is checked, and gets
    // refused. Stamping the attribute on directly closes that window.
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");

    // The autoPlay attribute is a request, not a guarantee: Low Power Mode and
    // a per-site "Never Auto-Play" both decline it outright, and the rejection
    // is expected rather than an error worth surfacing.
    const attempt = () => {
      video.play().catch(() => {});
    };

    attempt();

    // A refusal is often lifted once the visitor has interacted with the page,
    // so one retry on the first gesture recovers the video instead of stranding
    // the card on its poster for the rest of the session.
    const events = ["pointerdown", "keydown", "touchstart"] as const;
    for (const type of events) {
      window.addEventListener(type, attempt, { once: true, passive: true });
    }

    return () => {
      for (const type of events) {
        window.removeEventListener(type, attempt);
      }
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      loop
      autoPlay
      playsInline
      preload="auto"
      controls={false}
      disablePictureInPicture
      disableRemotePlayback
      tabIndex={-1}
      aria-hidden="true"
      onPlaying={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      className={`video-chromeless pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out ${
        isPlaying ? "visible opacity-100" : "invisible opacity-0"
      }`}
    />
  );
}

/**
 * Callouts pinned to a slide's photograph.
 *
 * The backdrop is laid out with object-cover, so the crop — and with it the
 * position of everything in the frame — shifts as the card changes shape
 * between breakpoints. Measuring the card and re-deriving the box the image
 * actually covers puts the overlay back into the photograph's own coordinate
 * space, so a callout stays on the hardware it names at every size.
 */
function SlideAnnotations({
  aspect,
  items,
}: {
  aspect: number;
  items: readonly Annotation[];
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<CoveredBox | null>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      const { width, height } = frame.getBoundingClientRect();
      if (!width || !height) return;
      // Whichever axis the card is short on is the one the image overflows.
      const covered =
        width / height > aspect
          ? { width, height: width / aspect }
          : { width: height * aspect, height };
      setBox({
        ...covered,
        left: (width - covered.width) / 2,
        top: (height - covered.height) / 2,
        frameWidth: width,
        frameHeight: height,
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [aspect]);

  const callouts = box
    ? items.map((item) => {
        // The point is fixed to the hardware, wherever the crop leaves it. The
        // pill is only a label, so it is free to slide back inside the card
        // rather than hang off the edge on the narrow portrait crop — and its
        // leader line follows it, keeping the two attached.
        const halfPill = (item.name.length * 9 + 40) / 2;
        const anchored = {
          pillX: clampToFrame(
            item.pill.x * box.width,
            box.left,
            box.frameWidth,
            halfPill + 12,
          ),
          pillY: clampToFrame(
            item.pill.y * box.height,
            box.top,
            box.frameHeight,
            PILL_RADIUS + 12,
          ),
          pointX: item.point.x * box.width,
          pointY: item.point.y * box.height,
        };
        return { name: item.name, ...anchored, ...leader(anchored) };
      })
    : [];

  return (
    <div
      ref={frameRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {box && (
        <div
          className="absolute animate-logo-fade-in"
          style={{
            left: box.left,
            top: box.top,
            width: box.width,
            height: box.height,
          }}
        >
          {/* Drawn in the covered box's own pixels, so the dashes keep their
              spacing instead of stretching with the crop. */}
          <svg
            viewBox={`0 0 ${box.width} ${box.height}`}
            className="absolute inset-0 h-full w-full"
          >
            <title>Callout leader lines</title>
            {callouts.map((callout) => (
              <g key={callout.name}>
                <path
                  d={callout.path}
                  fill="none"
                  stroke="white"
                  strokeOpacity={0.75}
                  strokeWidth={1.5}
                  strokeDasharray="1 6"
                  strokeLinecap="round"
                />
                {callout.arrows.map((arrow) => (
                  <path
                    key={arrow}
                    d={arrow}
                    fill="none"
                    stroke="white"
                    strokeOpacity={0.9}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
                <circle
                  cx={callout.pointX}
                  cy={callout.pointY}
                  r={3}
                  fill="white"
                />
                <circle
                  cx={callout.pointX}
                  cy={callout.pointY}
                  r={8}
                  fill="none"
                  stroke="white"
                  strokeOpacity={0.55}
                  strokeWidth={1.5}
                  strokeDasharray="1 6"
                  strokeLinecap="round"
                />
              </g>
            ))}
          </svg>
          {callouts.map((callout) => (
            /* The gradient rides on the hairline alone (see .hero-callout in
               globals.css); the fill under it stays plain glass. */
            <span
              key={callout.name}
              className="hero-callout -translate-x-1/2 -translate-y-1/2 absolute whitespace-nowrap rounded-full bg-white/15 px-4 py-1.5 text-sm text-white backdrop-blur-md md:px-5 md:py-2 md:text-base"
              style={{ left: callout.pillX, top: callout.pillY }}
            >
              {callout.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/** The box the backdrop covers, in the coordinates of the card that crops it. */
type CoveredBox = {
  width: number;
  height: number;
  left: number;
  top: number;
  frameWidth: number;
  frameHeight: number;
};

/**
 * Pulls a coordinate back inside the part of the covered box the card actually
 * shows, leaving `inset` clear of either edge. A frame too narrow to hold the
 * thing at all centres it instead of pinning it to one side.
 */
function clampToFrame(
  value: number,
  offset: number,
  frameSize: number,
  inset: number,
) {
  const low = -offset + inset;
  const high = -offset + frameSize - inset;
  if (low > high) return -offset + frameSize / 2;
  return Math.min(Math.max(value, low), high);
}

/**
 * The dotted run from the pill to the thing it names — down out of the pill,
 * then across, turning the corner on a radius that never outruns either leg —
 * together with the chevrons that sit on it.
 *
 * The chevrons point back up the run towards the name, so the line reads as
 * belonging to the pill rather than as an arrow fired at the rover. A leg with
 * no room for one goes without, rather than crowding the corner.
 */
function leader({
  pillX,
  pillY,
  pointX,
  pointY,
}: {
  pillX: number;
  pillY: number;
  pointX: number;
  pointY: number;
}) {
  const downwards = pointY >= pillY ? 1 : -1;
  const rightwards = pointX >= pillX ? 1 : -1;
  const start = pillY + downwards * PILL_RADIUS;
  const corner = Math.min(
    CORNER_RADIUS,
    Math.abs(pointY - start) / 2,
    Math.abs(pointX - pillX) / 2,
  );
  const turn = {
    x: pillX + rightwards * corner,
    y: pointY - downwards * corner,
  };

  const arrows: string[] = [];
  if (Math.abs(turn.y - start) > ARROW_MIN_LEG) {
    // On the drop out of the pill, aimed back up at it.
    const y = (start + turn.y) / 2;
    const tail = y + downwards * ARROW_SIZE;
    arrows.push(
      `M ${pillX - ARROW_SIZE} ${tail} L ${pillX} ${y} L ${pillX + ARROW_SIZE} ${tail}`,
    );
  }
  if (Math.abs(pointX - turn.x) > ARROW_MIN_LEG) {
    // On the run in, aimed back along it towards the corner.
    const x = (turn.x + pointX) / 2;
    const tail = x + rightwards * ARROW_SIZE;
    arrows.push(
      `M ${tail} ${pointY - ARROW_SIZE} L ${x} ${pointY} L ${tail} ${pointY + ARROW_SIZE}`,
    );
  }

  return {
    path: [
      `M ${pillX} ${start}`,
      `L ${pillX} ${turn.y}`,
      `Q ${pillX} ${pointY} ${turn.x} ${pointY}`,
      `L ${pointX} ${pointY}`,
    ].join(" "),
    arrows,
  };
}

// Half the pill's height, which is where its leader line starts, and the bend
// that line takes on its way to the point it names.
const PILL_RADIUS = 20;
const CORNER_RADIUS = 24;
// The chevrons on the run, and the shortest leg still worth putting one on.
const ARROW_SIZE = 4;
const ARROW_MIN_LEG = 44;

// The card width and the gutter either side of it live in CSS (`.hero-reel` in
// globals.css) rather than here, because the mobile breakpoint narrows the card
// so more of the neighbours peek out of the edges — and a media query can reach
// a custom property where an inline style cannot. Everything below is derived
// from those two values: the track advances by one card plus one gutter per
// step, and leads by the margin that centres the active card.
const STEP = "calc((var(--card-w) + var(--gap-w)) * 1vw)";
const LEAD = "calc((100 - var(--card-w)) / 2 * 1vw)";
// The widest the card ever gets, which is what the image loader sizes against.
const MAX_CARD_VW = 92;

// Three copies of the reel so there is always a card to peek out of either
// edge. Copies are identical, so the track can be re-anchored from one to the
// matching card in another without anything changing on screen.
const REEL = [...SLIDES, ...SLIDES, ...SLIDES];
const MIDDLE = SLIDES.length;
// The track may sit anywhere that still leaves a card either side of it; only
// the two outermost slots are out of bounds.
const MIN_POSITION = 1;
const MAX_POSITION = REEL.length - 2;

export default function HomeHeroCarousel() {
  const { t } = useTranslation();
  const [position, setPosition] = useState(MIDDLE);
  const [animated, setAnimated] = useState(true);
  const pendingRef = useRef<number | null>(null);

  const step = useCallback(
    (delta: number) => {
      const target = position + delta;
      if (target >= MIN_POSITION && target <= MAX_POSITION) {
        setAnimated(true);
        setPosition(target);
        return;
      }
      // Running off the end of the reel. Re-anchor onto the matching card in
      // the middle copy first and animate from there on the next frame, rather
      // than animating off the end and snapping back afterwards. The card that
      // slides in is then the same DOM node before and after the transition,
      // so its <video> is never torn down and rebuilt mid-step.
      const offset =
        (((position - MIDDLE) % SLIDES.length) + SLIDES.length) % SLIDES.length;
      pendingRef.current = MIDDLE + offset + delta;
      setAnimated(false);
      setPosition(MIDDLE + offset);
    },
    [position],
  );

  // The re-anchor above must paint before the step animates, or the browser
  // collapses the two into one transition and the jump becomes visible.
  useEffect(() => {
    if (animated) return;
    const frame = requestAnimationFrame(() => {
      setAnimated(true);
      if (pendingRef.current !== null) {
        setPosition(pendingRef.current);
        pendingRef.current = null;
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [animated]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t("hero.label")}
      className="hero-reel pt-2 pb-6"
    >
      <div className="overflow-hidden">
        <div
          className={`flex ${animated ? "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" : ""}`}
          style={{
            gap: "calc(var(--gap-w) * 1vw)",
            transform: `translateX(calc(${LEAD} - ${position} * ${STEP}))`,
          }}
        >
          {REEL.map((slide, slideIndex) => {
            const isActive = slideIndex === position;
            const media = slide.media;
            const topLeft = slide.align === "top-left";
            // The card on screen plus the two peeking out of the edges are the
            // only ones worth fetching up front; the rest are duplicates that
            // sit off-screen until the reel is stepped.
            const isOnScreen = Math.abs(slideIndex - MIDDLE) <= 1;
            return (
              <div
                key={`${slide.id}-${slideIndex}`}
                aria-hidden={!isActive}
                className="relative aspect-[6/7] flex-none overflow-hidden rounded-[2rem] md:aspect-auto md:h-[min(80vh,900px)] md:min-h-[420px]"
                style={{ width: "calc(var(--card-w) * 1vw)" }}
              >
                <Image
                  src={media.kind === "video" ? media.poster : media.src}
                  alt=""
                  fill
                  sizes={`${MAX_CARD_VW}vw`}
                  priority={isOnScreen}
                  className="object-cover object-center"
                />
                {media.kind === "video" && isActive && (
                  <SlideVideo src={media.src} />
                )}

                {/* Darkening pass so white type stays legible over any frame. */}
                <div className="pointer-events-none absolute inset-0 bg-black/35" />

                {/* Only the card on screen is named; the neighbours peeking out
                    of the edges would show their callouts cropped in half. */}
                {slide.annotations && isActive && (
                  <SlideAnnotations
                    aspect={slide.annotations.aspect}
                    items={slide.annotations.items}
                  />
                )}

                <div
                  className={`absolute inset-0 flex flex-col ${
                    topLeft
                      ? "items-start justify-start p-6 text-left md:p-14"
                      : "items-center justify-center px-6 text-center"
                  }`}
                >
                  {slide.logo ? (
                    <Image
                      src={slide.logo.src}
                      alt={isActive ? t(slide.logo.alt) : ""}
                      width={220}
                      height={220}
                      className="h-auto w-[clamp(9rem,18vw,15rem)]"
                    />
                  ) : (
                    <>
                      {/* The centred card is the brand wordmark, so it gets the
                          extended caps treatment; the tighter tracking keeps
                          the widened letters reading as one word.

                          Deliberately a <p>, not a heading: the reel repeats
                          SLIDES three times, so a heading here would put six
                          duplicate <h1>s in the document. The page's real
                          heading lives in app/page.tsx. */}
                      {slide.title && (
                        <p
                          className={
                            topLeft
                              ? "max-w-[24ch] font-semibold text-[clamp(1.35rem,1.9vw,1.9rem)] text-white leading-tight"
                              : "hero-wordmark text-[clamp(2.75rem,8vw,7rem)] text-white leading-[1.02] tracking-[-0.02em]"
                          }
                        >
                          {t(slide.title)}
                        </p>
                      )}
                      {slide.subtitle && (
                        <p
                          className={
                            topLeft
                              ? "mt-1 max-w-[36ch] text-[clamp(1.1rem,1.65vw,1.65rem)] text-white/75 leading-snug"
                              : "mt-4 text-[clamp(1rem,1.8vw,1.6rem)] text-white/80"
                          }
                        >
                          {t(slide.subtitle)}
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* A peeking neighbour is the affordance for stepping the
                    carousel, matching how the card edges invite a click. */}
                {!isActive && (
                  <button
                    type="button"
                    onClick={() => step(slideIndex > position ? 1 : -1)}
                    aria-label={t("hero.show", { slide: t(slide.label) })}
                    tabIndex={-1}
                    className="absolute inset-0 cursor-pointer"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lined up with the edges of the active card rather than the viewport,
          so the label starts exactly where the card's own content does. */}
      <div
        className="mt-6 flex items-center justify-between"
        style={{ paddingInline: LEAD }}
      >
        <span className="text-base text-white/80 md:text-lg">
          {t("hero.explore")}
        </span>
        {/* One pill rather than two buttons: the arrows read as a single
            control, and each one takes a circular highlight on hover. */}
        <div className="flex items-center gap-1 rounded-full border border-[#398561] bg-[#398561] p-1 text-white">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label={t("hero.previous")}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-[#45a074] md:h-11 md:w-11"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-4 w-4 md:h-5 md:w-5"
            >
              <path
                d="M15 5 8 12l7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label={t("hero.next")}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-[#45a074] md:h-11 md:w-11"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-4 w-4 md:h-5 md:w-5"
            >
              <path
                d="m9 5 7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
