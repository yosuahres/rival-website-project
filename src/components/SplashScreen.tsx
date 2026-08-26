"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/i18n";

interface SplashScreenProps {
  onFinish: () => void;
}

// Fade the logo up in place (700ms), let it sit for a beat, then hand over.
const HOLD_MS = 1200;

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const { t } = useTranslation();
  const [isLeaving, setIsLeaving] = useState(false);

  // Held in a ref so a re-render of the parent (which rebuilds the callback)
  // can't restart the timer and replay the splash.
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    const timer = setTimeout(() => {
      // Both at once: the splash fades out while Layout fades the page in
      // underneath, so the two cross-fade instead of flashing bare background.
      setIsLeaving(true);
      onFinishRef.current();
    }, HOLD_MS);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-400 ease-out ${
        isLeaving ? "opacity-0" : "opacity-100"
      }`}
    >
      <Image
        src="/images/brand/logo-vertical.webp"
        alt={t("nav.logoAlt")}
        width={280}
        height={280}
        priority
        // Rendered at 120px (140px from md up); the source stays oversized so
        // the mark keeps its edges on high-density screens.
        className="animate-logo-fade-in w-[120px] md:w-[140px] h-auto"
      />
    </div>
  );
}
