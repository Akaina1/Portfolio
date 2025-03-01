import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { getAuthToken } from '@/stores/Player/playerStore';

// Define the store state structure
interface SocketState {
  socket: Socket | null;
  isConnecting: boolean;
  isConnected: boolean;
  connectionError: string | null;
  isAuthenticated: boolean;
  shouldConnect: boolean;
}

// Define the store actions
interface SocketActions {
  connect: () => void;
  disconnect: () => void;
  on: <T>(event: string, callback: (data: T) => void) => void;
  off: <T>(event: string, callback: (data: T) => void) => void;
  emit: (event: string, ...args: unknown[]) => void;
  resetSocket: () => void;
  setShouldConnect: (shouldConnect: boolean) => void;
}

// Combined store type
type SocketStore = SocketState & SocketActions;

// Initial state
const initialState: SocketState = {
  socket: null,
  isConnecting: false,
  isConnected: false,
  connectionError: null,
  isAuthenticated: false,
  shouldConnect: false,
};

// Base URL for socket connection
const SOCKET_URL =
  process.env.NEXT_PUBLIC_GAME_SERVER_URL || 'http://localhost:3001';

// Create the socket store with proper typing
export const useSocketStore = create<SocketStore>((set, get) => {
  // Helper function to get typed state
  const getState = () => get();

  // Define actions
  const actions: SocketActions = {
    // Connect to the socket server with JWT token
    connect: () => {
      // Don't reconnect if already connected
      const state = getState();
      if (state.socket && state.isConnected) return;

      // Get the JWT token
      const token = getAuthToken();
      if (!token) {
        set({
          connectionError:
            'Authentication token required for socket connection',
          isConnecting: false,
          isConnected: false,
          isAuthenticated: false,
        });
        return;
      }

      // Remove 'Bearer ' prefix if it exists before using the token for socket connections
      const socketToken = token.startsWith('Bearer ')
        ? token.substring(7)
        : token;
      console.log(
        'Initializing socket connection with JWT token (without Bearer prefix)'
      );

      // Update state to connecting
      set({ isConnecting: true, connectionError: null });

      try {
        // Create the socket connection with auth header using JWT token
        const socket = io(`${SOCKET_URL}/game`, {
          auth: {
            token: socketToken,
          },
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 10000,
        });

        // Set socket in store
        set({ socket });

        // Set up connection event handlers
        socket.on('connect', () => {
          console.log('Socket connected, waiting for authentication');
          set({ isConnected: true, isConnecting: false });
        });

        socket.on('disconnect', (reason) => {
          console.log('Socket disconnected, reason:', reason);
          set({ isConnected: false, isAuthenticated: false });
        });

        socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error.message);
          set({
            connectionError: error.message,
            isConnecting: false,
            isConnected: false,
            isAuthenticated: false,
          });
        });

        // Authentication events
        socket.on('authentication:success', (data) => {
          console.log('Socket authentication successful', data);
          set({ isAuthenticated: true });
        });

        socket.on('authentication:failure', (data) => {
          console.error('Socket authentication failed:', data.message);
          set({
            connectionError: data.message,
            isAuthenticated: false,
          });
          socket.disconnect();
        });
      } catch (error) {
        console.error('Socket initialization error:', error);
        set({
          connectionError:
            error instanceof Error ? error.message : String(error),
          isConnecting: false,
          isConnected: false,
        });
      }
    },

    // Disconnect socket
    disconnect: () => {
      const state = getState();
      if (state.socket) {
        // Capture the socket locally to avoid state access after update
        const socketToDisconnect = state.socket;

        // Update state first
        set({
          socket: null,
          isConnected: false,
          isAuthenticated: false,
        });

        // Then disconnect the socket
        socketToDisconnect.disconnect();
      }
    },

    resetSocket: () =>
      set({
        socket: null,
        isConnected: false,
        isAuthenticated: false,
        connectionError: null,
        shouldConnect: false,
      }),

    // Utility methods for event handling
    on: (event, callback) => {
      const state = getState();
      if (state.socket) state.socket.on(event, callback);
    },

    off: (event, callback) => {
      const state = getState();
      if (state.socket) state.socket.off(event, callback);
    },

    emit: (event, ...args) => {
      const state = getState();
      if (state.socket && state.isConnected) state.socket.emit(event, ...args);
    },

    // Set should connect flag
    setShouldConnect: (shouldConnect: boolean) => {
      set({ shouldConnect });

      // If turning off, disconnect socket
      if (!shouldConnect) {
        get().disconnect();
      }
    },
  };

  // Return the combined state and actions
  return {
    ...initialState,
    ...actions,
  };
});
