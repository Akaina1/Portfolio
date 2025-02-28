import { create } from 'zustand';

/**
 * Interface defining the structure of player data
 */
interface PlayerData {
  id: string;
  email: string;
  username: string;
  // Add other player properties as needed
}

/**
 * Interface defining the player store state and actions
 */
interface PlayerState {
  // Player data
  player: PlayerData | null;
  isLoading: boolean;
  error: string | null;
  token: string | null;

  // Actions
  setPlayer: (player: PlayerData | null) => void;
  setToken: (token: string | null) => void;
  clearPlayerData: () => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
}

/**
 * Initial state for the player store
 */
const initialState: Omit<
  PlayerState,
  'setPlayer' | 'setToken' | 'clearPlayerData' | 'setError' | 'setLoading'
> = {
  player: null,
  isLoading: false,
  error: null,
  token: null,
};

/**
 * Player store for managing player data and authentication
 *
 * This store handles:
 * - Player profile information
 * - Authentication token
 * - Loading and error states
 */
export const usePlayerStore = create<PlayerState>((set) => ({
  ...initialState,

  // Actions
  setPlayer: (player) => set({ player }),
  setToken: (token) => set({ token }),
  clearPlayerData: () => set({ player: null, token: null }),
  setError: (error) => set({ error }),
  setLoading: (isLoading) => set({ isLoading }),
}));
