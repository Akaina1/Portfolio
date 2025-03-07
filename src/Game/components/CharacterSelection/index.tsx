import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCharacterStore } from '../../stores/Game/characterStore';
import { useGameStore } from '../../stores/Game/gameStore';
import SectionHeader from '@/Game/utilities/sectionHeader';
import {
  CharacterDisplay,
  BackendCharacter,
} from '@/Game/types/CharacterSelection.types';
import { useSocketStore } from '@/Game/stores/Game/socketStore';
import { usePlayerStore } from '@/Game/stores/Player/playerStore';
import { SocketService } from '@/Game/services/socket/socketService';

/**
 * CharacterSelection Component
 *
 * Displays the player's characters and allows them to select one to play.
 * Provides options to create a new character.
 */
const CharacterSelection: React.FC = () => {
  const { fetchPlayerCharacters } = useCharacterStore();
  const { setCharacter, goToGame } = useGameStore();
  const socket = useSocketStore((state) => state.socket);
  const playerId = usePlayerStore((state) => state.player?._id);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
    null
  );
  const [characterList, setCharacterList] = useState<CharacterDisplay[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isStartingGame, setIsStartingGame] = useState(false);

  // Create a ref to store the socket service instance
  const socketServiceRef = React.useRef<SocketService | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketServiceRef.current) {
        socketServiceRef.current.cleanup();
      }
    };
  }, []);

  // Fetch characters on component mount
  useEffect(() => {
    const loadCharacters = async () => {
      try {
        setIsLoading(true);
        setError(null);

        await fetchPlayerCharacters();

        // Get the latest character data from the store
        const characterData = useCharacterStore.getState()
          .playerCharacters as BackendCharacter[];

        // Transform characters to display format
        const formattedCharacters: CharacterDisplay[] = characterData.map(
          (char) => {
            // Extract class name from classId which can be string or object
            let className = 'Unknown';
            if (typeof char.classId === 'object' && char.classId !== null) {
              className = char.classId.name || 'Unknown';
            }

            return {
              id: char._id,
              name: char.name,
              className,
              level: char.level || 1,
              lastPlayed: char.lastPlayed
                ? new Date(char.lastPlayed).toLocaleDateString()
                : '',
            };
          }
        );

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
  }, [fetchPlayerCharacters]); // Remove playerCharacters dependency

  // Handle character selection
  const handleSelectCharacter = async (characterId: string) => {
    if (!socket || !playerId) {
      setError('Unable to select character: Missing required information');
      return;
    }

    try {
      setIsSelecting(true);
      setError(null);

      // Create socket service instance if it doesn't exist
      if (!socketServiceRef.current) {
        socketServiceRef.current = new SocketService(socket);
      }

      // First, select the character via socket
      const response = await socketServiceRef.current.character.selectCharacter(
        {
          playerId,
          characterId,
        }
      );

      if (response.success) {
        // Find the selected character in our list
        const selectedCharacter = characterList.find(
          (char) => char.id === characterId
        );

        if (!selectedCharacter) {
          throw new Error('Selected character not found in list');
        }

        // Set the character in the game store
        setCharacter({
          id: characterId,
          name: selectedCharacter.name,
        });

        // Update local UI state
        setSelectedCharacterId(characterId);
      }
    } catch (err) {
      console.error('Error selecting character:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to select character'
      );
      setSelectedCharacterId(null); // Reset selection on error
    } finally {
      setIsSelecting(false);
    }
  };

  // Handle play button click - this is where we'll add the socket logic
  const handlePlayCharacter = async () => {
    if (!selectedCharacterId || !socket || !playerId) {
      setError('Unable to start game: Missing required information');
      return;
    }

    try {
      setIsStartingGame(true);
      setError(null);

      // Start the game
      await socketServiceRef.current?.game.startGame({
        playerId,
        characterId: selectedCharacterId,
      });

      // Navigate to game view
      goToGame();
    } catch (err) {
      console.error('Error starting game:', err);
      setError(err instanceof Error ? err.message : 'Failed to start game');
    } finally {
      setIsStartingGame(false);
    }
  };

  // Add debug useEffect to monitor socket state
  useEffect(() => {
    console.log('Socket state changed:', {
      socketExists: !!socket,
      playerId,
    });
  }, [socket, playerId]);

  // Update the character card UI to show selection state
  const CharacterCard = ({ character }: { character: CharacterDisplay }) => (
    <div
      key={character.id}
      className={`relative flex flex-col overflow-hidden rounded-button border border-gray-200 bg-black/5 drop-shadow-dark-outline-white transition-all duration-200 hover:scale-125 dark:border-gray-700 dark:bg-neutral-800 ${
        selectedCharacterId === character.id
          ? 'scale-105 transform border-2 border-blue-500 shadow-lg'
          : 'border border-gray-200 hover:border-blue-300 hover:shadow-lg'
      } ${isSelecting ? 'pointer-events-none opacity-50' : ''}`}
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

      {/* Loading indicator when selecting */}
      {isSelecting && selectedCharacterId === character.id && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      )}

      {/* Character info */}
      <div className="flex-grow p-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
          {character.name}
        </h3>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-md text-yellow-500">
            Level {character.level}
          </span>
          <span className="rounded-full bg-orange-300 px-2 py-1 text-sm font-bold text-black">
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
  );

  // Update the character details section to only show play button if character is in store
  const renderCharacterDetails = () => {
    const selectedCharacter = characterList.find(
      (c) => c.id === selectedCharacterId
    );
    const characterInStore = useGameStore.getState().character;

    if (!selectedCharacter) return null;

    return (
      <div className="sticky top-4 space-y-6">
        <div className="rounded-button border border-gray-200 bg-black/5 p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-100">
            Selected Character
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {selectedCharacter.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Level {selectedCharacter.level} {selectedCharacter.className}
                </p>
              </div>
            </div>
            {selectedCharacter.lastPlayed && (
              <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                <span className="font-medium">Last played:</span>{' '}
                {selectedCharacter.lastPlayed}
              </div>
            )}
          </div>
        </div>

        {/* Only show play button if character is in store */}
        {characterInStore && characterInStore.id === selectedCharacterId && (
          <button
            onClick={handlePlayCharacter}
            disabled={isStartingGame}
            className={`w-full rounded-button ${
              isStartingGame
                ? 'cursor-not-allowed bg-green-400'
                : 'bg-green-600 hover:bg-green-700'
            } py-3 text-center text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
          >
            {isStartingGame ? (
              <div className="flex items-center justify-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Starting Game...
              </div>
            ) : (
              'Play Now'
            )}
          </button>
        )}
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center py-16">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading your characters...
          </p>
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
    <div className="m-4 mx-auto w-[95%] rounded-lg bg-white p-4 shadow-lg dark:bg-gray-900/70">
      <div className="mb-8 flex items-center justify-between p-14">
        <SectionHeader text="Your Characters" icon="👤" version="v1.0" />
        <Link
          href="/game/characters/create"
          className="rounded-button bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
            className="mt-6 inline-block rounded-button bg-blue-600 px-6 py-3 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Your First Character
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 p-14 md:grid-cols-3">
          {/* Character list */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 gap-14 sm:grid-cols-2 lg:grid-cols-5">
              {characterList.map((character) => (
                <CharacterCard key={character.id} character={character} />
              ))}
            </div>
          </div>

          {/* Character details and play button */}
          <div className="md:col-span-1">
            {renderCharacterDetails()}

            <Link
              href="/game/characters/create"
              className="block w-full rounded-button border border-blue-500 bg-white py-3 text-center text-blue-600 shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create New Character
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterSelection;
