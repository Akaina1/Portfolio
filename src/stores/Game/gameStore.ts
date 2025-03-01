import { create } from 'zustand';

/**
 * Defines all possible view states in the game flow
 * - 'auth': Authentication screen (login/signup)
 * - 'characterCreation': Character creation workflow
 * - 'characterSelection': Character selection screen when player has multiple characters
 * - 'game': Main game interface
 */
type ViewState = 'auth' | 'characterCreation' | 'characterSelection' | 'game';

/**
 * Represents a player character with essential properties
 */
interface Character {
  id: string;
  name: string;
  // Add other character properties as needed
}

/**
 * Game state store interface
 *
 * This store manages the main application view state, connection status,
 * and selected character. It serves as the central navigation controller
 * for transitioning between different game screens.
 */
interface GameState {
  /**
   * Current view being displayed to the user
   * Controls which major component is rendered in the game page
   */
  viewState: ViewState;

  /**
   * Whether the player is currently connected to the game server
   * Used to control connection status UI and prevent game actions when disconnected
   */
  isConnected: boolean;

  /**
   * Currently selected character for gameplay
   * Will be null during authentication and character creation flows
   */
  character: Character | null;

  /**
   * Set the current view state directly
   * For most transitions, prefer using the specific navigation methods below
   *
   * @param state The view state to transition to
   */
  setViewState: (state: ViewState) => void;

  /**
   * Update the connection status
   * Called when socket connection state changes
   *
   * @param connected Whether the player is connected to game server
   */
  setConnected: (connected: boolean) => void;

  /**
   * Set the active character for gameplay
   * Called when selecting a character or after character creation
   *
   * @param character The character to set as active, or null to clear
   */
  setCharacter: (character: Character | null) => void;

  /**
   * Navigate to authentication screen
   * Use when player logs out or authentication is required
   */
  goToAuth: () => void;

  /**
   * Navigate to character creation flow
   * Use when player has no characters or chooses to create a new one
   */
  goToCharacterCreation: () => void;

  /**
   * Navigate to character selection screen
   * Use when player has multiple characters to choose from
   */
  goToCharacterSelection: () => void;

  /**
   * Navigate to main game interface
   * Use after successful character selection or when character is already set
   */
  goToGame: () => void;
}

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
  setCharacter: (character) => set({ character }),

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
