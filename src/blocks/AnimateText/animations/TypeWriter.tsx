'use client';
import React, { useEffect, useState } from 'react';
import type { AnimationProps } from './types';

/**
 * TypeWriter Animation Component
 * Creates a typewriter effect for text that matches the HomeHero implementation
 */
const TypeWriter: React.FC<AnimationProps> = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const typingSpeed = 60;
  const deletingSpeed = 40;
  const delayBetweenTexts = 5000;

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        if (isDeleting) {
          setDisplayText((prev) => prev.slice(0, -1));
          if (displayText.length === 0) {
            setIsDeleting(false);
          }
        } else {
          setDisplayText((prev) => text.slice(0, prev.length + 1));
          if (displayText === text) {
            setTimeout(() => setIsDeleting(true), delayBetweenTexts);
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, text]);

  return (
    <div>
      <span className="text-black dark:text-white">{displayText}</span>
      <span className="animate-blink ml-0 text-gray-300">|</span>
    </div>
  );
};

export default TypeWriter;
