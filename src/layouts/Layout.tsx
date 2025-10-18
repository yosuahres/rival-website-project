"use client";

import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import Footer from "./Footer";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const [showSplashScreen, setShowSplashScreen] = useState(pathname === "/");
  const [fadeOut, setFadeOut] = useState(false);

  const handleSplashScreenFinish = () => {
    setFadeOut(true);
    setTimeout(() => setShowSplashScreen(false), 400);
  };

  useEffect(() => {
    if (pathname !== "/") {
      setShowSplashScreen(false);
      setFadeOut(true);
    }
  }, [pathname]);

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
        <div className="text-gray-800 rounded-2xl bg-transparent">
          <Navbar />
        </div>
        <main className="flex-1 min-h-screen bg-transparent">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
