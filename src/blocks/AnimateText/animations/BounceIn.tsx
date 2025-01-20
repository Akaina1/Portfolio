'use client';
import React from 'react';
import type { AnimationProps } from './types';

/**
 * BounceIn Animation Component
 * Bounces each character in from above with a spring effect
 */
const BounceIn: React.FC<AnimationProps> = ({ text }) => {
  return (
    <div className="flex items-center justify-center">
      {text.split('').map((char, index) => (
        <span
          key={index}
          className="text-black dark:text-white"
          style={{
            display: 'inline-block',
            animation: `bounceInChar 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${index * 0.1}s forwards`,
            opacity: 0,
            transform: 'translateY(-50px) scale(0)',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
};

export default BounceIn;
