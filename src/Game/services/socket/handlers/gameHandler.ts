import { Socket } from 'socket.io-client';
import { SOCKET_EVENTS } from '../socketEvents';
import {
  GameStartPayload,
  GameStartSuccessPayload,
  GameStartErrorPayload,
  BaseEventResponse,
  PrologueInitializedPayload,
} from '@/Game/types/event.types';

// Update the startGame function to handle the correct payload structure
export const setupGameHandlers = (socket: Socket) => {
  const startGame = (payload: {
    playerId: string;
    characterId: string;
  }): Promise<GameStartSuccessPayload> => {
    return new Promise((resolve, reject) => {
      if (!socket.connected) {
        reject(new Error('Socket is not connected'));
        return;
      }

      // Create the full payload with required BaseEventPayload fields
      const fullPayload: GameStartPayload = {
        type: SOCKET_EVENTS.GAME.START,
        timestamp: new Date(),
        eventId: crypto.randomUUID(), // Generate unique event ID
        characterId: payload.characterId,
      };

      console.log('Emitting game start event:', {
        event: SOCKET_EVENTS.GAME.START,
        payload: fullPayload,
      });

      const prologueHandler = (prologuePayload: PrologueInitializedPayload) => {
        console.log('Prologue initialized:', prologuePayload);
        // We don't resolve here, just log that prologue is ready
      };

      const successHandler = (successPayload: GameStartSuccessPayload) => {
        console.log('Game start success:', successPayload);
        cleanup();
        resolve(successPayload);
      };

      const errorHandler = (errorPayload: GameStartErrorPayload) => {
        console.error('Game start error:', errorPayload);
        cleanup();
        reject(new Error(errorPayload.error));
      };

      // Add all event listeners
      socket.on(SOCKET_EVENTS.PROLOGUE.PROLOGUE_INITIALIZED, prologueHandler);
      socket.on(SOCKET_EVENTS.GAME.START_SUCCESS, successHandler);
      socket.on(SOCKET_EVENTS.GAME.START_ERROR, errorHandler);

      const cleanup = () => {
        socket.off(
          SOCKET_EVENTS.PROLOGUE.PROLOGUE_INITIALIZED,
          prologueHandler
        );
        socket.off(SOCKET_EVENTS.GAME.START_SUCCESS, successHandler);
        socket.off(SOCKET_EVENTS.GAME.START_ERROR, errorHandler);
      };

      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error('Game start timed out'));
      }, 30000);

      // Emit with the properly structured payload
      socket.emit(
        SOCKET_EVENTS.GAME.START,
        fullPayload,
        (response: BaseEventResponse) => {
          if (!response?.success) {
            clearTimeout(timeout);
            cleanup();
            reject(new Error(response?.message || 'Failed to start game'));
          }
          // Don't resolve here - wait for START_SUCCESS event
        }
      );
    });
  };

  return {
    startGame,
    cleanup: () => {
      socket.off(SOCKET_EVENTS.PROLOGUE.PROLOGUE_INITIALIZED);
      socket.off(SOCKET_EVENTS.GAME.START_SUCCESS);
      socket.off(SOCKET_EVENTS.GAME.START_ERROR);
    },
  };
};
