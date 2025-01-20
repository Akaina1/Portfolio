'use client';
import React from 'react';
import type { AnimationProps } from './types';

/**
 * Wave Animation Component
 * Creates a wave effect by animating each character individually
 */
const Wave: React.FC<AnimationProps> = ({ text }) => {
  return (
    <div className="flex items-center justify-center">
      {text.split('').map((char, index) => (
        <span
          key={index}
          className="text-black dark:text-white"
          style={{
            display: 'inline-block',
            animation: `wave 1s ease-in-out ${index * 0.1}s infinite`,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
};

export default Wave;
