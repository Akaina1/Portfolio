import { usePlayerStore } from '@/stores/Player/playerStore';
import { api } from './apiService';
import {
  LoginRequest,
  LoginResponse,
  ProfileResponse,
  RegisterRequest,
  RegisterResponse,
} from './types';

/**
 * Authentication Service
 *
 * Handles authentication-related API calls to the backend
 */
const authService = {
  /**
   * Login with username and password
   *
   * @param username Player username or email
   * @param password Player password
   * @returns API response with access token and player info
   */
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const data: LoginRequest = { username, password };

    try {
      const response = await api.post<LoginResponse, LoginRequest>(
        '/auth/login',
        data
      );

      console.log('Login response received:', {
        hasToken: !!response.access_token,
        hasPlayer: !!response.player,
        playerId: response.player?.id,
      });

      // First set the token to ensure it's available for subsequent API calls
      const playerStore = usePlayerStore.getState();

      // Verify the token format
      if (
        !response.access_token ||
        typeof response.access_token !== 'string' ||
        !response.access_token.trim()
      ) {
        console.error('Invalid token format received:', response.access_token);
        throw new Error('Invalid token format received from server');
      }

      // Log the token format for debugging (first few characters only)
      console.log('Token format check:', {
        length: response.access_token.length,
        firstChars: response.access_token.substring(0, 10) + '...',
      });

      // Set the token in the store - do NOT add Bearer prefix
      playerStore.setToken(response.access_token, 30 * 24 * 60 * 60); // 30 days in seconds

      // Verify token was set correctly
      const tokenAfterSet = playerStore.token;
      console.log(
        'Token set in store:',
        tokenAfterSet ? 'Yes (length: ' + tokenAfterSet.length + ')' : 'No'
      );

      // Then set player data
      if (!response.player || !response.player.id) {
        console.error(
          'Invalid player data in login response:',
          response.player
        );
        throw new Error('Invalid player data received from server');
      }

      playerStore.setPlayer({
        id: response.player.id,
        username: response.player.username,
        email: response.player.email,
      });

      console.log('Player data set with ID:', response.player.id);

      // After successful login, check for characters and update view state
      setTimeout(() => {
        playerStore.handlePostLogin().catch((err) => {
          console.error('Error in post-login flow:', err);
        });
      }, 100);

      return response;
    } catch (error) {
      // Let the error propagate to be handled by the caller
      throw error;
    }
  },

  /**
   * Register a new player account
   *
   * @param username Desired username
   * @param email Player email
   * @param password Player password
   * @returns API response with created player data
   */
  register: async (
    username: string,
    email: string,
    password: string
  ): Promise<RegisterResponse> => {
    const data: RegisterRequest = { username, email, password };

    try {
      return await api.post<RegisterResponse, RegisterRequest>(
        '/auth/register',
        data
      );
    } catch (error) {
      // Let the error propagate to be handled by the caller
      throw error;
    }
  },

  /**
   * Fetch the current authenticated player's profile
   *
   * @returns Player profile data
   */
  getProfile: async (): Promise<ProfileResponse> => {
    try {
      const profile = await api.get<ProfileResponse>('/auth/profile', {
        requiresAuth: true,
      });

      // Update player store with profile data
      const playerStore = usePlayerStore.getState();
      playerStore.setPlayer({
        id: profile.userId,
        username: profile.username,
        email: profile.email,
        accountStatus: profile.accountStatus,
        lastLogin: profile.lastLogin,
        settings: profile.settings,
      });

      return profile;
    } catch (error) {
      // Let the error propagate to be handled by the caller
      throw error;
    }
  },

  /**
   * Log out the current player by:
   * 1. Sending token to server blacklist
   * 2. Clearing local auth data
   */
  logout: async (): Promise<void> => {
    const playerStore = usePlayerStore.getState();
    const token = playerStore.token;

    // Only attempt server logout if we have a token
    if (token) {
      try {
        // Call server-side logout to blacklist the token
        await api.post('/auth/logout', undefined, {
          requiresAuth: true,
        });
      } catch (error) {
        console.error('Error during server logout:', error);
        // Continue with local logout even if server logout fails
      }
    }

    // Clear local auth data
    playerStore.clearPlayerData();
  },
};

export default authService;
