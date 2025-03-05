/**
 * Interface defining the structure of player data
 * as returned from the authentication API
 */
export interface PlayerData {
  id: string;
  username: string;
  email: string;
  accountStatus?: string;
  lastLogin?: string;
  settings?: {
    notifications?: boolean;
    theme?: string;
    keybinds?: Record<string, unknown>;
  };
  hasCharacters?: boolean;
}

/**
 * Interface defining the player store state and actions
 */
export interface PlayerState {
  // Player data
  player: PlayerData | null;
  isLoading: boolean;
  error: string | null;

  // Auth data
  token: string | null;
  tokenExpiry: number | null;
  isAuthenticated: boolean;

  // Character-related state
  hasCheckedForCharacters: boolean;

  // Actions
  setPlayer: (player: PlayerData | null) => void;
  setToken: (token: string | null, expiresIn?: number) => void;
  clearPlayerData: () => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setHasCharacters: (hasCharacters: boolean) => void;

  // API methods
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  getProfile: () => Promise<PlayerData | null>;

  // Character-related methods
  checkForCharacters: () => Promise<boolean>;
  handlePostLogin: () => Promise<void>;
}
