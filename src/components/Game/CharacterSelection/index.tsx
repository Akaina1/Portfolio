import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCharacterStore } from '@/stores/Game/characterStore';
import { useGameStore } from '@/stores/Game/gameStore';

/**
 * Character display interface that maps from CharacterResponse
 */
interface CharacterDisplay {
  id: string;
  name: string;
  className: string;
  level: number;
  lastPlayed: string;
  portraitUrl?: string;
}

/**
 * CharacterSelection Component
 *
 * Displays the player's characters and allows them to select one to play.
 * Provides options to create a new character.
 */
const CharacterSelection: React.FC = () => {
  const { playerCharacters, fetchPlayerCharacters } = useCharacterStore();
  const { setCharacter, goToGame } = useGameStore();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
    null
  );
  const [characterList, setCharacterList] = useState<CharacterDisplay[]>([]);

  // Fetch characters on component mount
  useEffect(() => {
    const loadCharacters = async () => {
      try {
        setIsLoading(true);
        setError(null);

        await fetchPlayerCharacters();

        // Transform characters from store to display format
        const formattedCharacters = playerCharacters.map((char) => ({
          id: char.id,
          name: char.name,
          className: char.classId, // We would ideally map classId to class name
          level: char.level,
          lastPlayed: char.lastPlayed
            ? new Date(char.lastPlayed).toLocaleDateString()
            : '',
          portraitUrl: undefined, // CharacterResponse doesn't have portraitUrl
        }));

        setCharacterList(formattedCharacters);
      } catch (err) {
        console.error('Error loading characters:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load characters'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadCharacters();
  }, [fetchPlayerCharacters, playerCharacters]);

  // Handle character selection
  const handleSelectCharacter = (characterId: string) => {
    setSelectedCharacterId(characterId);
  };

  // Handle play button click
  const handlePlayCharacter = () => {
    if (selectedCharacterId) {
      // Find the selected character in the list
      const selectedCharacter = characterList.find(
        (char) => char.id === selectedCharacterId
      );

      if (selectedCharacter) {
        // Set the selected character in the game store
        setCharacter({
          id: selectedCharacter.id,
          name: selectedCharacter.name,
        });

        // Navigate to the game view
        goToGame();
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center py-16">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          <p className="text-gray-600">Loading your characters...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center py-16">
        <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <svg
            className="mx-auto h-12 w-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-3 text-lg font-medium text-red-800">
            Error Loading Characters
          </h3>
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <button
            className="mt-4 rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Your Characters</h1>
        <Link
          href="/game/characters/create"
          className="rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create New Character
        </Link>
      </div>

      {characterList.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <h2 className="mt-4 text-xl font-semibold text-gray-800">
            No Characters Found
          </h2>
          <p className="mt-2 text-gray-600">
            You don&apos;t have any characters yet. Create your first character
            to begin your adventure!
          </p>
          <Link
            href="/game/characters/create"
            className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Your First Character
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Character list */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {characterList.map((character) => (
                <div
                  key={character.id}
                  className={`relative flex flex-col overflow-hidden rounded-lg shadow-md transition-all duration-200 ${
                    selectedCharacterId === character.id
                      ? 'scale-105 transform border-2 border-blue-500 shadow-lg'
                      : 'border border-gray-200 hover:border-blue-300 hover:shadow-lg'
                  }`}
                  onClick={() => handleSelectCharacter(character.id)}
                  role="button"
                  aria-pressed={selectedCharacterId === character.id}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectCharacter(character.id);
                    }
                  }}
                >
                  {/* Selected indicator */}
                  {selectedCharacterId === character.id && (
                    <div className="absolute right-2 top-2 z-10 rounded-full bg-blue-500 p-1">
                      <svg
                        className="h-4 w-4 text-white"
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
                  )}

                  {/* Character portrait */}
                  <div className="relative h-40 bg-gray-100">
                    {character.portraitUrl ? (
                      <Image
                        src={character.portraitUrl}
                        alt={`${character.name} portrait`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gray-200">
                        <span className="text-lg font-semibold text-gray-500">
                          {character.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Character info */}
                  <div className="flex-grow p-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {character.name}
                    </h3>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Level {character.level}
                      </span>
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                        {character.className}
                      </span>
                    </div>
                    {character.lastPlayed && (
                      <p className="mt-3 text-xs text-gray-500">
                        Last played: {character.lastPlayed}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Character details and play button */}
          <div className="md:col-span-1">
            <div className="sticky top-4 space-y-6">
              {selectedCharacterId ? (
                <>
                  <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-semibold text-gray-800">
                      Selected Character
                    </h2>

                    {(() => {
                      const character = characterList.find(
                        (c) => c.id === selectedCharacterId
                      );
                      if (!character) return null;

                      return (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4">
                            <div className="relative h-16 w-16 overflow-hidden rounded-full bg-gray-100">
                              {character.portraitUrl ? (
                                <Image
                                  src={character.portraitUrl}
                                  alt={`${character.name} portrait`}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gray-200">
                                  <span className="text-lg font-semibold text-gray-500">
                                    {character.name.charAt(0)}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">
                                {character.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Level {character.level} {character.className}
                              </p>
                            </div>
                          </div>

                          {character.lastPlayed && (
                            <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-600">
                              <span className="font-medium">Last played:</span>{' '}
                              {character.lastPlayed}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  <button
                    onClick={handlePlayCharacter}
                    className="w-full rounded-md bg-green-600 py-3 text-center text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Play Now
                  </button>
                </>
              ) : (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
                  <p className="text-gray-600">Select a character to play</p>
                </div>
              )}

              <Link
                href="/game/characters/create"
                className="block w-full rounded-md border border-blue-500 bg-white py-3 text-center text-blue-600 shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Create New Character
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterSelection;
