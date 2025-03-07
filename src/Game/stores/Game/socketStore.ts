import { create } from 'zustand';
import { io } from 'socket.io-client';
import { getAuthToken } from '../Player/playerStore';
import {
  SocketStore,
  SocketState,
  SocketActions,
} from '@/Game/types/SocketStore.types';

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
      const state = getState();
      console.log('Socket connect called:', {
        hasExistingSocket: !!state.socket,
        isConnected: state.isConnected,
      });

      if (state.socket && state.isConnected) return;

      const token = getAuthToken();
      if (!token) {
        console.error('No auth token available for socket connection');
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
      const { socket } = get();

      if (socket) {
        console.log('Explicitly disconnecting socket');
        socket.disconnect();

        // Important: Clear socket instance immediately
        set({
          socket: null,
          isConnected: false,
          isAuthenticated: false,
        });
      }
    },

    resetSocket: () => {
      console.log('Completely resetting socket state and stored tokens');

      const { socket } = get();
      if (socket) {
        // Ensure socket is disconnected
        socket.disconnect();
      }

      // Reset state completely
      set({
        socket: null,
        isConnected: false,
        isAuthenticated: false,
        connectionError: null,
      });

      // Also clear any socket-related localStorage items
      if (typeof window !== 'undefined') {
        // If you're storing any socket IDs or state, clear them here
        localStorage.removeItem('socket_id');
        localStorage.removeItem('socket_auth');

        // Force a disconnect in localStorage if you're using it for connection state
        localStorage.setItem('socket_force_disconnect', Date.now().toString());

        // Clear this after a second to allow other components to react
        setTimeout(() => {
          localStorage.removeItem('socket_force_disconnect');
        }, 1000);
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
