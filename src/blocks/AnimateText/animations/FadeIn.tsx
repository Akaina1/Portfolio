import React from 'react';
import type { AnimationProps } from './types';

/**
 * FadeIn Animation Component
 * Fades in text with a smooth transition
 */
const FadeIn: React.FC<AnimationProps> = ({ text }) => {
  return (
    <div className="duration-1000 animate-in fade-in">
      <span className="text-black dark:text-white">{text}</span>
    </div>
  );
};

export default FadeIn;
