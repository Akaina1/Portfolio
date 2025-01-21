'use client';

import React from 'react';
import { cn } from '@/utilities/cn';

interface AnimatedDividerProps {
  className?: string;
}

/**
 * AnimatedDivider Component
 * Renders a horizontal line with an animated glowing effect
 */
export const AnimatedDivider: React.FC<AnimatedDividerProps> = ({
  className,
}) => {
  return (
    <div className={cn('mx-auto w-full max-w-2xl', className)}>
      <div className="relative h-px w-full overflow-hidden">
        {/* Base Line */}
        <div className="absolute inset-0 bg-gray-300 dark:bg-gray-900" />

        {/* Animated Glow */}
        <div
          className={cn(
            'absolute h-full w-full',
            'bg-gradient-to-r from-transparent via-primary/60 to-transparent',
            'animate-dividerGlow'
          )}
        />
      </div>
    </div>
  );
};
