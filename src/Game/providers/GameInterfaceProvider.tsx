'use client';

import React, { useEffect } from 'react';
import { useGameInterfaceStore } from '../stores/Game/gameInterfaceStore';

interface GameInterfaceProviderProps {
  children: React.ReactNode;
}

export const GameInterfaceProvider: React.FC<GameInterfaceProviderProps> = ({
  children,
}) => {
  const { resetStore } = useGameInterfaceStore();

  // Initialize the store when the provider mounts
  useEffect(() => {
    // You could load saved state from an API here
    // For now, we'll just ensure the store is in a clean state
    resetStore();
  }, [resetStore]);

  return <>{children}</>;
};
