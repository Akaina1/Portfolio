/**
 * API Service Types
 * Contains type definitions for API requests and responses
 */

/**
 * Common API error response structure
 */
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

/**
 * Login request payload
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Login response from server
 */
export interface LoginResponse {
  access_token: string;
  player: {
    id: string;
    username: string;
    email: string;
  };
}

/**
 * Registration request payload
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

/**
 * Registration response from server
 */
export interface RegisterResponse {
  _id: string;
  username: string;
  email: string;
  accountStatus: string;
  lastLogin: string;
  settings: {
    notifications: boolean;
    theme: string;
    keybinds: Record<string, unknown>;
  };
}

/**
 * Player profile response
 */
export interface ProfileResponse {
  userId: string;
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
 * Options for API requests
 */
export interface ApiRequestOptions extends RequestInit {
  requiresAuth?: boolean;
  skipErrorHandling?: boolean;
}

/**
 * HTTP methods as a type
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
