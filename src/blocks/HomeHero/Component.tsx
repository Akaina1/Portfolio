'use client';

import React, { useEffect, useState } from 'react';
import type { HomeHeroBlock as HomeHeroProps } from '@/payload-types'; // Adjust the import path based on your project structure.
import { CMSLink } from '@/components/Link';

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
    <div className="container mt-0 flex h-full flex-col items-center justify-center rounded-xl bg-black/5 p-4 shadow-lg shadow-black/35 lg:mt-12">
      {/* Static Opening Text */}
      <h1 className="mb-6 text-start text-2xl font-bold text-white sm:text-4xl">
        {mainText}
      </h1>

      {/* Dynamic Typing Animation */}
      <div className="flex items-start text-lg font-semibold text-white sm:text-2xl">
        <span>{displayText}</span>
        <span className="animate-blink ml-0 text-gray-500">|</span>
      </div>

      {/* Call-to-Action Buttons */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {links?.map((cta, index) => (
          <CMSLink
            key={cta.id || index}
            {...cta.link}
            className={`font-semibold ${
              cta.link.appearance === 'outline'
                ? 'border border-white text-white transition hover:bg-white hover:text-black'
                : 'bg-white text-black transition hover:bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
