/**
 * Enum defining all socket event types used in the application
 * This ensures consistent event naming across client and server
 */
export enum SocketEvents {
  // Connection events
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  CONNECT_ERROR = 'connect_error',

  // Authentication events
  AUTH_SUCCESS = 'authentication:success',
  AUTH_FAILURE = 'authentication:failure',

  // Game events
  PLAYER_JOINED = 'player:joined',
  PLAYER_LEFT = 'player:left',
  PLAYER_MOVED = 'player:moved',
  PLAYER_ACTION = 'player:action',

  // World events
  WORLD_UPDATE = 'world:update',
  WORLD_EVENT = 'world:event',

  // System events
  PING = 'ping',
  PONG = 'pong',
}

/**
 * Interface for player position data1
 */
export interface Position {
  x: number;
  y: number;
  z?: number;
}

/**
 * Interface for player joined event data
 */
export interface PlayerJoinedData {
  playerId: string;
  username: string;
  position: Position;
}

/**
 * Interface for player left event data
 */
export interface PlayerLeftData {
  playerId: string;
}

/**
 * Interface for player moved event data
 */
export interface PlayerMovedData {
  playerId: string;
  position: Position;
  direction?: string;
  timestamp: number;
}

/**
 * Interface for player action event data
 */
export interface PlayerActionData {
  playerId: string;
  actionType: string;
  targetId?: string;
  position?: Position;
  timestamp: number;
}

/**
 * Interface for world update event data
 */
export interface WorldUpdateData {
  players: Record<
    string,
    {
      id: string;
      username: string;
      position: Position;
    }
  >;
  timestamp: number;
}

/**
 * Interface for world event data
 */
export interface WorldEventData {
  eventType: string;
  position?: Position;
  affectedPlayers?: string[];
  data?: Record<string, unknown>;
  timestamp: number;
}

/**
 * Interface for authentication success data
 */
export interface AuthSuccessData {
  playerId: string;
  username: string;
}

/**
 * Interface for authentication failure data
 */
export interface AuthFailureData {
  message: string;
  code?: string;
}
