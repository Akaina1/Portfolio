import { GameState, ViewState } from '@/Game/types/GameStore.types';
import { create } from 'zustand';

/**
 * Game state store implementation
 *
 * Manages the current view, connection status, and selected character
 * Provides methods for navigating between different application states
 */
export const useGameStore = create<GameState>((set) => ({
  // Initial state
  viewState: 'auth',
  isConnected: false,
  character: null,

  // Core state setters
  setViewState: (viewState) => set({ viewState }),
  setConnected: (isConnected) => set({ isConnected }),
  setCharacter: (character) => set({ character }), // sets the selected character

  // Helper methods for view state transitions
  goToAuth: () => set({ viewState: 'auth' }),
  goToCharacterCreation: () => set({ viewState: 'characterCreation' }),
  goToCharacterSelection: () => set({ viewState: 'characterSelection' }),
  goToGame: () => set({ viewState: 'game' }),
}));

/**
 * Helper function to determine the next view after authentication
 * based on whether the player has characters
 *
 * This function implements the game flow logic for post-authentication:
 * - No characters → Character Creation
 * - One character → Direct to Game
 * - Multiple characters → Character Selection
 *
 * @param hasCharacters Whether the player has any characters
 * @param characterCount Number of characters the player has
 * @returns The appropriate view state to transition to
 */
export const getPostAuthViewState = (
  hasCharacters: boolean,
  characterCount: number
): ViewState => {
  if (!hasCharacters) {
    return 'characterCreation';
  }

  if (characterCount === 1) {
    return 'game'; // Skip character selection if they only have one character
  }

  return 'characterSelection';
};
