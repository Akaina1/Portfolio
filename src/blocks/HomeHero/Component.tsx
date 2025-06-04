'use client';

import React, { useEffect, useState } from 'react';
import type { HomeHeroBlock as HomeHeroProps } from '@/payload-types';
import { CMSLink } from '@/components/Link';
import { AnimatedDivider } from '@/components/AnimatedDivider';

export const HomeHeroBlock: React.FC<HomeHeroProps> = ({
  mainText,
  dynamicText,
  links,
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const typingSpeed = 60;
  const deletingSpeed = 40;
  const delayBetweenTexts = 5000;

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        const fullText = dynamicText[currentTextIndex]?.text || '';

        if (isDeleting) {
          setDisplayText((prev) => prev.slice(0, -1));
          if (displayText.length === 0) {
            setIsDeleting(false);
            setCurrentTextIndex((prev) => (prev + 1) % dynamicText.length);
          }
        } else {
          setDisplayText((prev) => fullText.slice(0, prev.length + 1));
          if (displayText === fullText) {
            setTimeout(() => setIsDeleting(true), delayBetweenTexts);
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, dynamicText, currentTextIndex]);

  return (
    <div className="animate-pull-down container relative z-0 -mt-1 flex h-full flex-col items-center justify-center rounded-b-xl bg-white/50 p-4 pt-8 shadow-lg shadow-black/35 lg:pt-28 dark:bg-white/5">
      <h1 className="mb-6 text-start text-2xl font-bold text-black sm:text-4xl dark:text-white">
        {mainText}
      </h1>

      {/* Dynamic Typing Animation */}
      <div className="flex items-start text-lg font-semibold text-foreground sm:text-2xl">
        <span>{displayText}</span>
        <span className="animate-blink ml-0 text-gray-500">|</span>
      </div>

      {/* Call-to-Action Buttons */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {links?.map((cta, index) => (
          <CMSLink key={cta.id || index} {...cta.link} appearance="home-hero" />
        ))}
      </div>

      {/* Divider Line */}
      <AnimatedDivider className="mb-8 mt-3" />
    </div>
  );
};
