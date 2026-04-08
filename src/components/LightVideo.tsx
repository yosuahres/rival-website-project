"use client";

import { useEffect, useRef, useState } from "react";

interface LightVideoProps {
  src: string; // Path to video (e.g., '/videos/demo.mp4')
  webmSrc?: string; // Optional WebM format (smaller file size)
  movSrc?: string; // Optional MOV format (limited browser support)
  poster?: string; // Image to show before play
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  className?: string;
}

export default function LightVideo({
  src,
  webmSrc,
  movSrc,
  poster,
  autoplay = false,
  muted = true,
  loop = false,
  controls = true,
  className = "",
}: LightVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting && autoplay) {
          videoRef.current?.play();
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [autoplay]);

  return (
    <div ref={containerRef} className={className}>
      <video
        ref={videoRef}
        poster={poster}
        controls={controls}
        loop={loop}
        muted={muted}
        preload="metadata"
        className="w-full h-auto rounded-lg"
      >
        {webmSrc && <source src={webmSrc} type="video/webm" />}
        {movSrc && <source src={movSrc} type="video/quicktime" />}
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
