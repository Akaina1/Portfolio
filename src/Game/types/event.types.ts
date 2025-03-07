import { Types } from 'mongoose';
import { SOCKET_EVENTS } from '../services/socket/socketEvents';

type EventValues<T> = T[keyof T];
type SocketEventValues =
  | EventValues<typeof SOCKET_EVENTS.CHARACTER>
  | EventValues<typeof SOCKET_EVENTS.GAME>
  | EventValues<typeof SOCKET_EVENTS.PROLOGUE>;

/**
 * Base interface for all event payloads
 */
export interface BaseEventPayload {
  type: SocketEventValues;
  timestamp: Date;
  eventId: string;
  characterId?: Types.ObjectId | string;
}

/**
 * Base interface for all event responses
 */
export interface BaseEventResponse {
  success: boolean;
  timestamp: Date;
  eventId: string;
  message?: string;
}

/**
 * Game Start Event Payloads
 */
export interface GameStartPayload extends BaseEventPayload {
  type: typeof SOCKET_EVENTS.GAME.START;
}

export interface GameStartSuccessPayload extends BaseEventPayload {
  type: typeof SOCKET_EVENTS.GAME.START_SUCCESS;
  data: {
    characterId: string;
    locationInstanceId: string;
    areaInstanceId: string;
    worldInstanceId: string;
    position: { x: number; y: number };
    isPrologue: boolean;
    currentStep?: number;
  };
}

export interface GameStartErrorPayload extends BaseEventPayload {
  type: typeof SOCKET_EVENTS.GAME.START_ERROR;
  error: string;
  code?: string;
}

export interface PrologueInitializedPayload extends BaseEventPayload {
  type: typeof SOCKET_EVENTS.PROLOGUE.PROLOGUE_INITIALIZED;
  success: boolean;
}

/**
 * Character Selection Event Payloads
 */
export interface CharacterSelectPayload extends BaseEventPayload {
  type: typeof SOCKET_EVENTS.CHARACTER.SELECT;
  playerId: string;
  characterId: string;
}

export interface CharacterSelectSuccessPayload extends BaseEventPayload {
  type: typeof SOCKET_EVENTS.CHARACTER.SELECT_SUCCESS;
  character: {
    id: string;
    name: string;
  };
}

export interface CharacterSelectErrorPayload extends BaseEventPayload {
  type: typeof SOCKET_EVENTS.CHARACTER.SELECT_ERROR;
  message: string;
}
