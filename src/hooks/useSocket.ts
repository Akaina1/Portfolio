import { useEffect, useState, useCallback, useRef } from 'react';
import { useSocketStore } from '@/stores/Game/socketStore';
import { usePlayerStore } from '@/stores/Player/playerStore';
import { useGameStore } from '@/stores/Game/gameStore';
import { SocketEvents } from '../types/Socket';

/**
 * Custom hook for managing socket connections and events
 *
 * This hook provides:
 * - Automatic connection when a token is available
 * - Type-safe event listeners
 * - Connection status management
 * - Integration with game and player stores
 */
export const useSocket = () => {
  // Use refs to track state without triggering re-renders
  const connectionAttemptedRef = useRef(false);
  const cleanupPerformedRef = useRef(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Get socket store methods and state
  const {
    socket,
    connect,
    isConnected,
    isAuthenticated,
    connectionError,
    on,
    off,
    emit,
  } = useSocketStore();

  // Get player data
  const player = usePlayerStore((state) => state.player);
  const setPlayer = usePlayerStore((state) => state.setPlayer);

  // Game state
  const setConnected = useGameStore((state) => state.setConnected);
  const setViewState = useGameStore((state) => state.setViewState);

  // Store function references in refs to avoid dependency changes
  const connectRef = useRef(connect);
  const onRef = useRef(on);
  const offRef = useRef(off);
  const setPlayerRef = useRef(setPlayer);
  const setViewStateRef = useRef(setViewState);

  // Update refs when functions change
  useEffect(() => {
    connectRef.current = connect;
    onRef.current = on;
    offRef.current = off;
    setPlayerRef.current = setPlayer;
    setViewStateRef.current = setViewState;
  }, [connect, on, off, setPlayer, setViewState]);

  /**
   * Type-safe wrapper for the socket.on method
   */
  const onEvent = useCallback(
    <T>(event: string, callback: (data: T) => void) => {
      on<T>(event, callback);
      return () => off<T>(event, callback);
    },
    [on, off]
  );

  /**
   * Type-safe wrapper for the socket.emit method
   */
  const emitEvent = useCallback(
    (event: string, ...args: unknown[]) => {
      emit(event, ...args);
    },
    [emit]
  );

  /**
   * Initialize socket connection and event listeners
   */
  useEffect(() => {
    // Skip if we've already attempted connection or don't have player data
    if (connectionAttemptedRef.current || !player?.id || !player?.email) {
      return;
    }

    // Mark that we've attempted connection
    connectionAttemptedRef.current = true;

    // Create simple token
    const token = `${player.id}:${player.email}`;
    console.log('Connecting with token:', token);

    // Connect to socket
    connectRef.current(token);
    setIsInitialized(true);

    // Set up event listeners
    const handleAuthSuccess = (data: {
      playerId: string;
      username: string;
    }) => {
      console.log('Socket authentication successful:', data);
      if (player) {
        setPlayerRef.current({
          ...player,
          id: data.playerId,
        });
      }
    };

    const handleAuthFailure = (data: { message: string }) => {
      console.error('Socket authentication failed:', data.message);
      setViewStateRef.current('auth');
    };

    const handleConnectError = (error: { message: string }) => {
      console.error('Socket connection error:', error.message);
      if (
        error.message.includes('authentication') ||
        error.message.includes('unauthorized') ||
        error.message.includes('token')
      ) {
        setViewStateRef.current('auth');
      }
    };

    // Register event listeners
    onRef.current(SocketEvents.AUTH_SUCCESS, handleAuthSuccess);
    onRef.current(SocketEvents.AUTH_FAILURE, handleAuthFailure);
    onRef.current(SocketEvents.CONNECT_ERROR, handleConnectError);

    // Cleanup function that runs when component unmounts
    return () => {
      // Prevent multiple cleanups
      if (cleanupPerformedRef.current) return;
      cleanupPerformedRef.current = true;

      // Remove event listeners
      offRef.current(SocketEvents.AUTH_SUCCESS, handleAuthSuccess);
      offRef.current(SocketEvents.AUTH_FAILURE, handleAuthFailure);
      offRef.current(SocketEvents.CONNECT_ERROR, handleConnectError);

      // Disconnect socket without causing re-renders
      if (socket) {
        // Use the raw socket.disconnect() instead of our store method
        // to avoid state updates during cleanup
        socket.disconnect();
      }
    };
  }, [player, socket]);

  /**
   * Update game connection state when socket connection changes
   */
  useEffect(() => {
    setConnected(isConnected && isAuthenticated);
  }, [isConnected, isAuthenticated, setConnected]);

  // Return socket methods and state
  return {
    isConnected,
    isAuthenticated,
    connectionError,
    onEvent,
    emitEvent,
    socket,
    isInitialized,
  };
};
