import {
  getAuthToken,
  isTokenExpired,
  usePlayerStore,
} from '@/stores/Player/playerStore';
import { ApiError, ApiRequestOptions, HttpMethod } from './types';

/**
 * Base URL for API requests
 */
const API_URL =
  process.env.NEXT_PUBLIC_GAME_SERVER_URL || 'http://localhost:3001';

/**
 * Type for API error response data
 * We use a more specific type than 'any' to handle various error responses
 */
export type ApiErrorData = ApiError | Record<string, unknown> | unknown;

/**
 * Custom error class for API errors with typed error data
 */
export class ApiRequestError extends Error {
  public statusCode: number;
  public data: ApiErrorData;

  constructor(message: string, statusCode: number, data?: ApiErrorData) {
    super(message);
    this.name = 'ApiRequestError';
    this.statusCode = statusCode;
    this.data = data ?? {};
  }
}

/**
 * Core API request function
 * Handles authentication, error handling, and response parsing
 */
export async function apiRequest<T, D = Record<string, unknown>>(
  endpoint: string,
  method: HttpMethod = 'GET',
  data?: D,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    requiresAuth = false,
    skipErrorHandling = false,
    ...fetchOptions
  } = options;

  // Prepare URL
  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // Prepare headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  // Add auth token if required
  if (requiresAuth) {
    const token = getAuthToken();
    console.log(
      `API request to ${endpoint} requires auth:`,
      token ? 'Token found' : 'No token'
    );

    // Check if token exists
    if (!token) {
      // Token doesn't exist or is expired
      if (isTokenExpired()) {
        // If token exists but is expired, clear player data
        // This should rarely happen with 30-day tokens, but we keep it for safety
        usePlayerStore.getState().clearPlayerData();
      }
      throw new ApiRequestError('Authentication required', 401);
    }

    // Set the Authorization header with the Bearer token
    // The backend will extract the player ID from this token
    // Ensure token doesn't already have 'Bearer ' prefix
    const formattedToken = token.startsWith('Bearer ')
      ? token
      : `Bearer ${token}`;
    console.log('Setting Authorization header with token format:', {
      length: formattedToken.length,
      startsWithBearer: formattedToken.startsWith('Bearer '),
      includesSpace: formattedToken.includes(' '),
    });
    headers['Authorization'] = formattedToken;

    // Don't add player ID as a header - backend should extract it from the JWT token
    const player = usePlayerStore.getState().player;
    if (player && player.id) {
      console.log(
        `Player ID in store: ${player.id} (will be extracted from JWT by backend)`
      );
    } else {
      console.warn('Player ID not available in store');
    }
  }

  // Prepare request options
  const requestOptions: RequestInit = {
    method,
    headers,
    ...fetchOptions,
  };

  // Add body for non-GET requests
  if (data && method !== 'GET') {
    requestOptions.body = JSON.stringify(data);
  }

  // Log the request for debugging
  console.log(`Making ${method} request to ${url}`, {
    requiresAuth,
    hasAuthHeader: !!headers['Authorization'],
  });

  // Make the request
  try {
    const response = await fetch(url, requestOptions);

    // Handle successful responses
    if (response.ok) {
      // For no-content responses, return empty object
      if (response.status === 204) {
        return {} as T;
      }

      // Parse JSON response
      return (await response.json()) as T;
    }

    // Handle error responses
    if (!skipErrorHandling) {
      // Try to parse error response
      let errorData: ApiError;
      try {
        errorData = await response.json();
      } catch {
        errorData = {
          statusCode: response.status,
          message: response.statusText,
        };
      }

      // Handle unauthorized errors (401)
      // This happens if the token is blacklisted or invalid
      if (response.status === 401 && requiresAuth) {
        usePlayerStore.getState().clearPlayerData();
      }

      // Create and throw error with details
      const message =
        typeof errorData.message === 'string'
          ? errorData.message
          : Array.isArray(errorData.message)
            ? errorData.message.join('. ')
            : 'Unknown error';

      throw new ApiRequestError(message, response.status, errorData);
    }

    throw new ApiRequestError(response.statusText, response.status);
  } catch (error) {
    // Re-throw API errors
    if (error instanceof ApiRequestError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof Error) {
      throw new ApiRequestError(`Network error: ${error.message}`, 0);
    }

    // Handle unknown errors
    throw new ApiRequestError('Unknown error occurred', 0);
  }
}

/**
 * Shorthand methods for common HTTP methods
 */
export const api = {
  /**
   * GET request
   */
  get: async <T>(endpoint: string, options?: ApiRequestOptions): Promise<T> => {
    console.log(`API GET request to ${endpoint} with options:`, options);
    try {
      const response = await apiRequest<T>(endpoint, 'GET', undefined, options);
      console.log(`API GET response from ${endpoint}:`, response);
      return response;
    } catch (error) {
      console.error(`API GET error for ${endpoint}:`, error);
      throw error;
    }
  },

  /**
   * POST request
   */
  post: <T, D = Record<string, unknown>>(
    endpoint: string,
    data?: D,
    options?: ApiRequestOptions
  ): Promise<T> => {
    return apiRequest<T, D>(endpoint, 'POST', data, options);
  },

  /**
   * PUT request
   */
  put: <T, D = Record<string, unknown>>(
    endpoint: string,
    data?: D,
    options?: ApiRequestOptions
  ): Promise<T> => {
    return apiRequest<T, D>(endpoint, 'PUT', data, options);
  },

  /**
   * DELETE request
   */
  delete: <T>(endpoint: string, options?: ApiRequestOptions): Promise<T> => {
    return apiRequest<T>(endpoint, 'DELETE', undefined, options);
  },

  /**
   * PATCH request
   */
  patch: <T, D = Record<string, unknown>>(
    endpoint: string,
    data?: D,
    options?: ApiRequestOptions
  ): Promise<T> => {
    return apiRequest<T, D>(endpoint, 'PATCH', data, options);
  },
};
