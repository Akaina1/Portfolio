import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

// Define the store state structure
interface SocketState {
  socket: Socket | null;
  isConnecting: boolean;
  isConnected: boolean;
  connectionError: string | null;
  isAuthenticated: boolean;
}

// Define the store actions
interface SocketActions {
  connect: (token: string) => void;
  disconnect: () => void;
  on: <T>(event: string, callback: (data: T) => void) => void;
  off: <T>(event: string, callback: (data: T) => void) => void;
  emit: (event: string, ...args: unknown[]) => void;
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
};

// Create the socket store with proper typing
export const useSocketStore = create<SocketStore>((set, get) => {
  // Helper function to get typed state
  const getState = () => get();

  // Define actions
  const actions: SocketActions = {
    // Connect to the socket server with token
    connect: (token) => {
      // Don't reconnect if already connected
      const state = getState();
      if (state.socket && state.isConnected) return;

      // Update state to connecting
      set({ isConnecting: true, connectionError: null });

      try {
        console.log('Initializing socket connection with token');

        // Pass the token directly in the URL as a query parameter
        const socketUrl =
          process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://localhost:3001/game';
        const socket = io(`${socketUrl}?token=${token}`, {
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
  };

  // Return the combined state and actions
  return {
    ...initialState,
    ...actions,
  };
});
