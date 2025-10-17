'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-[#23272f]/30 backdrop-blur-xl px-8 py-3">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <Link href="/" className="hover:opacity-80 transition-opacity flex items-center">
          <Image 
            src='/images/vertical.png'
            alt="RIVAL ITS Logo" 
            width={70} 
            height={50}
            className="object-contain"
            priority
          />
        </Link>

        <div className="flex items-center gap-8">
          <div
            className="relative"
            onMouseEnter={() => setIsProjectsOpen(true)}
            onMouseLeave={() => setIsProjectsOpen(false)}
          >
            <div>
              <button className="text-white hover:opacity-80 transition-opacity text-lg flex items-center gap-1 font-medium">
                Projects
                <svg className={`w-4 h-4 transition-transform ${isProjectsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            {isProjectsOpen && (
              <div
                className="absolute top-full left-0 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 mt-2"
                onMouseEnter={() => setIsProjectsOpen(true)}
                onMouseLeave={() => setIsProjectsOpen(false)}
              >
                <Link 
                  href="/competitions/indonesian-robot-contest"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  Indonesian Robot Contest
                </Link>
                <Link
                  href="/competitions/european-rover-challenge"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  European Rover Challenge (Remote)
                </Link>
                <Link 
                  href="/competitions/australian-rover-challenge"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  Australian Rover Challenge
                </Link>
              </div>
            )}
          </div>

          <Link href="/teams" className="text-white hover:opacity-80 transition-opacity text-lg font-medium">Our Team</Link>
          <Link href="/partners" className="text-white hover:opacity-80 transition-opacity text-lg font-medium">Partnership</Link>
{/* 
          <div
            className="relative"
            onMouseEnter={() => setIsAboutOpen(true)}
            onMouseLeave={() => setIsAboutOpen(false)}
          >
            <div>
              <button className="text-white hover:opacity-80 transition-opacity text-lg font-medium flex items-center gap-1">
                About us
                <svg className={`w-4 h-4 transition-transform ${isAboutOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            {isAboutOpen && (
              <div
                className="absolute top-full left-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 mt-2"
                onMouseEnter={() => setIsAboutOpen(true)}
                onMouseLeave={() => setIsAboutOpen(false)}
              >
                <Link href="/about" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors">About</Link>
                <Link href="/teams" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors">Our Team</Link>
              </div>
            )}
          </div> */}

          <Link href="/contact" className="text-white hover:opacity-80 transition-opacity text-lg font-medium">Contact</Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-block w-6 h-4 rounded overflow-hidden border border-white">
              <img src="https://flagcdn.com/w20/id.png" alt="Polish" width={25} height={18} />
            </span>
            <span className="inline-block w-6 h-4 rounded overflow-hidden border border-white">
              <img src="https://flagcdn.com/w20/us.png" alt="English" width={25} height={18} />
            </span>
          </div>
          {/* <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:opacity-80">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.6 0 0 .6 0 1.326v21.348C0 23.4.6 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.4 24 24 23.4 24 22.674V1.326C24 .6 23.4 0 22.675 0"/></svg>
          </a> */}
          <a href="https://instagram.com/rival_its" target="_blank" rel="noopener noreferrer" className="text-white hover:opacity-80">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          <a href="https://linkedin.com/company/rival-its" target="_blank" rel="noopener noreferrer" className="text-white hover:opacity-80">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.843-1.563 3.041 0 3.602 2.003 3.602 4.605v5.591z"/></svg>
          </a>
          <a href="mailto:official.krtmiits@gmail.com" className="text-white hover:opacity-80 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.749L12 10.724l9.615-6.903h.749c.904 0 1.636.732 1.636 1.636z"/>
            </svg>
          </a>
          {/* <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white hover:opacity-80">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.112C19.633 3.5 12 3.5 12 3.5s-7.633 0-9.386.574a2.994 2.994 0 0 0-2.112 2.112C0 7.939 0 12 0 12s0 4.061.502 5.814a2.994 2.994 0 0 0 2.112 2.112C4.367 20.5 12 20.5 12 20.5s7.633 0 9.386-.574a2.994 2.994 0 0 0 2.112-2.112C24 16.061 24 12 24 12s0-4.061-.502-5.814zM9.545 15.568V8.432l6.545 3.568-6.545 3.568z"/></svg>
          </a> */}
          {/* <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-white hover:opacity-80">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M23.954 0h-23.908c-.025 0-.046.021-.046.046v23.908c0 .025.021.046.046.046h23.908c.025 0 .046-.021.046-.046v-23.908c0-.025-.021-.046-.046-.046zm-6.616 7.292l-3.568 4.357-3.568-4.357h-2.771l5.354 6.537-5.354 6.537h2.771l3.568-4.357 3.568 4.357h2.771l-5.354-6.537 5.354-6.537h-2.771z"/></svg>
          </a> */}
        </div>
      </div>
    </nav>
  );
}
