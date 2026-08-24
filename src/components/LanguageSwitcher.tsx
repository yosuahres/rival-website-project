"use client";

import Image from "next/image";
import { LOCALES, useTranslation } from "@/i18n";

interface LanguageSwitcherProps {
  /** Mobile menu shows the flags larger than the desktop bar does. */
  size?: "sm" | "lg";
  className?: string;
}

const SIZES = {
  sm: { box: "w-6 h-4", width: 25, height: 18 },
  lg: { box: "w-8 h-6", width: 30, height: 20 },
} as const;

export default function LanguageSwitcher({
  size = "sm",
  className = "",
}: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useTranslation();
  const { box, width, height } = SIZES[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {LOCALES.map((option) => {
        const isActive = option.code === locale;
        return (
          <button
            key={option.code}
            type="button"
            onClick={() => setLocale(option.code)}
            aria-label={t("lang.switchTo", { language: option.label })}
            aria-pressed={isActive}
            title={option.label}
            // The inactive flag is dimmed rather than hidden, so the pair still
            // reads as a switch and the current language is obvious at a glance.
            className={`inline-block ${box} rounded overflow-hidden border transition-all duration-200 cursor-pointer hover:opacity-100 hover:scale-110 ${
              isActive
                ? "border-white opacity-100"
                : "border-white/40 opacity-50"
            }`}
          >
            <Image
              src={option.flag}
              alt={option.label}
              width={width}
              height={height}
              className="w-full h-full object-cover"
            />
          </button>
        );
      })}
    </div>
  );
}
