"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import NextImage from '@/components/NextImage';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const [isShrunk, setIsShrunk] = useState(pathname !== '/');

  useEffect(() => {
    if (pathname === '/') {
      const timer = setTimeout(() => {
        setIsShrunk(true);
      }, 50); 
      return () => clearTimeout(timer);
    } else {
      setIsShrunk(true);
    }
  }, [pathname]); 

  const isHomePage = pathname === '/';
  const isCompetitionPage = pathname.startsWith('/competitions/');

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      {isHomePage ? (
        <>
          <div className={`bg-[#1e5f4e] mx-6 mt-6 mb-6 rounded-3xl flex flex-col ${pathname === '/' && isShrunk ? 'animate-shrink' : 'h-[calc(100vh-3rem)]'}`}>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
          </div>
          <div className="mx-6 mb-6 rounded-3xl">
            <section className="py-16 px-8">
              <div className="max-w-[1400px] mx-auto">
                <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">Our Current Project</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg">
                    <NextImage
                      src="/images/ROVER1.png"
                      alt="Rover Robot 1"
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg">
                    <NextImage
                      src="/images/ROVER5.png"
                      alt="Rover Robot 5"
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
          <Footer />
        </>
      ) : isCompetitionPage ? (
        <div className="flex flex-col min-h-screen">
          <div className="bg-[#1e5f4e] w-full">
            <Navbar />
          </div>
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      ) : (
        <div className="flex flex-col min-h-screen">
          <div className="bg-[#1e5f4e] rounded-2xl mx-4 mt-4 w-[calc(100%-2rem)]">
            <Navbar />
          </div>
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      )}
    </div>
  );
}
