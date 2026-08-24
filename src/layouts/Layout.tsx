"use client";

import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import { useUiStore } from "@/store";
import { useLocaleStore } from "@/store/locale";
import Footer from "./Footer";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const { showSplashScreen, fadeOut, setShowSplashScreen, setFadeOut } =
    useUiStore();
  const hydrateLocale = useLocaleStore((state) => state.hydrateLocale);

  // The server can't see the language cookie, so it always renders English and
  // this pulls the visitor's saved choice back in on the first client paint.
  useEffect(() => {
    hydrateLocale();
  }, [hydrateLocale]);

  const handleSplashScreenFinish = () => {
    setFadeOut(true);
    setTimeout(() => setShowSplashScreen(false), 400);
  };

  useEffect(() => {
    if (pathname !== "/") {
      setShowSplashScreen(false);
      setFadeOut(true);
    }
  }, [pathname, setShowSplashScreen, setFadeOut]);

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      {showSplashScreen && <SplashScreen onFinish={handleSplashScreenFinish} />}
      <div
        className={`flex flex-col bg-transparent transition-opacity duration-500 ${
          showSplashScreen && !fadeOut
            ? "opacity-0 pointer-events-none"
            : "opacity-100"
        }`}
      >
        {/* Navbar is a direct child here on purpose: its sticky positioning is
            scoped to this container, which spans the whole page. */}
        <Navbar />
        <main className="flex-1 bg-transparent">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
