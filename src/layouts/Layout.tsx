"use client";

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import NextImage from '@/components/NextImage';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  // const isHomePage = pathname === '/';
  // const isCompetitionPage = pathname.startsWith('/competitions/');
  // const isContactPage = pathname === '/contact';

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <div className="flex flex-col bg-transparent">
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
