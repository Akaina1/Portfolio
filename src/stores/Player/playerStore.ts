import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useGameStore } from '@/stores/Game/gameStore';

/**
 * Interface defining the structure of player data
 * as returned from the authentication API
 */
interface PlayerData {
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
}

/**
 * Interface defining the player store state and actions
 */
interface PlayerState {
  // Player data
  player: PlayerData | null;
  isLoading: boolean;
  error: string | null;

  // Auth data
  token: string | null;
  tokenExpiry: number | null;
  isAuthenticated: boolean;

  // Actions
  setPlayer: (player: PlayerData | null) => void;
  setToken: (token: string | null, expiresIn?: number) => void;
  clearPlayerData: () => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;

  // API methods
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  getProfile: () => Promise<PlayerData | null>;
}

/**
 * Base URL for the game server API
 */
const API_URL =
  process.env.NEXT_PUBLIC_GAME_SERVER_URL || 'http://localhost:3001';

/**
 * Default token expiration (30 days in seconds)
 */
const DEFAULT_TOKEN_EXPIRY = 30 * 24 * 60 * 60; // 30 days

/**
 * Player store for managing player data and authentication
 *
 * This store handles:
 * - Player profile information
 * - Authentication token management
 * - Loading and error states
 * - Authentication API interactions
 */
export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      // State
      player: null,
      isLoading: false,
      error: null,
      token: null,
      tokenExpiry: null,
      isAuthenticated: false,

      // Actions
      setPlayer: (player) => set({ player }),

      setToken: (token, expiresIn = DEFAULT_TOKEN_EXPIRY) => {
        // If token is null, clear token data
        if (!token) {
          set({ token: null, tokenExpiry: null, isAuthenticated: false });
          return;
        }

        // Set token with expiry time (default 30 days)
        const tokenExpiry = Date.now() + expiresIn * 1000;
        set({ token, tokenExpiry, isAuthenticated: true });
      },

      clearPlayerData: () =>
        set({
          player: null,
          token: null,
          tokenExpiry: null,
          isAuthenticated: false,
        }),

      setError: (error) => set({ error }),

      setLoading: (isLoading) => set({ isLoading }),

      // API Methods

      /**
       * Login method to authenticate with the server
       */
      login: async (username, password) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
          }

          const data = await response.json();

          // Store the access token with 30-day expiry
          get().setToken(data.access_token, DEFAULT_TOKEN_EXPIRY);

          // Store player data
          const playerData: PlayerData = {
            id: data.player.id,
            username: data.player.username,
            email: data.player.email,
          };
          set({ player: playerData, isAuthenticated: true });

          return data;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'An unknown error occurred';
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Register a new player account
       */
      register: async (username, email, password) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
          }

          const data = await response.json();

          // Note: Registration doesn't automatically log the user in,
          // they will need to login separately
          return data;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'An unknown error occurred';
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Logout the current player
       * Sends the token to the server blacklist before clearing local state
       */
      logout: async () => {
        const token = get().token;

        // Only attempt server logout if we have a token
        if (token) {
          try {
            await fetch(`${API_URL}/auth/logout`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
          } catch (error) {
            console.error('Error during server logout:', error);
            // Continue with local logout even if server logout fails
          }
        }

        // Clear local auth data regardless of server response
        get().clearPlayerData();

        // Reset game view state to auth when logging out
        // This ensures the login screen appears when returning to game page
        try {
          const gameStore = useGameStore.getState();
          if (gameStore && gameStore.setViewState) {
            gameStore.setViewState('auth');
          }
        } catch (error) {
          console.error('Error resetting game view state:', error);
        }
      },

      /**
       * Get the current player's profile
       */
      getProfile: async () => {
        const { token, player } = get();

        // If no token or already have player data, return current data
        if (!token) {
          return null;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`${API_URL}/auth/profile`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            // If unauthorized, clear auth data
            if (response.status === 401) {
              get().clearPlayerData();
            }
            throw new Error('Failed to fetch profile');
          }

          const profileData = await response.json();

          // Update player data with profile information
          const playerData: PlayerData = {
            id: profileData.userId,
            username: profileData.username,
            email: profileData.email,
            accountStatus: profileData.accountStatus,
            lastLogin: profileData.lastLogin,
            settings: profileData.settings,
          };

          set({ player: playerData });
          return playerData;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'An unknown error occurred';
          set({ error: errorMessage });
          return player; // Return current player data if available
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'player-storage', // Name for localStorage/sessionStorage
      partialize: (state) => ({
        player: state.player,
        token: state.token,
        tokenExpiry: state.tokenExpiry,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

/**
 * Check if the current token is expired
 * @returns boolean indicating if token is expired
 */
export const isTokenExpired = (): boolean => {
  const { tokenExpiry } = usePlayerStore.getState();
  if (!tokenExpiry) return true;
  return Date.now() > tokenExpiry;
};

/**
 * Get the current auth token, checking expiration
 * @returns valid token or null if expired
 */
export const getAuthToken = (): string | null => {
  const { token } = usePlayerStore.getState();
  return isTokenExpired() ? null : token;
};
