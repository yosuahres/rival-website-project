"use client";
import React, { useEffect, useRef, useState } from "react";
import type { Metadata } from "next";
import NextImage from '@/components/NextImage';

const metadata: Metadata = {
  title: "Our Sponsors and Supporters",
  description: "Meet the amazing sponsors and supporters who help RIVAL ITS achieve excellence in robotics competition.",
};

function FadeIn({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-opacity duration-700 ease-out will-change-opacity ${
        visible ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function Sponsors() {
  return (
    <>
      <section className="py-20 mt-10">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 pt-8 md:pt-12">
          <h1 className="text-white text-5xl font-bold mb-16">
            Our sponsors
          </h1>
        </div>

        <div
          className="w-full py-12 md:py-16"
          style={{
            backgroundColor: 'rgba(11, 18, 32, 0.5)', 
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)'
          }}
        >
          <div className="mx-auto max-w-6xl px-6 sm:px-8">
            <div className="min-h-[120px] md:min-h-[160px] flex items-center">
              <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
                <div className="col-span-1 md:col-span-1 lg:col-span-2 flex items-center justify-center">
                  <FadeIn>
                    <NextImage
                      src="/sponsors/indahpuri.png"
                      alt="Aisler"
                      width={320}
                      height={160}
                      className="w-[120px] md:w-[180px] lg:w-[240px] max-w-full h-auto"
                    />
                  </FadeIn>
                </div>

                <div className="col-span-1 md:col-span-1 lg:col-span-2 flex items-center justify-center">
                  <FadeIn>
                    <NextImage
                      src="/sponsors/indahpuri.png"
                      alt="IKOMA ITS"
                      width={320}
                      height={160}
                      className="w-[120px] md:w-[180px] lg:w-[240px] max-w-full h-auto"
                    />
                  </FadeIn>
                </div>

                <div className="col-span-1 md:col-span-1 lg:col-span-2 flex items-center justify-center">
                  <FadeIn>
                    <NextImage
                      src="/sponsors/indahpuri.png"
                      alt="Akhishop"
                      width={320}
                      height={160}
                      className="w-[120px] md:w-[180px] lg:w-[240px] max-w-full h-auto"
                    />
                  </FadeIn>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-6"> 
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-white text-4xl font-bold mb-8">Become a sponsor</h2>
            <h3 className="text-white text-xl font-semibold mb-4">WHAT DO WE OFFER?</h3>
            <p className="text-gray-100 leading-relaxed mb-8">
              We offer four different sponsorship packages: WILDAN, WILDAN, WILDAN, WILDAN. 
              Each one has been carefully designed to provide unique benefits tailored to the needs of our partners. 
              Depending on the chosen package, sponsors can expect a variety of promotional opportunities, 
              including the addition of promotional materials to the club's social media, logo exposure on promotional
            </p>
            <a
              href="/contact"
              aria-label="Email RIVAL ITS to become a sponsor"
              className="inline-block bg-[#FFD700] text-black font-bold py-3 px-8 rounded-lg hover:bg-[#E0B800] transition duration-300 mb-8"
            >
              EMAIL US!
            </a>
            <div className="flex space-x-6 text-gray-400">
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
                </div>
              </div>

          <div className="relative flex items-center justify-center lg:justify-end mt-16">
            <div className="absolute inset-0 flex justify-center lg:justify-end items-center space-x-4">
              <div className="inline-block overflow-hidden">
                <img src="/images/foreground-arc.png" alt="current projects" style={{ maxWidth: '100%', height: 'auto', display: 'block' }} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
