import { getCachedGlobal } from '@/utilities/getGlobals';
import React from 'react';

import type { Footer } from '@/payload-types';

import { ThemeSelector } from '@/providers/Theme/ThemeSelector';
import { CMSLink } from '@/components/Link';

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)();

  const navItems = footerData?.navItems || [];

  return (
    <footer className="mt-auto hidden border-t-2 border-gray-500/40 bg-background md:block dark:border-gray-900/40">
      <div className="container flex flex-row gap-8 py-2">
        <div className="flex flex-row items-center gap-4">
          <ThemeSelector />
          <nav className="flex flex-row gap-4">
            {navItems.map(({ link }, i) => {
              return (
                <CMSLink
                  className="text-black dark:text-white"
                  key={i}
                  {...link}
                />
              );
            })}
          </nav>
        </div>
      </div>
    </footer>
  );
}
