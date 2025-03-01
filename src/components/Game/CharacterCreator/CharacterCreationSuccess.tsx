import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Props for the CharacterCreationSuccess component
 */
interface CharacterCreationSuccessProps {
  characterName: string;
  characterClass: string;
  onPlayNow: () => void;
  onCreateAnother: () => void;
  className?: string;
}

/**
 * CharacterCreationSuccess Component
 *
 * Displayed after successful character creation.
 * Shows a success message and provides options to play now or create another character.
 */
const CharacterCreationSuccess: React.FC<CharacterCreationSuccessProps> = ({
  characterName,
  characterClass,
  onPlayNow,
  onCreateAnother,
  className = '',
}) => {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center py-12 ${className}`}
    >
      {/* Success icon */}
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
        <svg
          className="h-16 w-16 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* Success message */}
      <h2 className="mb-2 text-3xl font-bold text-gray-800">
        Character Created!
      </h2>
      <p className="mb-8 text-center text-lg text-gray-600">
        Your character <span className="font-semibold">{characterName}</span>{' '}
        the <span className="font-semibold">{characterClass}</span> has been
        successfully created.
      </p>

      {/* Character preview placeholder */}
      <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-md">
        <div className="relative h-64 w-64">
          <Image
            src="/images/character-placeholder.jpg"
            alt={`${characterName} preview`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="bg-white p-4 text-center">
          <h3 className="text-xl font-semibold text-gray-800">
            {characterName}
          </h3>
          <p className="text-gray-600">Level 1 {characterClass}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <button
          onClick={onPlayNow}
          className="rounded-md bg-blue-600 px-8 py-3 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Play Now
        </button>
        <button
          onClick={onCreateAnother}
          className="rounded-md border border-gray-300 bg-white px-8 py-3 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create Another Character
        </button>
      </div>

      {/* Return to character selection */}
      <div className="mt-8">
        <Link
          href="/game/characters"
          className="flex items-center text-blue-600 hover:text-blue-800 hover:underline"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Return to Character Selection
        </Link>
      </div>
    </div>
  );
};

export default CharacterCreationSuccess;
