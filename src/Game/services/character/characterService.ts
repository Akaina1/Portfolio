import { api } from '../api/apiService';
import {
  CharacterClassResponse,
  CharacterResponse,
} from '../../types/CharacterResponse.types';

/**
 * Interface for character creation request
 */
interface CreateCharacterRequest {
  name: string;
  classId: string;
}

/**
 * Interface for checking if player has characters
 */
interface HasCharactersResponse {
  hasCharacters: boolean;
  characterCount: number;
}

/**
 * Interface for paginated character response
 */
interface PaginatedCharactersResponse {
  characters: CharacterResponse[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

/**
 * Character Service
 *
 * Handles API requests related to character management and creation
 */
const characterService = {
  /**
   * Get all available character classes
   *
   * @returns Array of character classes
   */
  getCharacterClasses: async (): Promise<CharacterClassResponse[]> => {
    return api.get<CharacterClassResponse[]>(
      '/player-state/character-classes',
      {
        requiresAuth: true,
      }
    );
  },

  /**
   * Get detailed information about a specific character class
   *
   * @param id Character class ID
   * @returns Detailed character class data
   */
  getCharacterClassById: async (
    id: string
  ): Promise<CharacterClassResponse> => {
    return api.get<CharacterClassResponse>(
      `/player-state/character-classes/${id}`,
      {
        requiresAuth: true,
      }
    );
  },

  /**
   * Create a new character for the current player
   *
   * @param data Character creation data
   * @returns Created character data
   */
  createCharacter: async (
    data: CreateCharacterRequest
  ): Promise<CharacterResponse> => {
    return api.post<CharacterResponse, CreateCharacterRequest>(
      '/player-state/characters',
      data,
      { requiresAuth: true }
    );
  },

  /**
   * Get all characters for the current player
   *
   * @returns Paginated response with player's characters
   */
  getPlayerCharacters: async (): Promise<PaginatedCharactersResponse> => {
    return api.get<PaginatedCharactersResponse>('/player-state/characters', {
      requiresAuth: true,
    });
  },

  /**
   * Get detailed information about a specific character
   *
   * @param id Character ID
   * @returns Detailed character data
   */
  getCharacterById: async (id: string): Promise<CharacterResponse> => {
    return api.get<CharacterResponse>(`/player-state/characters/${id}`, {
      requiresAuth: true,
    });
  },

  /**
   * Check if the current player has any characters
   *
   * @returns Object with hasCharacters flag and characterCount
   */
  hasCharacters: async (): Promise<HasCharactersResponse> => {
    console.log('Calling hasCharacters method');

    try {
      // Use the API service to make the request
      // The backend will extract the player ID from the JWT token
      const response = await api.get<HasCharactersResponse>(
        '/player-state/has-characters',
        {
          requiresAuth: true,
          // Don't add any custom parameters - backend extracts player ID from JWT
        }
      );

      console.log('hasCharacters response:', response);
      return response;
    } catch (error) {
      console.error('Error in hasCharacters method:', error);
      throw error;
    }
  },

  /**
   * Get the number of characters the current player has
   *
   * @returns Object with characterCount
   */
  getCharacterCount: async (): Promise<{ characterCount: number }> => {
    return api.get<{ characterCount: number }>(
      '/player-state/character-count',
      {
        requiresAuth: true,
      }
    );
  },

  /**
   * Get character classes by category
   *
   * @param category Category name
   * @returns Array of character classes in the specified category
   */
  getCharacterClassesByCategory: async (
    category: string
  ): Promise<CharacterClassResponse[]> => {
    return api.get<CharacterClassResponse[]>(
      `/player-state/character-classes/category/${category}`,
      { requiresAuth: true }
    );
  },
};

export default characterService;
