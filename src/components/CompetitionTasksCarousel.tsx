"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Task {
  id: number;
  title: string;
  description: string;
  image: string;
  videoLink?: string;
}

interface CompetitionTasksCarouselProps {
  tasks: Task[];
  backgroundImage?: string;
}

// The card renders at max-w-3xl (768px) and goes full-bleed on small screens. We
// ask for a little more than that so 1x displays still get a supersampled,
// crisp thumbnail rather than a pixel-exact soft one.
const CARD_SIZES = "(max-width: 768px) 100vw, 1024px";
const MOBILE_CARD_SIZES = "100vw";

// Shared look for the four arrow controls: a soft glass disc that picks up the
// brand green on hover, instead of the raw &larr;/&rarr; font glyphs.
const ARROW_BASE =
  // cursor-pointer is explicit rather than inherited from the base-layer rule:
  // the arrows disable themselves for the 150ms slide, and the cursor should not
  // blink to the default arrow mid-click.
  "z-10 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md shadow-lg transition-all duration-200 hover:bg-[#398561] hover:border-[#398561] hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:opacity-50 disabled:hover:scale-100";

// The task data uses youtube.com/live/<id> links, but accept the other common
// shapes too so a future entry pasted from the share sheet still plays inline.
function getYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return parsed.pathname.slice(1) || null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const watchId = parsed.searchParams.get("v");
      if (watchId) return watchId;

      const match = parsed.pathname.match(/^\/(?:live|embed|shorts)\/([^/]+)/);
      if (match) return match[1];
    }

    return null;
  } catch {
    return null;
  }
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-1/2 h-1/2"
    >
      <path d={direction === "left" ? "M15 5 8 12l7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

interface VideoLightboxProps {
  videoId: string;
  title: string;
  onClose: () => void;
}

function VideoLightbox({ videoId, title, onClose }: VideoLightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Move focus into the overlay so the close control — and nothing behind it —
  // is where the keyboard lands.
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    // Keep the page from scrolling behind the overlay.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  // Portalled to the body: the carousel card is transformed for its slide
  // animation, which would otherwise become the containing block for a fixed
  // overlay and clip it inside the card.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-lightbox-fade-in"
    >
      {/* Click-anywhere-to-dismiss, as a real button rather than a handler on
          the backdrop div — the close control above carries the accessible
          affordance, and Escape covers the keyboard. */}
      <button
        type="button"
        onClick={onClose}
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 cursor-default"
      />

      <div className="relative w-[min(92vw,calc(80vh*16/9))] animate-lightbox-zoom-in">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close video"
          className={`${ARROW_BASE} absolute -top-14 right-0 flex w-11 h-11`}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            className="w-1/2 h-1/2"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl ring-1 ring-white/15">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </div>

        <p className="mt-4 text-center text-lg font-semibold text-white">
          {title}
        </p>
      </div>
    </div>,
    document.body,
  );
}

export default function CompetitionTasksCarousel({
  tasks,
  backgroundImage,
}: CompetitionTasksCarouselProps) {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(
    null,
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [openVideo, setOpenVideo] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const closeVideo = useCallback(() => setOpenVideo(null), []);

  // The mobile strip is a native scroll-snap carousel, so the caption below it
  // follows whichever slide is nearest the centre rather than any state we set
  // ourselves. Runs only where the strip is visible: it is display:none from md
  // up and therefore never scrolls.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const trackBox = track.getBoundingClientRect();
      const center = trackBox.left + trackBox.width / 2;
      let nearest = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;
      track.childNodes.forEach((node, index) => {
        const box = (node as HTMLElement).getBoundingClientRect();
        const distance = Math.abs(box.left + box.width / 2 - center);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = index;
        }
      });
      setCurrentTaskIndex(nearest);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleTaskChange = (newIndex: number, direction: "left" | "right") => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSlideDirection(direction);

    setTimeout(() => {
      setCurrentTaskIndex(newIndex);
      setSlideDirection(null);
      setIsAnimating(false);
    }, 150);
  };

  const nextTask = () => {
    const newIndex = (currentTaskIndex + 1) % tasks.length;
    handleTaskChange(newIndex, "right");
  };

  const prevTask = () => {
    const newIndex = (currentTaskIndex - 1 + tasks.length) % tasks.length;
    handleTaskChange(newIndex, "left");
  };

  const currentTask = tasks[currentTaskIndex];

  const slideClasses =
    slideDirection === "right"
      ? "-translate-x-full opacity-0"
      : slideDirection === "left"
        ? "translate-x-full opacity-0"
        : "translate-x-0 opacity-100";

  // The play badge sits on the image permanently so the card reads as a video
  // without needing to be hovered, and stays static under the cursor.
  const playOverlay = (
    <div className="absolute inset-0 flex items-center justify-center rounded-lg">
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-black/20 shadow-lg backdrop-blur-md">
        <svg
          aria-hidden="true"
          className="ml-0.5 h-4 w-4 text-white drop-shadow"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <polygon points="5 3 19 12 5 21"></polygon>
        </svg>
      </div>
    </div>
  );

  // Plays inline when we can resolve a YouTube id; anything else still falls
  // back to opening the original link.
  const renderVideoTrigger = (task: Task) => {
    const videoId = task.videoLink ? getYouTubeId(task.videoLink) : null;

    if (videoId) {
      return (
        <button
          type="button"
          onClick={() => setOpenVideo({ id: videoId, title: task.title })}
          className="absolute inset-0 rounded-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label={`Watch ${task.title}`}
        >
          {playOverlay}
        </button>
      );
    }

    if (task.videoLink) {
      return (
        <a
          href={task.videoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 rounded-lg cursor-pointer"
          aria-label={`Watch ${task.title}`}
        >
          {playOverlay}
        </a>
      );
    }

    return null;
  };

  return (
    <section className="py-12 px-4 md:py-20 md:px-8 bg-black relative overflow-hidden">
      {/* Rendered through next/image rather than a CSS url() so the optimizer
          can downscale and re-encode it per device. */}
      {backgroundImage && (
        <>
          <Image
            src={backgroundImage}
            alt=""
            fill
            sizes="100vw"
            quality={50}
            className="object-cover object-center grayscale"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/70"
          ></div>
        </>
      )}
      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-6 md:mb-8">
          COMPETITION TASKS
        </h2>

        <div className="relative flex flex-col items-center justify-center gap-6 md:h-[650px] md:min-h-[650px] md:gap-8 md:overflow-hidden md:p-4">
          {/* Desktop: one card at a time, stepped through with the arrows on
              either side. */}
          <div className="relative hidden md:flex items-center justify-center gap-8 w-full">
            <button
              type="button"
              onClick={prevTask}
              aria-label="Previous task"
              className={`${ARROW_BASE} flex w-14 h-14 flex-shrink-0`}
              disabled={isAnimating}
            >
              <ChevronIcon direction="left" />
            </button>

            <div
              className={`group relative h-100 w-full max-w-3xl shadow-xl bg-white rounded-xl transition-transform duration-300 ease-in-out ${slideClasses}`}
            >
              {/* Every task image stays mounted and stacked, so they all lazy-load
                  together when the section scrolls into view and switching slides
                  never waits on a fetch. */}
              {tasks.map((task, index) => (
                <Image
                  key={task.id}
                  src={task.image}
                  alt={task.title}
                  fill
                  sizes={CARD_SIZES}
                  className={`rounded-lg object-cover transition-opacity duration-200 ${
                    task.videoLink ? "group-hover:brightness-75" : ""
                  } ${index === currentTaskIndex ? "opacity-100" : "opacity-0"}`}
                />
              ))}

              {renderVideoTrigger(currentTask)}
            </div>

            <button
              type="button"
              onClick={nextTask}
              aria-label="Next task"
              className={`${ARROW_BASE} flex w-14 h-14 flex-shrink-0`}
              disabled={isAnimating}
            >
              <ChevronIcon direction="right" />
            </button>
          </div>

          {/* Mobile: a scroll-snap strip instead of arrows. The slide is
              narrower than the strip by exactly twice the padding, so it snaps
              dead centre while its neighbours stay visible at both edges —
              which is what tells the reader the row can be swiped. */}
          <div
            ref={trackRef}
            className="scrollbar-hide flex w-full snap-x snap-mandatory gap-3 overflow-x-auto px-10 md:hidden"
          >
            {tasks.map((task) => (
              <div
                key={task.id}
                className="relative h-[220px] w-[calc(100vw-7rem)] flex-shrink-0 snap-center rounded-xl bg-white shadow-xl"
              >
                <Image
                  src={task.image}
                  alt={task.title}
                  fill
                  sizes={MOBILE_CARD_SIZES}
                  className="rounded-xl object-cover"
                />
                {renderVideoTrigger(task)}
              </div>
            ))}
          </div>

          {/* Same stacking trick as the images: every caption occupies the one
              grid cell, so the block is always as tall as the longest one. A
              short description can no longer shrink the column and drag the
              image row — and the arrows beside it — up or down. */}
          <div
            className={`relative grid max-w-5xl px-4 text-center transition-transform duration-300 ease-in-out ${slideClasses}`}
          >
            {tasks.map((task, index) => (
              <div
                key={task.id}
                className={`col-start-1 row-start-1 ${
                  index === currentTaskIndex ? "" : "invisible"
                }`}
              >
                <h3 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">
                  {task.title}
                </h3>
                <p className="text-gray-300 text-sm md:text-lg mt-3 md:mt-4">
                  {task.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {openVideo && (
        <VideoLightbox
          videoId={openVideo.id}
          title={openVideo.title}
          onClose={closeVideo}
        />
      )}
    </section>
  );
}
