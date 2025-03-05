import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../stores/Game/gameStore';
import MainDisplay from './MainDisplay/index';
import CommandConsole from './CommandConsole/index';
import ChatConsole from './ChatConsole/index';
import PlayerConsole from './PlayerConsole/index';
import EntityTimeBars from './EntityTimeBars/index';
import PartyTimeBars from './PartyTimeBars/index';
import { useGameInterfaceStore } from '../../stores/Game/gameInterfaceStore';

const GameInterface: React.FC = () => {
  const setConnected = useGameStore((state) => state.setConnected);
  const containerRef = useRef<HTMLDivElement>(null);
  const [availableHeight, setAvailableHeight] = useState(0);
  const { enableKeybinds } = useGameInterfaceStore();

  useEffect(() => {
    // Calculate available height accounting for the sticky header
    const calculateAvailableHeight = () => {
      if (containerRef.current) {
        // Get the container's position from the top of the viewport
        const containerTop = containerRef.current.getBoundingClientRect().top;
        // Calculate available height by subtracting the top position from viewport height
        const height = window.innerHeight - containerTop;
        setAvailableHeight(height);
      }
    };

    calculateAvailableHeight();
    window.addEventListener('resize', calculateAvailableHeight);

    // Socket connection simulation
    console.log('Connecting to game server...');
    setTimeout(() => {
      console.log('Connected to game server');
      setConnected(true);
    }, 1000);

    // Ensure keybinds are enabled when GameInterface mounts
    enableKeybinds();
    console.log('GameInterface mounted, ensuring keybinds are enabled');

    return () => {
      window.removeEventListener('resize', calculateAvailableHeight);
      console.log('Disconnecting from game server...');
      setConnected(false);
    };
  }, [setConnected, enableKeybinds]);

  return (
    <div
      ref={containerRef}
      className="w-full"
      style={{ height: `${availableHeight}px` }}
    >
      <div className="flex h-full p-4">
        {/* Left column - Split into top (EntityTimeBars) and bottom (PartyTimeBars) */}
        <div className="mr-2 flex w-[15%] flex-col">
          {/* Top: Entity Time Bars */}
          <div className="mb-2 h-[50%] overflow-hidden rounded-lg bg-white/50 shadow-lg dark:bg-white/5">
            <EntityTimeBars />
          </div>

          {/* Bottom: Party Time Bars */}
          <div className="h-[50%] overflow-hidden rounded-lg bg-white/50 shadow-lg dark:bg-white/5">
            <PartyTimeBars />
          </div>
        </div>

        {/* Middle column - Main content (70% of width) */}
        <div className="mr-2 flex w-[65%] flex-col">
          {/* Main Display - 60% of height */}
          <div className="mb-2 h-[60%] overflow-hidden rounded-lg bg-white/50 shadow-lg dark:bg-white/5">
            <MainDisplay />
          </div>

          {/* Command Console - 40% of height */}
          <div className="h-[40%] overflow-hidden rounded-lg bg-white/50 shadow-lg dark:bg-white/5">
            <CommandConsole />
          </div>
        </div>

        {/* Right column - Chat and Player consoles */}
        <div className="flex w-[20%] flex-col">
          {/* Chat Console */}
          <div className="mb-2 h-[60%] overflow-hidden rounded-lg bg-white/50 shadow-lg dark:bg-white/5">
            <ChatConsole />
          </div>

          {/* Player Console */}
          <div className="h-[40%] overflow-hidden rounded-lg bg-white/50 shadow-lg dark:bg-white/5">
            <PlayerConsole />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameInterface;
