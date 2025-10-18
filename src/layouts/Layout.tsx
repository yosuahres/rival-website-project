"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import NextImage from '@/components/NextImage';
import SplashScreen from '@/components/SplashScreen';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const [showSplashScreen, setShowSplashScreen] = useState(pathname === '/');
  const [fadeOut, setFadeOut] = useState(false);

  const handleSplashScreenFinish = () => {
    setFadeOut(true);
    setTimeout(() => setShowSplashScreen(false), 400);
  };

  useEffect(() => {
    if (pathname !== '/') {
      setShowSplashScreen(false);
      setFadeOut(true);
    }
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      {showSplashScreen && <SplashScreen onFinish={handleSplashScreenFinish} />}
      <div
        className={`flex flex-col bg-transparent transition-opacity duration-500 ${
          showSplashScreen && !fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="text-gray-800 rounded-2xl bg-transparent">
          <Navbar />
        </div>
        <main className="flex-1 min-h-screen bg-transparent">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
