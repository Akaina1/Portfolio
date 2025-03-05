/**
 * Defines all possible view states in the game flow
 * - 'auth': Authentication screen (login/signup)
 * - 'characterCreation': Character creation workflow
 * - 'characterSelection': Character selection screen when player has multiple characters
 * - 'game': Main game interface
 */
export type ViewState =
  | 'auth'
  | 'characterCreation'
  | 'characterSelection'
  | 'game';

/**
 * Represents a player character with essential properties
 */
export interface Character {
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
export interface GameState {
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
