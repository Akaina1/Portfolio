import React from 'react';
import type { AnimateTextBlock } from '@/payload-types';

/**
 * Map of animation components
 * Each animation will be implemented in a separate file and imported here
 */
const AnimationComponents: Record<
  AnimateTextBlock['animation'],
  React.FC<{
    text: string;
  }>
> = {
  fadeIn: React.lazy(() => import('./animations/FadeIn')),
  typeWriter: React.lazy(() => import('./animations/TypeWriter')),
  slideUp: React.lazy(() => import('./animations/SlideUp')),
  slideDown: React.lazy(() => import('./animations/SlideDown')),
  bounceIn: React.lazy(() => import('./animations/BounceIn')),
  wave: React.lazy(() => import('./animations/Wave')),
};

/**
 * AnimateText Component
 * Renders text with specified animation effect
 *
 * @param {AnimateTextBlock} props - Component properties from Payload CMS
 * @returns {React.ReactElement} Rendered component
 */
export const AnimateText: React.FC<AnimateTextBlock> = ({
  text,
  animation,
  placement,
}) => {
  // Ensure animation is valid
  if (!animation || !(animation in AnimationComponents)) {
    // Fallback to regular text if animation is invalid
    return (
      <div className={`animate-text-fallback container ${placement}`}>
        <span>{text}</span>
      </div>
    );
  }

  // Dynamically load the appropriate animation component
  const AnimationComponent = AnimationComponents[animation];

  return (
    <React.Suspense
      fallback={
        <div className={`animate-text-loading container ${placement}`}>
          <span>{text}</span>
        </div>
      }
    >
      <div className={`animate-text-container container ${placement}`}>
        <AnimationComponent text={text} />
      </div>
    </React.Suspense>
  );
};

export default AnimateText;
