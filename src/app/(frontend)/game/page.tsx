'use client';

import React, { useState, useEffect } from 'react';
import DeviceWarning from '@/Game/components/DeviceWarning';
import AuthView from '@/Game/components/AuthView';
import GameInterface from '@/Game/components/GameInterface';
import CharacterCreator from '@/Game/components/CharacterCreator';
import CharacterSelection from '@/Game/components/CharacterSelection';
import { useGameStore } from '@/Game/stores/Game/gameStore';
import { usePathname } from 'next/navigation';
import { useGameInterfaceStore } from '@/Game/stores/Game/gameInterfaceStore';
import { useSocket } from '@/Game/hooks/useSocket';
import { usePlayerStore } from '@/Game/stores/Player/playerStore';
import authService from '@/Game/services/api/authService';
import { useSocketStore } from '@/Game/stores/Game/socketStore';
import characterService from '@/Game/services/character/characterService';

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
  //const player = usePlayerStore((state) => state.player);
  const disconnect = useSocketStore((state) => state.disconnect);
  const isAuthenticatedPlayer = usePlayerStore(
    (state) => state.isAuthenticated
  );
  const checkForCharacters = usePlayerStore(
    (state) => state.checkForCharacters
  );
  const hasCheckedForCharacters = usePlayerStore(
    (state) => state.hasCheckedForCharacters
  );

  // Track if this is the initial mount
  const isInitialMount = React.useRef(true);

  // Add this line to get setShouldConnect
  const setShouldConnect = useSocketStore((state) => state.setShouldConnect);

  // Add this at the top with other state declarations
  const devMode = false; // Set this to false when you need normal authentication

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

  // Effect to check for player characters after authentication
  useEffect(() => {
    // If player is authenticated but we haven't checked for characters yet
    if (isAuthenticatedPlayer && !hasCheckedForCharacters) {
      // Check if player has characters and update the view state accordingly
      checkForCharacters()
        .then(async (hasCharacters) => {
          // If player has characters, determine where to go based on count
          if (hasCharacters) {
            try {
              const countResponse = await characterService.getCharacterCount();
              const characterCount = countResponse.characterCount;

              if (characterCount === 1) {
                // If only one character, go directly to game
                setViewState('game');
              } else {
                // If multiple characters, go to character selection
                setViewState('characterSelection');
              }
            } catch (error) {
              console.error('Error getting character count:', error);
              // Default to character selection if there's an error
              setViewState('characterSelection');
            }
          } else {
            // If no characters, go to character creation
            setViewState('characterCreation');
          }
        })
        .catch((error) => {
          console.error('Error checking for characters:', error);
        });
    }
  }, [
    isAuthenticatedPlayer,
    hasCheckedForCharacters,
    checkForCharacters,
    setViewState,
  ]);

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

  // ONLY handle browser tab/window close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      console.log('Browser tab closing, cleaning up...');
      disconnect();

      e.preventDefault();
    };

    // Add event listener for browser close/refresh only
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);

      // We ONLY disconnect if this isn't the initial mount
      // and only when the component is truly unmounting due to navigation
      if (!isInitialMount.current) {
        console.log('Component unmounting due to navigation, cleaning up...');
        disconnect();

        if (isAuthenticatedPlayer) {
          authService.logout().catch((err) => {
            console.error('Error during logout:', err);
          });
        }
      }
    };
  }, [disconnect, isAuthenticatedPlayer]); // Keep dependencies minimal

  // Mark initial mount as complete after component mounts
  useEffect(() => {
    isInitialMount.current = false;

    // No cleanup function here
  }, []);

  // Effect to reset view state when player authentication changes
  useEffect(() => {
    // If player is not authenticated and view state is not 'auth', reset to 'auth'
    if (
      !isAuthenticatedPlayer &&
      (viewState === 'game' ||
        viewState === 'characterCreation' ||
        viewState === 'characterSelection')
    ) {
      console.log('Player not authenticated, returning to auth view');
      setViewState('auth');
    }
  }, [isAuthenticatedPlayer, viewState, setViewState]);

  // Update this effect to enable socket connection for both game and character selection views
  useEffect(() => {
    if (
      (viewState === 'game' || viewState === 'characterSelection') &&
      isAuthenticatedPlayer
    ) {
      // Enable socket connection for both game and character selection views
      setShouldConnect(true);
    } else {
      // Disable socket connection for other views
      setShouldConnect(false);
    }
  }, [viewState, isAuthenticatedPlayer, setShouldConnect]);

  // Modify renderView to bypass all auth checks in dev mode
  const renderView = () => {
    // If in dev mode, go straight to game interface
    if (devMode) {
      return <GameInterface />;
    }

    // Normal authentication flow
    switch (viewState) {
      case 'auth':
        return <AuthView />;

      case 'characterCreation':
        if (!isAuthenticatedPlayer) {
          setViewState('auth');
          return <AuthView />;
        }
        return <CharacterCreator />;

      case 'characterSelection':
        if (!isAuthenticatedPlayer) {
          setViewState('auth');
          return <AuthView />;
        }

        // Add socket connection check for character selection
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
              <div className="mt-4">
                <button
                  className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
                  onClick={() => window.location.reload()}
                >
                  Retry Connection
                </button>
              </div>
            </div>
          );
        }
        return <CharacterSelection />;

      case 'game':
        if (!isAuthenticatedPlayer) {
          setViewState('auth');
          return <AuthView />;
        }

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
              <div className="mt-4">
                <button
                  className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
                  onClick={() => window.location.reload()}
                >
                  Retry Connection
                </button>
              </div>
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
      {devMode && (
        <div className="fixed right-0 top-0 z-50 m-4 rounded bg-yellow-600 px-2 py-1 text-xs text-white">
          Dev Mode Active
        </div>
      )}
      <DeviceWarning />
      {renderView()}
    </div>
  );
};

export default GamePage;
