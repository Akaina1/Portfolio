'use client';

import React, { useEffect, useState } from 'react';
import type { HomeHeroBlock as HomeHeroProps } from '@/payload-types';
import { CMSLink } from '@/components/Link';
import { cn } from '@/utilities/cn';
import { secretCodes, type SecretData, type MediaData } from './secrets';
import { useAchievementStore } from '@/stores/Achievement/useAchievementStore';
import Image from 'next/image';
import { EXPANDED_TEXT_OPTIONS } from './expandedText';

type PuzzleState = {
  sequence: string;
  isSubmitted: boolean;
  activeSecret: SecretData | null;
};

const SecretMedia: React.FC<{ media: MediaData }> = ({ media }) => {
  if (media.type === 'giphy') {
    return (
      <div className="relative h-full w-full pt-[56.25%]">
        <iframe
          src={`https://giphy.com/embed/${media.giphyId}`}
          className="absolute inset-0 h-full w-full rounded-lg"
          allowFullScreen
          title={media.alt || 'Giphy embed'}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative',
        media.type === 'gif'
          ? 'h-[200px] w-[300px]' // Fixed dimensions for GIFs
          : 'h-[300px] w-[500px]' // Fixed dimensions for images
      )}
    >
      <Image
        src={media.url}
        alt={media.alt || 'Secret content media'}
        fill
        className={cn(
          'rounded-lg',
          media.type === 'gif' ? 'object-contain' : 'object-cover'
        )}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={media.type === 'gif'} // Load GIFs immediately
      />
    </div>
  );
};

const SecretContent: React.FC<{ secret: SecretData }> = ({ secret }) => {
  return (
    <div
      className={cn(
        'rounded-lg bg-black/10 p-6 dark:bg-white/10',
        'duration-300 animate-in fade-in slide-in-from-bottom-4'
      )}
    >
      <h2 className="mb-4 text-center text-xl font-bold text-black dark:text-white">
        {secret.title}
      </h2>

      {/* Media Display */}
      {secret.media && (
        <div
          className={cn(
            'mb-4 flex justify-center',
            secret.media.type === 'giphy' ? 'mx-auto w-full max-w-md' : ''
          )}
        >
          <SecretMedia media={secret.media} />
        </div>
      )}

      {/* Content Text */}
      {secret.content && (
        <p className="text-center text-gray-700 dark:text-gray-300">
          {secret.content}
        </p>
      )}
    </div>
  );
};

export const HomeHeroBlock: React.FC<HomeHeroProps> = ({
  mainText,
  dynamicText,
  links,
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const typingSpeed = 60;
  const deletingSpeed = 40;
  const delayBetweenTexts = 5000;
  const [puzzleState, setPuzzleState] = useState<PuzzleState>({
    sequence: '',
    isSubmitted: false,
    activeSecret: null,
  });
  const [showError, setShowError] = useState(false);
  const [expandedText, setExpandedText] = useState('');

  const handleCharacterClick = (char: string) => {
    setShowError(false);

    if (char === '?') {
      if (!puzzleState.sequence) return;

      const matchingSecret = secretCodes.find(
        (code) => code.code.toLowerCase() === puzzleState.sequence.toLowerCase()
      );

      if (matchingSecret) {
        if (puzzleState.sequence.toLowerCase() === 'moreletters') {
          const randomIndex = Math.floor(
            Math.random() * EXPANDED_TEXT_OPTIONS.length
          );
          setExpandedText(EXPANDED_TEXT_OPTIONS[randomIndex]);
        }

        if (matchingSecret.achievementId) {
          useAchievementStore
            .getState()
            .unlockAchievement(matchingSecret.achievementId);
        }

        setPuzzleState((prev) => ({
          ...prev,
          isSubmitted: true,
          activeSecret: matchingSecret,
        }));
      } else {
        setShowError(true);
        setTimeout(() => {
          setPuzzleState({
            sequence: '',
            isSubmitted: false,
            activeSecret: null,
          });
          setShowError(false);
        }, 2000);
      }
      return;
    }

    setPuzzleState((prev) => ({
      ...prev,
      sequence: prev.sequence + char,
      isSubmitted: false,
      activeSecret: null,
    }));
  };

  const handleClearQuery = () => {
    setPuzzleState({
      sequence: '',
      isSubmitted: false,
      activeSecret: null,
    });
    setShowError(false);
  };

  const renderInteractiveText = () => {
    const fullText = `${mainText}${expandedText}`;

    return fullText.split('').map((char, index) => (
      <span
        key={`${char}-${index}`}
        onClick={() => handleCharacterClick(char)}
        className={cn(
          'cursor-pointer transition-colors duration-200',
          char === '?' ? 'hover:text-red-500' : 'hover:text-blue-300',
          index >= mainText.length && 'text-emerald-500 dark:text-emerald-400'
        )}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleCharacterClick(char);
          }
        }}
      >
        {char}
      </span>
    ));
  };

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        const fullText = dynamicText[currentTextIndex]?.text || '';

        if (isDeleting) {
          setDisplayText((prev) => prev.slice(0, -1));
          if (displayText.length === 0) {
            setIsDeleting(false);
            setCurrentTextIndex((prev) => (prev + 1) % dynamicText.length);
          }
        } else {
          setDisplayText((prev) => fullText.slice(0, prev.length + 1));
          if (displayText === fullText) {
            setTimeout(() => setIsDeleting(true), delayBetweenTexts);
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, dynamicText, currentTextIndex]);

  return (
    <div className="animate-pull-down container relative z-0 -mt-1 flex h-full flex-col items-center justify-center rounded-b-xl bg-black/5 p-4 pt-8 shadow-lg shadow-black/35 lg:pt-28 dark:bg-white/5">
      <h1 className="mb-6 text-start text-2xl font-bold text-black sm:text-4xl dark:text-white">
        {renderInteractiveText()}
      </h1>

      {/* Dynamic Typing Animation */}
      <div className="flex items-start text-lg font-semibold text-black sm:text-2xl dark:text-white">
        <span>{displayText}</span>
        <span className="animate-blink ml-0 text-gray-500">|</span>
      </div>

      {/* Call-to-Action Buttons */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {links?.map((cta, index) => (
          <CMSLink
            key={cta.id || index}
            {...cta.link}
            appearance={cta.link.appearance}
          />
        ))}
      </div>

      {/* Divider Line */}
      <div className="mt-8 w-full max-w-2xl">
        <hr className="border-t border-gray-300 dark:border-gray-700" />
      </div>

      {/* Secret Content Area */}
      <div className="mt-4 w-full max-w-2xl">
        {/* Sequence Display */}
        {puzzleState.sequence && (
          <div
            className={cn(
              'mb-4 flex items-center justify-center gap-2',
              'duration-300 animate-in fade-in slide-in-from-top-4'
            )}
          >
            <span className="text-lg font-medium text-black dark:text-white">
              {puzzleState.sequence}
            </span>
            <button
              onClick={handleClearQuery}
              className={cn(
                'rounded-full p-1 text-sm text-gray-500 hover:text-red-500',
                'transition-colors duration-200'
              )}
              aria-label="Clear code"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {/* Error Message */}
        {showError && (
          <div
            className={cn(
              'mb-4 text-center text-red-500',
              'duration-300 animate-in fade-in zoom-in'
            )}
          >
            Invalid Code
          </div>
        )}

        {/* Secret Content */}
        {puzzleState.activeSecret && (
          <SecretContent secret={puzzleState.activeSecret} />
        )}
      </div>
    </div>
  );
};
