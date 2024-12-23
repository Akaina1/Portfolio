'use client';

import React, { useState } from 'react';

import type { Header as HeaderType } from '@/payload-types';
import { Menu, X } from 'lucide-react';
import { CMSLink } from '@/components/Link';

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems = data?.navItems || [];

  return (
    <nav className="relative">
      {/* Desktop Navigation */}
      <div className="hidden items-center gap-10 md:flex">
        {navItems.map(({ link }, i) => {
          return <CMSLink key={i} {...link} appearance="link" />;
        })}
      </div>

      {/* Mobile Hamburger Button */}
      <button
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
        <div className="absolute left-0 top-full w-48 rounded-lg bg-background py-2 shadow-lg md:hidden">
          {navItems.map(({ link }, i) => (
            <div key={i} className="px-4 py-2">
              <CMSLink {...link} appearance="link" />
            </div>
          ))}
        </div>
      )}
    </nav>
  );
};
