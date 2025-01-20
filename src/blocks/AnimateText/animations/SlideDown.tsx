import React from 'react';
import type { AnimationProps } from './types';

/**
 * SlideDown Animation Component
 * Slides text down from top with fade
 */
const SlideDown: React.FC<AnimationProps> = ({ text }) => {
  return (
    <div className="duration-1000 animate-in fade-in slide-in-from-top-20">
      <span className="text-black dark:text-white">{text}</span>
    </div>
  );
};

export default SlideDown;
