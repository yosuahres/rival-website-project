"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isShrunk, setIsShrunk] = useState(false);
  const pathname = usePathname(); // Get current pathname

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShrunk(true);
    }, 50); 
    return () => clearTimeout(timer);
  }, []);

  const isTeamsPage = pathname === '/teams';

  return (
    <div className="flex flex-col min-h-screen"> {/* Removed explicit background, allowing body background to show */}
      <div className={`flex flex-col ${isTeamsPage ? '' : 'green-container'} ${isShrunk ? 'animate-shrink' : ''}`}>
        {isTeamsPage ? (
          <div className="bg-[#1e5f4e] rounded-2xl mx-4 mt-4 w-[calc(100%-2rem)]"> {/* Green container for Navbar on teams page, curved and smaller */}
            <Navbar />
          </div>
        ) : (
          <Navbar />
        )}
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
