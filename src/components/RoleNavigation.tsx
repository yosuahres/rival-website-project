'use client';

import React, { useState, useEffect, useRef } from 'react';

interface RoleNavigationProps {
  roles: string[];
}

export default function RoleNavigation({ roles }: RoleNavigationProps) {
  const [activeRole, setActiveRole] = useState(
    roles[0]?.replace(/\s+/g, '-') || ''
  );
  const navRef = useRef<HTMLDivElement | null>(null);

  const [isFixed, setIsFixed] = useState(false);
  const [left, setLeft] = useState<number | null>(null);
  const [width, setWidth] = useState<number | null>(null);
  const [originalTop, setOriginalTop] = useState<number | null>(null); 

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);

      if (visibleEntries.length > 0) {
        visibleEntries.sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
        );
        setActiveRole(visibleEntries[0].target.id);
      }
    }, observerOptions);

    roles.forEach((role) => {
      const element = document.getElementById(role.replace(/\s+/g, '-'));
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      roles.forEach((role) => {
        const element = document.getElementById(role.replace(/\s+/g, '-'));
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [roles]);

  useEffect(() => {
    const navElement = navRef.current;
    if (!navElement) return;

    const updateGeometry = () => {
      if (!navRef.current) return;
      const rect = navRef.current.getBoundingClientRect();
      setOriginalTop(window.scrollY + rect.top);
      setLeft(rect.left);
      setWidth(navRef.current.offsetWidth);
    };

    updateGeometry();

    const handleScroll = () => {
      if (originalTop === null) return;
      setIsFixed(window.scrollY > originalTop - 24);
    };

    const handleResize = () => {
      setIsFixed(false);
      setTimeout(updateGeometry, 0);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [originalTop]);

  return (
    <div
      ref={navRef}
      style={isFixed && left !== null ? { left: left, width: width } : undefined}
      className={`w-full pr-4 ${
        isFixed ? 'fixed top-24 z-40' : 'sticky top-96'
      } max-h-screen overflow-y-auto hidden md:block`}
    >
      <h2 className="text-white font-bold text-2xl mb-4">Roles</h2>

      <ul className="space-y-2">
        {roles.map((role) => {
          const roleId = role.replace(/\s+/g, '-');
          const isActive = activeRole === roleId;

          return (
            <li key={role}>
              <a
                href={`#${roleId}`}
                className={`
                  flex items-center space-x-3 p-3 rounded-lg 
                  cursor-pointer transition-all duration-200 
                  group hover:bg-white/10
                  ${isActive ? 'bg-green-400/20' : 'bg-transparent'}
                `}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById(roleId)
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span
                  className={`
                    w-2.5 h-2.5 rounded-full transition-all duration-200
                    ${
                      isActive
                        ? 'bg-green-400'
                        : 'bg-white/50 group-hover:bg-white'
                    }
                  `}
                ></span>

                <span
                  className={`
                    capitalize transition-all duration-200
                    ${
                      isActive
                        ? 'font-bold text-green-400'
                        : 'text-white/80 group-hover:text-white'
                    }
                  `}
                >
                  {role}
                </span>
              </a>
            </li>
          );
        })}
      </ul>

    </div>
  );
}