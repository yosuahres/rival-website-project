"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFalling, setIsFalling] = useState(true);

  useEffect(() => {
    const fallTimer = setTimeout(() => {
      setIsFalling(false);
      const fadeTimer = setTimeout(() => {
        setIsVisible(false);
        const finishTimer = setTimeout(() => {
          onFinish();
        }, 600);
        return () => clearTimeout(finishTimer);
      }, 700);
      return () => clearTimeout(fadeTimer);
    }, 700);

    return () => clearTimeout(fallTimer);
  }, [onFinish]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-700 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <Image
        src="/images/vertical.png"
        alt="Logo"
        width={200}
        height={200}
        className={`transition-transform duration-700 ease-out ${
          isFalling ? "animate-fall" : "translate-y-0"
        }`}
      />
    </div>
  );
}
