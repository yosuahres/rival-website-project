"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Slide = {
  id: string;
  /** Full-bleed backdrop of the card: either the profile video or a still. */
  media:
    | { kind: "video"; src: string; poster: string }
    | { kind: "image"; src: string };
  title?: string;
  subtitle?: string;
  /** Centred artwork used instead of a text headline (the brand lockup). */
  logo?: { src: string; alt: string };
  /** Where the card's content sits. Defaults to the centred treatment. */
  align?: "center" | "top-left";
  /** Read out on the control that steps to this card. */
  label: string;
};

const SLIDES: Slide[] = [
  {
    id: "rival-its",
    media: {
      kind: "video",
      src: "/videos/videoprofil-720.mp4",
      poster: "/images/home/video-profile-poster.webp",
    },
    title: "RIVAL",
    subtitle: "ITS Robotics Team",
    label: "the RIVAL ITS team profile",
  },
  {
    id: "brand",
    media: { kind: "image", src: "/images/home/hero-background.jpg" },
    logo: { src: "/images/brand/logo-vertical.webp", alt: "RIVAL ITS logo" },
    align: "top-left",
    label: "the RIVAL ITS brand lockup",
  },
  {
    id: "arch",
    media: {
      kind: "image",
      src: "/images/competitions/australian-rover-challenge/hero-background.webp",
    },
    title: "Australian Rover Challenge",
    subtitle: "6th worldwide, 1st among Indonesian rover teams",
    align: "top-left",
    label: "the Australian Rover Challenge",
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
      aria-label="RIVAL ITS highlights"
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
                      alt={isActive ? slide.logo.alt : ""}
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
                      <p
                        className={
                          topLeft
                            ? "max-w-[24ch] font-semibold text-[clamp(1.35rem,1.9vw,1.9rem)] text-white leading-tight"
                            : "hero-wordmark text-[clamp(2.75rem,8vw,7rem)] text-white leading-[1.02] tracking-[-0.02em]"
                        }
                      >
                        {slide.title}
                      </p>
                      {slide.subtitle && (
                        <p
                          className={
                            topLeft
                              ? "mt-1 max-w-[36ch] text-[clamp(1.1rem,1.65vw,1.65rem)] text-white/75 leading-snug"
                              : "mt-4 text-[clamp(1rem,1.8vw,1.6rem)] text-white/80"
                          }
                        >
                          {slide.subtitle}
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
                    aria-label={`Show ${slide.label}`}
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
          Explore the latest
        </span>
        {/* One pill rather than two buttons: the arrows read as a single
            control, and each one takes a circular highlight on hover. */}
        <div className="flex items-center gap-1 rounded-full border border-[#398561] bg-[#398561] p-1 text-white">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous slide"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-[#021507] md:h-11 md:w-11"
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
            aria-label="Next slide"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-[#021507] md:h-11 md:w-11"
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
