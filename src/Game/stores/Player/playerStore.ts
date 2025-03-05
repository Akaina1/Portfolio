import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useGameStore } from '../Game/gameStore';
import { PlayerState, PlayerData } from '@/Game/types/PlayerStore.types';
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
 * - Character status checking
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
      hasCheckedForCharacters: false,

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

      clearPlayerData: () => {
        console.log('Completely clearing player data and tokens');

        // Clear ALL token-related items from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('token_expiry');
          localStorage.removeItem('player_id');

          // Also clear sessionStorage just to be safe
          sessionStorage.removeItem('auth_token');
          sessionStorage.removeItem('token_expiry');

          // Some browsers cache aggressively, so force a clean slate
          try {
            document.cookie =
              'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          } catch (e) {
            console.error('Error clearing cookies:', e);
          }
        }

        // Reset state
        set({
          player: null,
          token: null,
          isAuthenticated: false,
          error: null,
          hasCheckedForCharacters: false,
        });
      },

      setError: (error) => set({ error }),

      setLoading: (isLoading) => set({ isLoading }),

      setHasCharacters: (hasCharacters) =>
        set((state) => ({
          player: state.player ? { ...state.player, hasCharacters } : null,
        })),

      // API Methods

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

      /**
       * Check if the player has created any characters
       *
       * @returns True if the player has at least one character, false otherwise
       */
      checkForCharacters: async () => {
        const { setHasCharacters, player } = get();

        console.log(
          'checkForCharacters called with player:',
          player ? `ID: ${player.id}` : 'No player'
        );

        try {
          // Import characterService dynamically to avoid circular dependencies
          const characterService = await import(
            '@/Game/services/character/characterService'
          ).then((module) => module.default);

          console.log(
            'Using characterService.hasCharacters() to check for characters'
          );

          // Use the characterService instead of direct fetch
          const response = await characterService.hasCharacters();

          console.log('Character check response from service:', response);

          // Extract the boolean value from the response
          const hasCharacters = response.hasCharacters;
          setHasCharacters(hasCharacters);
          set({ hasCheckedForCharacters: true });
          return hasCharacters;
        } catch (error) {
          console.error('Error checking for characters:', error);
          setHasCharacters(false);
          set({ hasCheckedForCharacters: true });
          return false;
        }
      },

      /**
       * Handle post-login flow
       *
       * This method:
       * 1. Checks if the player has characters
       * 2. Updates the game view state based on character status
       *
       * Should be called after successful login
       */
      handlePostLogin: async () => {
        const { checkForCharacters, player, getProfile, token } = get();

        console.log(
          'handlePostLogin called with token:',
          token ? `${token.substring(0, 10)}...` : 'No token',
          'and player:',
          player ? `ID: ${player.id}` : 'No player'
        );

        try {
          // Ensure we have complete player data with ID
          if (!player || !player.id) {
            console.log(
              'Player data missing or incomplete, fetching profile...'
            );
            const profileData = await getProfile();

            // If we still don't have player data, we can't proceed
            if (!profileData || !profileData.id) {
              console.error('Failed to get player profile data');
              throw new Error('Player data unavailable');
            }
          }

          // Ensure we have a token
          if (!token) {
            console.error('No authentication token available');
            throw new Error('Authentication token required');
          }

          console.log('Checking for characters with player ID:', player?.id);

          // Check if player has characters
          const hasCharacters = await checkForCharacters();
          console.log('Has characters result:', hasCharacters);

          // Get access to game store
          const gameStore = useGameStore.getState();

          // Get character count to determine next view
          let characterCount = 0;
          if (hasCharacters) {
            try {
              // Import characterService dynamically to avoid circular dependencies
              const characterService = await import(
                '@/Game/services/character/characterService'
              ).then((module) => module.default);

              console.log(
                'Using characterService.getCharacterCount() to get character count'
              );

              // Use the characterService instead of direct fetch
              const countData = await characterService.getCharacterCount();
              characterCount = countData.characterCount;
              console.log('Character count from service:', characterCount);
            } catch (error) {
              console.error('Error getting character count:', error);
            }
          }

          // Determine next view state based on character status and count
          if (!hasCharacters) {
            console.log('No characters, going to character creation');
            // If player has no characters, go to character creation
            gameStore.goToCharacterCreation();
          } else if (characterCount === 1) {
            console.log('One character, going directly to game');
            // If player has exactly one character, go directly to game
            gameStore.goToGame();
          } else {
            console.log('Multiple characters, going to character selection');
            // If player has multiple characters, go to character selection
            gameStore.goToCharacterSelection();
          }
        } catch (error) {
          console.error('Error in post-login flow:', error);
          // Default to auth view if there's an error
          const gameStore = useGameStore.getState();
          gameStore.goToAuth();
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
        hasCheckedForCharacters: state.hasCheckedForCharacters,
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
  const { token, tokenExpiry } = usePlayerStore.getState();

  // Log token retrieval for debugging
  console.log('Getting auth token:', token ? 'Token exists' : 'No token');

  // Check if token exists
  if (!token) {
    console.log('No token found in store');
    return null;
  }

  // Check if token is expired
  if (tokenExpiry && Date.now() > tokenExpiry) {
    console.log(
      'Token is expired, expiry:',
      new Date(tokenExpiry).toISOString()
    );
    return null;
  }

  // Log token details for debugging
  console.log(
    'Token is valid, returning token:',
    token.substring(0, 10) + '...'
  );

  return token;
};

/**
 * Check if the player is authenticated and has valid token
 * @returns boolean indicating if player is authenticated with valid token
 */
export const isPlayerAuthenticated = (): boolean => {
  const { isAuthenticated } = usePlayerStore.getState();
  return isAuthenticated && !isTokenExpired();
};
