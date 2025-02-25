'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { cn } from '@/utilities/cn';
import type { HighlightTextBlock as HighlightTextBlockType } from '@/payload-types';

/**
 * Constants for performance optimization
 */
const CONSTANTS = {
  HIGHLIGHT_SPEED_MULTIPLIER: 1,
  VIEWPORT_TRIGGER_POINT: 0.8,
  SCROLL_RANGE_MULTIPLIER: 1.18,
  SMOOTHING_FACTOR: 0.1,
  SCROLL_THROTTLE_MS: 16, // ~60fps
} as const;

/**
 * Word component extracted for better performance
 */
const Word = React.memo(
  ({
    word,
    shouldHighlight,
    baseColorLight,
    baseColorDark,
    highlightStyleLight,
    highlightStyleDark,
  }: {
    word: string;
    shouldHighlight: boolean;
    baseColorLight: string;
    baseColorDark: string;
    highlightStyleLight: string;
    highlightStyleDark: string;
  }) => {
    const isSimpleColor = (style: string) => !style.includes(' ');

    return (
      <span className="relative mb-0 inline-block leading-loose tracking-wide lg:mb-3">
        <span
          className={cn(
            'will-change-opacity absolute inset-0 transition-opacity duration-1000',
            `text-${baseColorLight} text-opacity-60 dark:text-${baseColorDark} dark:text-opacity-60`,
            shouldHighlight ? 'opacity-0' : 'opacity-100'
          )}
        >
          <span className="drop-shadow-light dark:drop-shadow-dark-outline">
            {word}
          </span>
        </span>
        <span
          className={cn(
            'will-change-opacity transition-opacity duration-1000',
            shouldHighlight ? 'opacity-100' : 'opacity-0'
          )}
        >
          <span className="dark:hidden">
            <span
              className={cn(
                'drop-shadow-light',
                isSimpleColor(highlightStyleLight)
                  ? `text-${highlightStyleLight}`
                  : highlightStyleLight
              )}
            >
              {word}
            </span>
          </span>
          <span className="hidden dark:block">
            <span
              className={cn(
                isSimpleColor(highlightStyleDark)
                  ? `text-${highlightStyleDark}`
                  : highlightStyleDark
              )}
            >
              {word}
            </span>
          </span>
        </span>
      </span>
    );
  }
);

Word.displayName = 'Word';

/**
 * A text block component that highlights words sequentially as the user scrolls.
 * Uses intersection observer and requestAnimationFrame for smooth scroll-based animations.
 *
 * @component
 * @param {HighlightTextBlockType} props - Component props
 * @param {string} props.text - The text content to be displayed and highlighted
 * @param {string} props.baseColorLight - Base text color in light mode
 * @param {string} props.baseColorDark - Base text color in dark mode
 * @param {string} props.highlightStyleLight - Highlight style/color in light mode
 * @param {string} props.highlightStyleDark - Highlight style/color in dark mode
 *
 * @example
 * ```tsx
 * <HighlightTextBlock
 *   text="Sample highlight text"
 *   baseColorLight="gray-600"
 *   baseColorDark="gray-400"
 *   highlightStyleLight="blue-500"
 *   highlightStyleDark="blue-300"
 * />
 * ```
 */
export const HighlightTextBlock: React.FC<HighlightTextBlockType> = (props) => {
  const {
    text,
    baseColorLight,
    baseColorDark,
    highlightStyleLight,
    highlightStyleDark,
  } = props;

  // Memoize word splitting
  const words = useMemo(() => text.split(/(\s+)/), [text]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [currentProgressIndex, setCurrentProgressIndex] = useState<number>(-1);
  const lastScrollTime = useRef<number>(0);

  // Memoize non-empty word indices
  const nonEmptyWordIndices = useMemo(
    () =>
      words
        .map((word, index) => (word.trim() ? index : -1))
        .filter((index) => index !== -1),
    [words]
  );

  const targetProgressRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  // Optimized scroll handler with intersection observer
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        const now = performance.now();
        if (now - lastScrollTime.current < CONSTANTS.SCROLL_THROTTLE_MS) return;
        lastScrollTime.current = now;

        const containerRect = entry.boundingClientRect;
        const viewportHeight = window.innerHeight;

        const rawProgress = Math.max(
          -0.2,
          Math.min(
            1,
            (viewportHeight * CONSTANTS.VIEWPORT_TRIGGER_POINT -
              containerRect.top) /
              (viewportHeight * 0.5 * CONSTANTS.SCROLL_RANGE_MULTIPLIER)
          )
        );

        targetProgressRef.current = rawProgress;
      },
      {
        threshold: Array.from({ length: 20 }, (_, i) => i / 20),
        rootMargin: '20% 0px -20% 0px',
      }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Optimized animation loop
  useEffect(() => {
    let currentProgress = 0;

    const animate = () => {
      const delta = targetProgressRef.current - currentProgress;
      currentProgress += delta * CONSTANTS.SMOOTHING_FACTOR;

      if (currentProgress <= 0) {
        setCurrentProgressIndex(-1);
      } else {
        const progressIndex = Math.min(
          nonEmptyWordIndices.length - 1,
          Math.floor(
            currentProgress *
              CONSTANTS.HIGHLIGHT_SPEED_MULTIPLIER *
              nonEmptyWordIndices.length
          )
        );
        setCurrentProgressIndex(progressIndex);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [nonEmptyWordIndices.length]);

  return (
    <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-48">
      <div
        ref={containerRef}
        className="text-center text-3xl font-light lg:text-6xl"
      >
        {words.map((word, index) => {
          if (!word.trim()) {
            return <span key={`${word}-${index}`}>{word}</span>;
          }

          const wordPosition = nonEmptyWordIndices.indexOf(index);
          const shouldHighlight =
            wordPosition !== -1 && wordPosition <= currentProgressIndex;

          return (
            <Word
              key={`${word}-${index}`}
              word={word}
              shouldHighlight={shouldHighlight}
              baseColorLight={baseColorLight}
              baseColorDark={baseColorDark}
              highlightStyleLight={highlightStyleLight}
              highlightStyleDark={highlightStyleDark}
            />
          );
        })}
      </div>
    </div>
  );
};
