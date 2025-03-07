import { Socket } from 'socket.io-client';
import { setupCharacterHandlers } from './handlers/characterHandler';

export class SocketService {
  private socket: Socket;
  private characterHandlers;

  constructor(socket: Socket) {
    if (!socket) {
      throw new Error('Socket instance is required');
    }

    if (!socket.connected) {
      console.warn('Socket is not connected on SocketService initialization');
    }

    this.socket = socket;
    this.characterHandlers = setupCharacterHandlers(socket);
  }

  get character() {
    return this.characterHandlers;
  }

  /**
   * Cleanup method to remove all event listeners
   */
  cleanup() {
    this.characterHandlers.cleanup();
  }

  // Add more handler setups as needed
}
