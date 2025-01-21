'use client';

import React, { useState, useRef, useEffect } from 'react';

import type { Header as HeaderType } from '@/payload-types';
import { Menu, X } from 'lucide-react';
import { CMSLink } from '@/components/Link';

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const underlineRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navItems = data?.navItems || [];

  // Update underline position
  useEffect(() => {
    const currentIndex = hoveredIndex ?? activeIndex;
    if (currentIndex === null || !underlineRef.current) return;

    const currentElement = navItemRefs.current[currentIndex];
    if (!currentElement) return;

    const { width, left } = currentElement.getBoundingClientRect();
    const parentElement = currentElement.parentElement as HTMLElement;
    const parentLeft = parentElement?.getBoundingClientRect().left || 0;

    underlineRef.current.style.width = `${width}px`;
    underlineRef.current.style.transform = `translateX(${left - parentLeft}px)`;
  }, [hoveredIndex, activeIndex]);

  // Handle clicks outside the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!navContainerRef.current) return;
    const containerRect = navContainerRef.current.getBoundingClientRect();
    if (e.clientX >= containerRect.left && e.clientX <= containerRect.right) {
      // Mouse position relative to container
      const relativeX = e.clientX - containerRect.left;

      // Find which nav items we're between
      navItemRefs.current.forEach((item, index) => {
        if (!item) return;
        const rect = item.getBoundingClientRect();
        if (
          relativeX >= rect.left - containerRect.left &&
          relativeX <= rect.right - containerRect.left
        ) {
          setHoveredIndex(index);
        }
      });
    }
  };

  // Handle menu item click
  const handleMenuItemClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="relative">
      {/* Desktop Navigation */}
      <div
        ref={navContainerRef}
        className="relative hidden items-center gap-20 md:flex"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {navItems.map(({ link }, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) {
                navItemRefs.current[i] = el;
              }
            }}
            className="relative py-2"
            onMouseEnter={() => setHoveredIndex(i)}
            onClick={() => setActiveIndex(i)}
          >
            <CMSLink {...link} appearance="nav-link" />
          </div>
        ))}
        <div
          ref={underlineRef}
          className="absolute bottom-0 transition-all duration-300 ease-in-out"
          style={{ width: 0 }}
        >
          <div className="relative">
            {/* Primary line - solid */}
            <div
              className="mx-auto h-0.5 w-[88%] bg-primary/80 transition-transform duration-300"
              style={{
                transform:
                  hoveredIndex !== null ? 'translateY(-12px)' : 'translateY(0)',
              }}
            />

            {/* Multiple expanding lines with glow */}
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="absolute bottom-0 mt-0.5 h-[1px] w-full origin-center overflow-hidden transition-all duration-500"
                style={{
                  transform:
                    hoveredIndex !== null ? 'scaleX(1.2)' : 'scaleX(0)',
                  transitionDelay:
                    hoveredIndex !== null ? `${index * 50}ms` : '0ms',
                  opacity: hoveredIndex !== null ? 1 - index * 0.15 : 0,
                  width: `${80 + index * 5}%`,
                  marginLeft: `${(100 - (80 + index * 5)) / 2}%`,
                  bottom: `${(3 - index) * 3}px`,
                }}
              >
                {/* Base line */}
                <div className="absolute inset-0 bg-primary/40" />
                {/* Animated glow effect */}
                <div
                  className="animate-dividerGlow absolute h-full w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                  style={{
                    animationDelay: `-${index * 0.5}s`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Hamburger Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="p-2 md:hidden"
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-black dark:text-white" />
        ) : (
          <Menu className="h-6 w-6 text-black dark:text-white" />
        )}
      </button>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div
          ref={menuRef}
          className="absolute left-0 top-full w-48 rounded-lg bg-background py-2 shadow-lg md:hidden"
        >
          {navItems.map(({ link }, i) => (
            <div key={i} className="px-4 py-2" onClick={handleMenuItemClick}>
              <CMSLink {...link} appearance="link" />
            </div>
          ))}
        </div>
      )}
    </nav>
  );
};
