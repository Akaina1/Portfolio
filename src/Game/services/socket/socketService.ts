import { Socket } from 'socket.io-client';
import { setupCharacterHandlers } from './handlers/characterHandler';
import { setupGameHandlers } from './handlers/gameHandler';

export class SocketService {
  private socket: Socket;
  private characterHandlers;
  private gameHandlers;

  constructor(socket: Socket) {
    if (!socket) {
      throw new Error('Socket instance is required');
    }

    if (!socket.connected) {
      console.warn('Socket is not connected on SocketService initialization');
    }

    this.socket = socket;
    this.characterHandlers = setupCharacterHandlers(socket);
    this.gameHandlers = setupGameHandlers(socket);
  }

  get character() {
    return this.characterHandlers;
  }

  get game() {
    return this.gameHandlers;
  }

  /**
   * Cleanup method to remove all event listeners
   */
  cleanup() {
    this.characterHandlers.cleanup();
    this.gameHandlers.cleanup();
  }

  // Add more handler setups as needed
}
