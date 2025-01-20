import React from 'react';
import type { AnimationProps } from './types';

/**
 * SlideUp Animation Component
 * Slides text up from bottom with fade
 */
const SlideUp: React.FC<AnimationProps> = ({ text }) => {
  return (
    <div className="duration-1000 animate-in fade-in slide-in-from-bottom-20">
      <span className="text-black dark:text-white">{text}</span>
    </div>
  );
};

export default SlideUp;
