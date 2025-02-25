'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { cn } from '@/utilities/cn';
import type { HighlightTextBlock as HighlightTextBlockType } from '@/payload-types';

/**
 * Toggleable constants for the highlighting effect.
 */
const CONSTANTS = {
  HIGHLIGHT_SPEED_MULTIPLIER: 1,
  VIEWPORT_TRIGGER_POINT: 0.58,
  SCROLL_RANGE_MULTIPLIER: 0.65,
  SCROLL_THROTTLE_MS: 16, // ~60fps
} as const;

/**
 * Props for the individual Word component.
 */
interface WordProps {
  /**
   * The word string to display.
   */
  word: string;
  /**
   * Whether the word should be fully visible (highlighted) or hidden.
   */
  highlighted: boolean;
  /**
   * Tailwind CSS classes for the highlight style in light mode.
   * (e.g. "bg-gradient-to-b from-neutral-400 via-neutral-500 to-neutral-700 bg-clip-text text-transparent")
   */
  highlightStyleLight: string;
  /**
   * Tailwind CSS classes for the highlight style in dark mode.
   */
  highlightStyleDark: string;
}

/**
 * A memoized Word component that displays one word with a smooth opacity transition.
 *
 * The component wraps the passed word in a span whose opacity is set to 1 when highlighted,
 * or 0 otherwise. It renders separate spans for light and dark modes.
 *
 * @param {WordProps} props - Component properties.
 * @returns {JSX.Element} The rendered word.
 */
const Word: React.FC<WordProps> = React.memo(
  ({ word, highlighted, highlightStyleLight, highlightStyleDark }) => {
    return (
      <span
        className="inline-block font-mono leading-relaxed tracking-wide transition-opacity duration-1000 ease-in-out lg:mb-2"
        style={{ opacity: highlighted ? 1 : 0 }}
      >
        {/* Render for light mode */}
        <span className="block dark:hidden">
          <span className={cn(highlightStyleLight)}>{word}</span>
        </span>
        {/* Render for dark mode */}
        <span className="hidden dark:block">
          <span className={cn(highlightStyleDark)}>{word}</span>
        </span>
      </span>
    );
  }
);
Word.displayName = 'Word';

/**
 * A text block component that highlights individual words sequentially as the user scrolls.
 *
 * The component splits the input text (preserving whitespace) and renders each non-whitespace word with the gradient highlight.
 * A throttled scroll handler calculates a progress value and maps that to a current highlight index.
 * Each word uses a CSS transition on opacity so that the highlighting effect is smoothly animated.
 *
 * @param {HighlightTextBlockType} props - Component properties.
 * @param {string} props.text - The text to display.
 * @param {string} props.highlightStyleLight - Tailwind highlight style classes for light mode.
 * @param {string} props.highlightStyleDark - Tailwind highlight style classes for dark mode.
 * @returns {JSX.Element} The rendered highlight text block.
 *
 * @example
 * <HighlightTextBlock
 *   text="Sample highlight text"
 *   highlightStyleLight="bg-gradient-to-b from-neutral-400 via-neutral-500 to-neutral-700 bg-clip-text text-transparent"
 *   highlightStyleDark="bg-gradient-to-b from-neutral-400 via-neutral-500 to-neutral-700 bg-clip-text text-transparent"
 * />
 */
export const HighlightTextBlock: React.FC<HighlightTextBlockType> = (props) => {
  const { text, highlightStyleLight, highlightStyleDark } = props;

  // Split the text into tokens while preserving whitespace.
  const tokens = useMemo(() => text.split(/(\s+)/), [text]);

  // Compute the number of non-whitespace (highlightable) tokens.
  const nonEmptyCount = useMemo(
    () =>
      tokens.reduce((acc, token) => (token.trim() !== '' ? acc + 1 : acc), 0),
    [tokens]
  );

  // State: current highlight index (last word index that should be visible).
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);

  // Ref for the container element to measure its position.
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ticking = false;
    let lastScrollTime = 0;

    /**
     * Updates the current highlight index based on scroll progress.
     *
     * Uses the container's bounding rectangle and the viewport height to compute a progress value.
     * The progress is clamped between 0 and 1, then multiplied by the total number of words (adjusted by HIGHLIGHT_SPEED_MULTIPLIER)
     * to produce the new highlight index.
     */
    const updateHighlight = (): void => {
      if (!containerRef.current) return;
      const now = performance.now();
      if (now - lastScrollTime < CONSTANTS.SCROLL_THROTTLE_MS) {
        ticking = false;
        return;
      }
      lastScrollTime = now;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // Calculate progress using the toggleable constants.
      let progress =
        (viewportHeight * CONSTANTS.VIEWPORT_TRIGGER_POINT - rect.top) /
        (viewportHeight * CONSTANTS.SCROLL_RANGE_MULTIPLIER);
      progress = Math.max(0, Math.min(1, progress));
      const newIndex =
        progress === 0
          ? -1
          : Math.floor(
              progress * CONSTANTS.HIGHLIGHT_SPEED_MULTIPLIER * nonEmptyCount
            );
      setHighlightIndex((prevIndex) =>
        prevIndex !== newIndex ? newIndex : prevIndex
      );
      ticking = false;
    };

    const handleScroll = (): void => {
      if (!ticking) {
        requestAnimationFrame(updateHighlight);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial update on mount.
    updateHighlight();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [nonEmptyCount]);

  // currentWordIndex is used to assign an increasing index to each non-whitespace token.
  let currentWordIndex = 0;

  return (
    <div
      ref={containerRef}
      className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-48"
    >
      <div className="whitespace-pre-wrap text-center text-3xl font-light lg:text-6xl">
        {tokens.map((token, idx) => {
          if (token.trim() === '') {
            // Render whitespace tokens without additional styling.
            return <span key={`ws-${idx}`}>{token}</span>;
          } else {
            // Determine if the word should be highlighted based on its order.
            const isHighlighted = currentWordIndex <= highlightIndex;
            const wordComponent = (
              <Word
                key={`word-${idx}`}
                word={token}
                highlighted={isHighlighted}
                highlightStyleLight={highlightStyleLight}
                highlightStyleDark={highlightStyleDark}
              />
            );
            currentWordIndex++;
            return wordComponent;
          }
        })}
      </div>
    </div>
  );
};
