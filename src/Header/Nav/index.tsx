'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { Header as HeaderType } from '@/payload-types';
import type { Page, Post } from '@/payload-types';
import { Menu, X } from 'lucide-react';
import { CMSLink } from '@/components/Link';
import { usePathname } from 'next/navigation';

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const underlineRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);

  // Memoize navItems to prevent unnecessary re-renders
  const navItems = useMemo(() => data?.navItems || [], [data?.navItems]);

  // Determine active nav item based on current pathname
  useEffect(() => {
    const normalizedCurrentPath = pathname.replace(/^\/|\/$/g, ''); // Remove leading and trailing slashes

    const currentIndex = navItems.findIndex((item) => {
      // Get the path based on link type
      let itemPath = '';

      if (item.link.type === 'custom') {
        itemPath = item.link.url || '';
      } else if (item.link.type === 'reference' && item.link.reference) {
        const reference = item.link.reference;
        // Handle both string and object references
        if (typeof reference.value === 'string') {
          itemPath = reference.value;
        } else {
          // Handle Page or Post types
          const value = reference.value as Page | Post;
          itemPath = value.slug || '';
        }
      }

      // Normalize the item path
      const normalizedItemPath = itemPath.replace(/^\/|\/$/g, '');

      // Special case for home page
      if (
        normalizedCurrentPath === '' &&
        (normalizedItemPath === '' || normalizedItemPath === 'home')
      ) {
        return true;
      }

      // Check for exact match first
      if (normalizedCurrentPath === normalizedItemPath) {
        return true;
      }

      // Check for nested routes
      if (
        normalizedItemPath &&
        normalizedCurrentPath.startsWith(`${normalizedItemPath}/`)
      ) {
        return true;
      }

      return false;
    });

    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [pathname, navItems]);

  // Update underline position
  useEffect(() => {
    const currentIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;
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
        className="relative hidden items-center gap-20 md:flex md:gap-10"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setHoveredIndex(null);
          if (underlineRef.current) {
            const currentElement = navItemRefs.current[activeIndex];
            if (!currentElement) return;

            const { width, left } = currentElement.getBoundingClientRect();
            const parentElement = currentElement.parentElement as HTMLElement;
            const parentLeft = parentElement?.getBoundingClientRect().left || 0;

            underlineRef.current.style.width = `${width}px`;
            underlineRef.current.style.transform = `translateX(${left - parentLeft}px)`;
          }
        }}
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
                  className="absolute h-full w-full animate-dividerGlow bg-gradient-to-r from-transparent via-primary/60 to-transparent"
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

      {/* Mobile Menu Pullup */}
      {isMobileMenuOpen && (
        <div
          ref={menuRef}
          className="animate-duration-800 absolute bottom-full right-0 w-48 animate-fade-up rounded-xl bg-background py-2 text-center shadow-lg animate-delay-0 animate-once animate-ease-in-out md:hidden"
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
