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
  const navItems = data?.navItems || [];

  // Update underline position
  useEffect(() => {
    const currentIndex = hoveredIndex ?? activeIndex;
    if (currentIndex === null || !underlineRef.current) return;

    const currentElement = navItemRefs.current[currentIndex];
    if (!currentElement) return;

    const { width, left } = currentElement.getBoundingClientRect();
    const parentLeft =
      currentElement.parentElement?.getBoundingClientRect().left || 0;

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

  // Handle menu item click
  const handleMenuItemClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="relative">
      {/* Desktop Navigation */}
      <div className="relative hidden items-center gap-10 md:flex">
        {navItems.map(({ link }, i) => {
          return (
            <div
              key={i}
              ref={(el) => {
                if (el) {
                  navItemRefs.current[i] = el;
                }
              }}
              className="relative py-2"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setActiveIndex(i)}
            >
              <CMSLink {...link} appearance="nav-link" />
            </div>
          );
        })}
        <div
          ref={underlineRef}
          className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-in-out"
          style={{ width: 0 }}
        />
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
