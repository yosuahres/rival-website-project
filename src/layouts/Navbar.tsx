"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProjectsSubMenu, setIsProjectsSubMenu] = useState(false); // NEW

  return (
    <>
      <nav className="w-full fixed top-0 left-0 z-50 bg-[#23272f]/30 backdrop-blur-xl px-4 md:px-8 py-3">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="hover:opacity-80 transition-opacity flex items-center"
          >
            <Image
              src="/images/vertical.png"
              alt="RIVAL ITS Logo"
              width={50}
              height={30}
              className="object-contain"
              priority
            />
          </Link>

          {/* Hamburger icon for mobile */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-labelledby="mobile-menu-icon-title"
              >
                <title id="mobile-menu-icon-title">Mobile Menu Icon</title>
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Main navigation links - hidden on small, flex on medium and up */}
          <div className="hidden md:flex items-center gap-8">
            <div
              className="relative"
              onMouseEnter={() => setIsProjectsOpen(true)}
              onMouseLeave={() => setIsProjectsOpen(false)}
              role="none"
            >
              <button
                type="button"
                className="text-white hover:opacity-80 transition-opacity text-lg flex items-center gap-1 font-medium"
                aria-haspopup="true"
                aria-expanded={isProjectsOpen ? "true" : "false"}
              >
                Projects
                <svg
                  className={`w-4 h-4 transition-transform ${isProjectsOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-labelledby="projects-dropdown-icon"
                >
                  <title id="projects-dropdown-icon">Projects Dropdown</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isProjectsOpen && (
                <div
                  className="absolute top-full left-0 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 mt-2"
                  onMouseEnter={() => setIsProjectsOpen(true)}
                  onMouseLeave={() => setIsProjectsOpen(false)}
                  role="menu"
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

            <Link
              href="/teams"
              className="text-white hover:opacity-80 transition-opacity text-lg font-medium"
            >
              Our Team
            </Link>
            <Link
              href="/partners"
              className="text-white hover:opacity-80 transition-opacity text-lg font-medium"
            >
              Partnership
            </Link>
            <Link
              href="/contact"
              className="text-white hover:opacity-80 transition-opacity text-lg font-medium"
            >
              Contact Us
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="inline-block w-6 h-4 rounded overflow-hidden border border-white">
                <Image
                  src="https://flagcdn.com/w20/id.png"
                  alt="Polish"
                  width={25}
                  height={18}
                />
              </span>
              <span className="inline-block w-6 h-4 rounded overflow-hidden border border-white">
                <Image
                  src="https://flagcdn.com/w20/us.png"
                  alt="English"
                  width={25}
                  height={18}
                />
              </span>
            </div>
            <a
              href="https://instagram.com/rival_its"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:opacity-80"
            >
              <svg
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
                role="img"
                aria-labelledby="instagram-navbar-title"
              >
                <title id="instagram-navbar-title">Instagram</title>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/company/rival-its"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:opacity-80"
            >
              <svg
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
                role="img"
                aria-labelledby="linkedin-navbar-title"
              >
                <title id="linkedin-navbar-title">LinkedIn</title>
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.843-1.563 3.041 0 3.602 2.003 3.602 4.605v5.591z" />
              </svg>
            </a>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - full screen, black background */}
      {isMobileMenuOpen && !isProjectsSubMenu && (
        <div className="md:hidden fixed inset-0 z-[100] bg-black">
          {/* Logo and close button row, centered, same height as competition submenu */}
          <div className="flex items-center justify-between px-6 pt-6 pb-10">
            {/* Empty for spacing */}
            <div style={{ width: 32 }} />
            {/* Logo center */}
            <div className="flex-1 flex justify-center">
              <Image
                src="/images/vertical.png"
                alt="RIVAL ITS Logo"
                width={70}
                height={50}
                className="object-contain"
                priority
              />
            </div>
            {/* Close button */}
            <button
              type="button"
              className="text-white text-3xl"
              aria-label="Close menu"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              &times;
            </button>
          </div>
          <div className="flex flex-col items-end p-6 pt-6 space-y-8 h-full overflow-y-auto">
            <div className="flex flex-col items-end space-y-4 w-full">
              <div className="relative w-full flex flex-col items-end">
                <button
                  type="button"
                  className="text-white hover:opacity-80 transition-opacity text-2xl flex items-center gap-1 font-medium"
                  aria-haspopup="true"
                  aria-expanded={isProjectsOpen ? "true" : "false"}
                  onClick={() => setIsProjectsSubMenu(true)} // OPEN SUBMENU
                >
                  Projects
                  <svg
                    className="w-6 h-6 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    role="img"
                    aria-labelledby="projects-dropdown-icon-mobile"
                  >
                    <title id="projects-dropdown-icon-mobile">
                      Projects Dropdown
                    </title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
              <Link
                href="/teams"
                className="text-white hover:opacity-80 transition-opacity text-2xl font-medium text-right w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Our Team
              </Link>
              <Link
                href="/partners"
                className="text-white hover:opacity-80 transition-opacity text-2xl font-medium text-right w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Partnership
              </Link>
              <Link
                href="/contact"
                className="text-white hover:opacity-80 transition-opacity text-2xl font-medium text-right w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
            </div>
            <div className="flex items-center gap-4 mt-auto self-end">
              <div className="flex items-center gap-2">
                <span className="inline-block w-8 h-6 rounded overflow-hidden border border-white">
                  <Image
                    src="https://flagcdn.com/w20/id.png"
                    alt="Indonesian"
                    width={30}
                    height={20}
                  />
                </span>
                <span className="inline-block w-8 h-6 rounded overflow-hidden border border-white">
                  <Image
                    src="https://flagcdn.com/w20/us.png"
                    alt="English"
                    width={30}
                    height={20}
                  />
                </span>
              </div>
              <a
                href="https://instagram.com/rival_its"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:opacity-80"
              >
                <svg
                  width="30"
                  height="30"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-labelledby="instagram-navbar-title-mobile"
                >
                  <title id="instagram-navbar-title-mobile">Instagram</title>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/rival-its"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:opacity-80"
              >
                <svg
                  width="30"
                  height="30"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-labelledby="linkedin-navbar-title-mobile"
                >
                  <title id="linkedin-navbar-title-mobile">LinkedIn</title>
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.843-1.563 3.041 0 3.602 2.003 3.602 4.605v5.591z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Projects Sub-Menu Overlay */}
      {isMobileMenuOpen && isProjectsSubMenu && (
        <div className="md:hidden fixed inset-0 z-[110] bg-black flex h-full">
          {/* Right-sided drawer */}
          <div className="ml-auto w-full max-w-[90vw] sm:max-w-[400px] h-full flex flex-col">
            {/* Top bar with logo and close, centered */}
            <div className="flex items-center justify-between px-6 pt-6 pb-10">
              {/* Empty for spacing */}
              <div style={{ width: 32 }} />
              {/* Logo center */}
              <div className="flex-1 flex justify-center">
                <Image
                  src="/images/vertical.png"
                  alt="RIVAL ITS Logo"
                  width={70}
                  height={50}
                  className="object-contain"
                  priority
                />
              </div>
              {/* Close button */}
              <button
                type="button"
                className="text-white text-3xl"
                aria-label="Close menu"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsProjectsSubMenu(false);
                }}
              >
                &times;
              </button>
            </div>
            {/* Project links with Back as first item, right-aligned */}
            <div className="flex flex-col items-end px-6 space-y-8 mt-8">
              <button
                type="button"
                className="text-white text-2xl font-medium opacity-50 hover:opacity-80 transition-opacity flex items-center gap-2 justify-end w-full"
                onClick={() => setIsProjectsSubMenu(false)}
              >
                <span className="flex items-center gap-2">
                  <svg
                    width="28"
                    height="28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    role="img"
                    aria-labelledby="back-icon-title"
                  >
                    <title id="back-icon-title">Back Icon</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back
                </span>
              </button>
              <Link
                href="/competitions/indonesian-robot-contest"
                className="text-white text-3xl md:text-4xl font-medium hover:opacity-80 transition-opacity text-right w-full"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsProjectsSubMenu(false);
                }}
              >
                Indonesian Robot Contest
              </Link>
              <Link
                href="/competitions/european-rover-challenge"
                className="text-white text-3xl md:text-4xl font-medium hover:opacity-80 transition-opacity text-right w-full"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsProjectsSubMenu(false);
                }}
              >
                European Rover Challenge (Remote)
              </Link>
              <Link
                href="/competitions/australian-rover-challenge"
                className="text-white text-3xl md:text-4xl font-medium hover:opacity-80 transition-opacity text-right w-full"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsProjectsSubMenu(false);
                }}
              >
                Australian Rover Challenge
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
