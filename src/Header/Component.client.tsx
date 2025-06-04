'use client';
import { useHeaderTheme } from '@/providers/HeaderTheme';
import { useTheme } from '@/providers/Theme';
import React, { useEffect, useState } from 'react';

import type { Header } from '@/payload-types';

import { HeaderNav } from './Nav';
import Image from 'next/image';

interface HeaderClientProps {
  data: Header;
}

/**
 * Desktop hover animation constants
 */
const DESKTOP_PROFILE_HOVER_SCALE = 5;
const DESKTOP_PROFILE_HOVER_Y_OFFSET = 60; // Moves down on desktop

/**
 * Mobile hover/tap animation constants
 */
const MOBILE_PROFILE_HOVER_SCALE = 5;
const MOBILE_PROFILE_HOVER_Y_OFFSET = -80; // Moves up on mobile (negative value)
const MOBILE_PROFILE_HOVER_X_OFFSET = 40; // Moves right on mobile

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const { headerTheme, setHeaderTheme } = useHeaderTheme();
  const { theme: globalTheme } = useTheme();

  // Handle theme synchronization
  useEffect(() => {
    setHeaderTheme(globalTheme ?? null);
  }, [globalTheme, setHeaderTheme]);

  // Handle theme updates
  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme);
  }, [headerTheme, theme]);

  // Detect mobile viewport
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  /**
   * Handle mouse enter event with different behavior for mobile vs desktop
   */
  const handleMouseEnter = (e: React.MouseEvent<HTMLImageElement>) => {
    const scale = isMobile
      ? MOBILE_PROFILE_HOVER_SCALE
      : DESKTOP_PROFILE_HOVER_SCALE;
    const yOffset = isMobile
      ? MOBILE_PROFILE_HOVER_Y_OFFSET
      : DESKTOP_PROFILE_HOVER_Y_OFFSET;
    const xOffset = isMobile ? MOBILE_PROFILE_HOVER_X_OFFSET : 0;

    e.currentTarget.style.setProperty('--tw-scale-x', scale.toString());
    e.currentTarget.style.setProperty('--tw-scale-y', scale.toString());
    e.currentTarget.style.setProperty('--tw-translate-y', `${yOffset}px`);
    e.currentTarget.style.setProperty('--tw-translate-x', `${xOffset}px`);
  };

  /**
   * Handle mouse leave event - reset all transforms
   */
  const handleMouseLeave = (e: React.MouseEvent<HTMLImageElement>) => {
    e.currentTarget.style.setProperty('--tw-scale-x', '1');
    e.currentTarget.style.setProperty('--tw-scale-y', '1');
    e.currentTarget.style.setProperty('--tw-translate-y', '0px');
    e.currentTarget.style.setProperty('--tw-translate-x', '0px');
  };

  return (
    <header
      className="fixed bottom-0 z-40 w-full self-center rounded-b-xl bg-background shadow-lg md:sticky md:top-0 md:rounded-b-xl lg:max-w-8xl dark:drop-shadow-dark-outline"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="container mx-auto px-4">
        <nav className="flex h-16 items-center justify-between md:justify-center lg:justify-between">
          {/* Profile icon with hover animation */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full md:hidden lg:flex">
            <Image
              src="/media/profile.png"
              alt="Profile"
              width={300}
              height={300}
              className="sm:hover:scale-130 h-6 w-6 rounded-full object-cover transition-transform duration-300 ease-in-out hover:scale-125 sm:h-8 sm:w-8"
              style={
                {
                  '--tw-scale-x': '1',
                  '--tw-scale-y': '1',
                  '--tw-translate-y': '0px',
                  '--tw-translate-x': '0px',
                } as React.CSSProperties
              }
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          </div>

          {/* HeaderNav - on mobile it appears after profile icon */}
          <div className="order-last lg:order-first">
            <HeaderNav data={data} />
          </div>
        </nav>
      </div>
    </header>
  );
};
