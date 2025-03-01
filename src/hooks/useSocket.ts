import { useEffect } from 'react';
import { useSocketStore } from '@/stores/Game/socketStore';
import { usePlayerStore } from '@/stores/Player/playerStore';

/**
 * Custom hook to manage socket connection
 * Only connects when player is authenticated
 */
export function useSocket() {
  const { connect, isConnected, isAuthenticated, connectionError } =
    useSocketStore();

  const isAuthenticatedPlayer = usePlayerStore(
    (state) => state.isAuthenticated
  );
  const playerToken = usePlayerStore((state) => state.token);

  useEffect(() => {
    // Only attempt connection if player is authenticated and in game view
    if (isAuthenticatedPlayer && playerToken && !isConnected) {
      console.log('Player authenticated - connecting socket');
      connect();
    }

    // No cleanup function needed here
  }, [isAuthenticatedPlayer, playerToken, isConnected, connect]);

  return { isConnected, isAuthenticated, connectionError };
}
