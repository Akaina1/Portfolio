import { useEffect } from 'react';
import { useGameInterfaceStore } from '@/stores/Game/gameInterfaceStore';

/**
 * Hook to handle keybind actions
 * @param actionId The ID of the action to bind to
 * @param callback The function to call when the keybind is triggered
 */
export function useKeybind(actionId: string, callback: () => void): void {
  const keybinds = useGameInterfaceStore((state) => state.keybinds);

  useEffect(() => {
    // Find the keybind for this action
    const keybind = keybinds.find((kb) => kb.actionId === actionId);
    if (!keybind || !keybind.keybind) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Parse the keybind string
      const keys = keybind.keybind.toLowerCase().split('+');
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
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [actionId, callback, keybinds]);
}
