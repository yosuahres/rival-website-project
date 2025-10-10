"use client";

import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isShrunk, setIsShrunk] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShrunk(true);
    }, 500); // Delay for 500ms before starting the animation
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className={`green-container min-h-screen flex flex-col ${isShrunk ? 'animate-shrink' : ''}`}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
