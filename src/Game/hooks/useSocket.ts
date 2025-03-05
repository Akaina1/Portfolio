import { useEffect } from 'react';
import { useSocketStore } from '../stores/Game/socketStore';
import { usePlayerStore } from '../stores/Player/playerStore';
import { useGameStore } from '../stores/Game/gameStore';

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

  // Get current view state to prevent socket connection in auth view
  const viewState = useGameStore((state) => state.viewState);

  useEffect(() => {
    // IMPORTANT: Only connect socket if player is authenticated AND not in auth view
    if (
      isAuthenticatedPlayer &&
      playerToken &&
      !isConnected &&
      viewState !== 'auth'
    ) {
      console.log(
        'Player authenticated and NOT in auth view - connecting socket'
      );
      connect();
    }
  }, [isAuthenticatedPlayer, playerToken, isConnected, connect, viewState]);

  return { isConnected, isAuthenticated, connectionError };
}
