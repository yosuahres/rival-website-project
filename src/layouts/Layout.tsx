"use client";

import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect } from "react";
import CadBackdrop from "@/components/CadBackdrop";
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

  // The crowdfunding section ships its own stripped-back header and footer
  // (see app/crowdfunding/layout.tsx), so the site bar and footer stand down
  // there rather than stacking two of each.
  const isCrowdfunding = pathname?.startsWith("/crowdfunding") ?? false;

  return (
    // Positioned so the backdrop below can span the whole page rather than the
    // viewport it happens to open on.
    <div className="relative flex flex-col min-h-screen bg-transparent">
      {showSplashScreen && <SplashScreen onFinish={handleSplashScreenFinish} />}
      {/* Sits under everything else, so the content wrapper below has to open
          its own stacking context to stay on top of it. It is anchored to this
          container, which is why the container is positioned. */}
      <CadBackdrop key={pathname} />
      <div
        className={`relative z-10 flex flex-col bg-transparent transition-opacity duration-500 ${
          showSplashScreen && !fadeOut
            ? "opacity-0 pointer-events-none"
            : "opacity-100"
        }`}
      >
        {/* Navbar is a direct child here on purpose: its sticky positioning is
            scoped to this container, which spans the whole page. */}
        {!isCrowdfunding && <Navbar />}
        <main className="flex-1 bg-transparent">{children}</main>
        {!isCrowdfunding && <Footer />}
      </div>
    </div>
  );
}
