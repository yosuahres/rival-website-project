'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isCompetitionsOpen, setIsCompetitionsOpen] = useState(false);
  const pathname = usePathname();

  const isSpecialPage = pathname === '/' || pathname.startsWith('/competitions') || pathname === '/contact';
  const textColorClass = isSpecialPage ? 'text-white' : 'text-[#1e5f4e]';
  const logo = isSpecialPage ? '/images/vertical.png' : '/images/verticalblack.png';

  return (
    <nav className="w-full px-8 py-6">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        {/* Left Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className={`${textColorClass} hover:opacity-80 transition-opacity text-lg font-bold`}>
            Home
          </Link>
          <Link href="/about" className={`${textColorClass} hover:opacity-80 transition-opacity text-lg font-bold`}>
            About
          </Link>
          <Link href="/teams" className={`${textColorClass} hover:opacity-80 transition-opacity text-lg font-bold`}>
            Our Team
          </Link>
        </div>

        {/* Center Logo */}
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image 
            src={logo} 
            alt="RIVAL ITS Logo" 
            width={90} 
            height={20}
            className="object-contain"
            priority
          />
        </Link>

        {/* Right Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/partners" className={`${textColorClass} hover:opacity-80 transition-opacity text-lg font-bold`}>
            Partners
          </Link>
          
          {/* Competitions Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsCompetitionsOpen(true)}
            onMouseLeave={() => setIsCompetitionsOpen(false)}
          >
            <button className={`${textColorClass} hover:opacity-80 transition-opacity text-lg font-bold flex items-center gap-1`}>
              Competitions
              <svg className={`w-4 h-4 transition-transform ${isCompetitionsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isCompetitionsOpen && (
              <>
                <div className="absolute top-full left-0 w-64 h-2 z-40"></div>
                <div className="absolute top-full left-0 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 mt-2">
                  <Link 
                    href="/competitions/indonesian-robot-contest"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                  >
                    Indonesian Robot Contest
                  </Link>
                  <Link 
                    href="/competitions/australian-rover-challenge"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                  >
                    Australian Rover Challenge
                  </Link>
                </div>
              </>
            )}
          </div>
          
          <Link href="/contact" className={`${textColorClass} hover:opacity-80 transition-opacity text-lg font-bold`}>
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
