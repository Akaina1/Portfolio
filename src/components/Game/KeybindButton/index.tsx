import React, { useEffect, useRef } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/utilities/cn';
import { useGameInterfaceStore } from '@/stores/Game/gameInterfaceStore';

export interface KeybindButtonProps extends ButtonProps {
  actionId: string;
  label: string;
  keybind: string;
  onAction: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  onKeybindChange?: (actionId: string, newKeybind: string) => void;
  showKeybindLabel?: boolean;
}

const KeybindButton: React.FC<KeybindButtonProps> = ({
  actionId: _actionId,
  label,
  keybind,
  onAction,
  onKeybindChange: _onKeybindChange,
  showKeybindLabel,
  className,
  children,
  ...props
}) => {
  // If showKeybindLabel is not provided, get it from the store
  const storeShowKeybindLabels = useGameInterfaceStore(
    (state) => state.showKeybindLabels
  );
  const effectiveShowKeybindLabel =
    showKeybindLabel !== undefined ? showKeybindLabel : storeShowKeybindLabels;

  // Use refs instead of state to avoid re-renders that could delay input processing
  const buttonRef = useRef<HTMLButtonElement>(null);
  const animationTimeoutRef = useRef<number | null>(null);

  // Function to trigger animation without state changes
  const triggerAnimation = () => {
    // Clear any existing animation timeout
    if (animationTimeoutRef.current !== null) {
      window.clearTimeout(animationTimeoutRef.current);
    }

    // Apply pressed styles directly to the DOM element
    if (buttonRef.current) {
      buttonRef.current.classList.add('button-pressed');

      // Remove the class after animation completes
      animationTimeoutRef.current = window.setTimeout(() => {
        if (buttonRef.current) {
          buttonRef.current.classList.remove('button-pressed');
        }
        animationTimeoutRef.current = null;
      }, 100); // Shorter animation duration for faster feedback
    }
  };

  // Listen for the keybind
  useEffect(() => {
    if (!keybind) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Parse the keybind string
      const keys = keybind.toLowerCase().split('+');
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

        // Execute the action immediately
        onAction();

        // Trigger visual feedback animation (after action to avoid any delay)
        triggerAnimation();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keybind, onAction]);

  // Format keybind for display
  const formatKeybind = (kb: string) => {
    if (!kb) return '';
    return kb
      .split('+')
      .map((part) => {
        if (part.toLowerCase() === 'ctrl') return '⌃';
        if (part.toLowerCase() === 'shift') return '⇧';
        if (part.toLowerCase() === 'alt') return '⌥';
        return part.toUpperCase();
      })
      .join('+');
  };

  // Add a style tag for the animation class
  useEffect(() => {
    // Create a style element if it doesn't exist
    if (!document.getElementById('keybind-button-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'keybind-button-styles';
      styleEl.textContent = `
        .button-pressed {
          transform: scale(0.95) !important;
          filter: brightness(0.9) !important;
          box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.2) !important;
        }
      `;
      document.head.appendChild(styleEl);
    }

    return () => {
      // Clean up on unmount
      const styleEl = document.getElementById('keybind-button-styles');
      if (styleEl) {
        styleEl.remove();
      }
    };
  }, []);

  return (
    <Button
      ref={buttonRef}
      className={cn('relative transition-transform duration-75', className)}
      onClick={(e) => {
        // Execute action first
        onAction(e);
        // Then trigger animation
        triggerAnimation();
      }}
      {...props}
    >
      {children || label}
      {keybind && effectiveShowKeybindLabel && (
        <span className="absolute bottom-0.5 right-0.5 rounded bg-black/20 px-1 text-[8px] font-bold dark:bg-white/20">
          {formatKeybind(keybind)}
        </span>
      )}
    </Button>
  );
};

export default KeybindButton;
