import { Socket } from 'socket.io-client';

// Define the store state structure
export interface SocketState {
  socket: Socket | null;
  isConnecting: boolean;
  isConnected: boolean;
  connectionError: string | null;
  isAuthenticated: boolean;
  shouldConnect: boolean;
}

// Define the store actions
export interface SocketActions {
  connect: () => void;
  disconnect: () => void;
  on: <T>(event: string, callback: (data: T) => void) => void;
  off: <T>(event: string, callback: (data: T) => void) => void;
  emit: (event: string, ...args: unknown[]) => void;
  resetSocket: () => void;
  setShouldConnect: (shouldConnect: boolean) => void;
}

// Combined store type
export type SocketStore = SocketState & SocketActions;
