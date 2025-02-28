'use client';

import React, { useState, useEffect } from 'react';
import DeviceWarning from '@/components/Game/DeviceWarning';
import AuthView from '@/components/Game/AuthView';
import GameInterface from '@/components/Game/GameInterface';
import { useGameStore } from '@/stores/Game/gameStore';
import { usePathname } from 'next/navigation';
import { useGameInterfaceStore } from '@/stores/Game/gameInterfaceStore';
import { useSocket } from '@/hooks/useSocket';
import { usePlayerStore } from '@/stores/Player/playerStore';

/**
 * Game Page Component
 *
 * This is the main entry point for the game experience.
 * It handles the flow between authentication, character selection, and the game interface.
 * It also manages socket connection and authentication.
 */
const GamePage: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const viewState = useGameStore((state) => state.viewState);
  const setViewState = useGameStore((state) => state.setViewState);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const { toggleSettingsModal, keybinds, enableKeybinds } =
    useGameInterfaceStore();

  // Socket connection
  const { isConnected, isAuthenticated, connectionError } = useSocket();
  const player = usePlayerStore((state) => state.player);

  // Simulate loading effect
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Prevent hydration mismatch by only rendering client components after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Effect to handle socket authentication errors
  useEffect(() => {
    if (connectionError && viewState === 'game') {
      console.error('Socket connection error:', connectionError);
      // Handle authentication errors by returning to auth view
      if (
        connectionError.includes('authentication') ||
        connectionError.includes('unauthorized') ||
        connectionError.includes('token')
      ) {
        console.warn('Authentication error detected, returning to login');
        setViewState('auth');
      }
    }
  }, [connectionError, viewState, setViewState]);

  // Global keybind listener for settings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if keybinds are disabled
      const keybindsDisabled =
        useGameInterfaceStore.getState().keybindsDisabled;
      if (keybindsDisabled) return;

      // Check if input elements have focus
      const activeElement = document.activeElement;
      if (
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        activeElement instanceof HTMLSelectElement ||
        activeElement?.closest('.auth-form-container') !== null
      ) {
        // Skip when focus is in form elements
        return;
      }

      // Find the settings keybind
      const settingsKeybind = keybinds.find((kb) => kb.actionId === 'settings');

      if (settingsKeybind) {
        // Parse the keybind string
        const keys = settingsKeybind.keybind.toLowerCase().split('+');
        const mainKey = keys[keys.length - 1];
        const needsCtrl = keys.includes('ctrl');
        const needsShift = keys.includes('shift');
        const needsAlt = keys.includes('alt');

        // Check if the pressed key combination matches the keybind
        const keyMatches = e.key.toLowerCase() === mainKey.toLowerCase();
        const ctrlMatches = needsCtrl === e.ctrlKey;
        const shiftMatches = needsShift === e.shiftKey;
        const altMatches = needsAlt === e.altKey;

        if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
          e.preventDefault();
          toggleSettingsModal();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keybinds, toggleSettingsModal]);

  // Add effect to ensure keybinds are enabled when we're in the game view
  useEffect(() => {
    if (viewState === 'game') {
      enableKeybinds();
    }
  }, [viewState, enableKeybinds]);

  // Render the appropriate view based on auth state
  const renderView = () => {
    switch (viewState) {
      case 'auth':
        return <AuthView />;
      case 'game':
        // Show connection status if not connected
        if (!isConnected || !isAuthenticated) {
          return (
            <div className="flex h-screen w-full flex-col items-center justify-center">
              <h2 className="mb-4 text-2xl font-bold">
                Connecting to game server...
              </h2>
              {connectionError && (
                <div className="mt-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                  {connectionError}
                </div>
              )}
              {player && (
                <div className="mt-4">
                  <button
                    className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
                    onClick={() => window.location.reload()} // Simple refresh to retry
                  >
                    Retry Connection
                  </button>
                </div>
              )}
            </div>
          );
        }
        return <GameInterface />;
      default:
        return <AuthView />;
    }
  };

  // Return null during SSR to prevent hydration mismatch
  if (!isMounted) {
    return <div className="w-full opacity-0" suppressHydrationWarning={true} />;
  }

  return (
    <div
      className={`w-full transition-opacity duration-500 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      suppressHydrationWarning={true}
      key={pathname}
    >
      {/* Device compatibility warning */}
      <DeviceWarning />

      {/* Render based on auth state */}
      {renderView()}
    </div>
  );
};

export default GamePage;
