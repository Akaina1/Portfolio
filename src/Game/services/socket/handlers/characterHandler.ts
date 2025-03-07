import { Socket } from 'socket.io-client';
import { SOCKET_EVENTS } from '../socketEvents';

/**
 * Interface for the payload sent when selecting a character
 */
export interface CharacterSelectPayload {
  playerId: string;
  characterId: string;
}

/**
 * Interface for the response received from the server after character selection
 */
export interface CharacterSelectResponse {
  success: boolean;
  message?: string;
  data?: {
    characterId: string;
    // Add other fields as needed
  };
}

/**
 * Sets up character-related socket event handlers
 * @param socket - The socket.io client instance
 */
export const setupCharacterHandlers = (socket: Socket) => {
  /**
   * Emits a character selection event to the server and handles the response
   * @param payload - Contains playerId and characterId
   * @returns Promise that resolves with the server response
   */
  const selectCharacter = (
    payload: CharacterSelectPayload
  ): Promise<CharacterSelectResponse> => {
    return new Promise((resolve, reject) => {
      // Add connection check
      if (!socket.connected) {
        reject(new Error('Socket is not connected'));
        return;
      }

      console.log('Emitting character select event:', {
        event: SOCKET_EVENTS.CHARACTER.SELECT,
        payload,
      });

      // Set a timeout for the server response
      const timeout = setTimeout(() => {
        reject(new Error('Character selection timed out'));
      }, 5000); // 5 second timeout

      // Emit the character select event
      socket.emit(
        SOCKET_EVENTS.CHARACTER.SELECT,
        payload,
        (response: CharacterSelectResponse) => {
          clearTimeout(timeout); // Clear the timeout since we got a response
          console.log('Received character select response:', response);

          if (response.success) {
            // Set up listeners for subsequent character events if needed
            socket.on(SOCKET_EVENTS.CHARACTER.SELECT_SUCCESS, (data) => {
              console.log('Character selection confirmed by server:', data);
            });

            socket.on(SOCKET_EVENTS.CHARACTER.SELECT_ERROR, (error) => {
              console.error('Character selection error:', error);
            });

            resolve(response);
          } else {
            reject(new Error(response.message || 'Failed to select character'));
          }
        }
      );
    });
  };

  /**
   * Clean up function to remove event listeners
   */
  const cleanup = () => {
    socket.off(SOCKET_EVENTS.CHARACTER.SELECT_SUCCESS);
    socket.off(SOCKET_EVENTS.CHARACTER.SELECT_ERROR);
  };

  return {
    selectCharacter,
    cleanup,
  };
};
