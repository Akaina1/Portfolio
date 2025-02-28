'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AreaMap } from '@/components/Game/GameInterface/AreaMap';
import { terrainSymbols } from '@/components/Game/GameInterface/ASCII/terrainSymbols';

/**
 * Test Page Component
 * A blank page for testing components and layouts
 */
export default function TestPage() {
  // Original map data - never changes
  // Define the map data with useMemo to prevent unnecessary recreations
  const originalMapData = useMemo(
    () => [
      [
        'wall',
        'wall',
        'wall',
        'wall',
        'wall',
        'wall',
        'wall',
        'wall',
        'wall',
        'wall',
      ],
      [
        'wall',
        'floor',
        'floor',
        'floor',
        'floor',
        'floor',
        'floor',
        'floor',
        'floor',
        'wall',
      ],
      [
        'wall',
        'floor',
        'floor',
        'water',
        'water',
        'water',
        'floor',
        'floor',
        'floor',
        'wall',
      ],
      [
        'wall',
        'floor',
        'floor',
        'water',
        'water',
        'water',
        'floor',
        'floor',
        'floor',
        'wall',
      ],
      [
        'wall',
        'floor',
        'floor',
        'floor',
        'bridge',
        'floor',
        'floor',
        'floor',
        'floor',
        'wall',
      ],
      [
        'wall',
        'floor',
        'floor',
        'floor',
        'floor',
        'floor',
        'floor',
        'floor',
        'floor',
        'wall',
      ],
      [
        'wall',
        'floor',
        'tree',
        'tree',
        'floor',
        'floor',
        'floor',
        'chest',
        'floor',
        'wall',
      ],
      [
        'wall',
        'floor',
        'tree',
        'tree',
        'floor',
        'floor',
        'floor',
        'floor',
        'floor',
        'wall',
      ],
      [
        'wall',
        'floor',
        'floor',
        'floor',
        'floor',
        'floor',
        'floor',
        'floor',
        'floor',
        'wall',
      ],
      [
        'wall',
        'wall',
        'wall',
        'wall',
        'door',
        'door',
        'wall',
        'wall',
        'wall',
        'wall',
      ],
    ],
    []
  );

  // Use the original map data for game logic
  // setMapData not used in this component - fix later
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mapData, setMapData] = useState<string[][]>(originalMapData);

  // Player state
  const [playerPosition, setPlayerPosition] = useState({ x: 5, y: 5 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [movementCooldown, setMovementCooldown] = useState(0);
  const [lastAction, setLastAction] = useState('');

  // Movement validation - check if the target position is valid
  const validateMove = useCallback(
    (newX: number, newY: number) => {
      // Check bounds
      if (
        newX < 0 ||
        newY < 0 ||
        newX >= mapData[0].length ||
        newY >= mapData.length
      ) {
        return { valid: false, reason: 'Out of bounds' };
      }

      // Check terrain
      const targetTerrain = mapData[newY][newX];

      // Basic collision rules
      if (targetTerrain === 'wall') {
        return { valid: false, reason: 'Cannot move through walls' };
      }

      // Special terrain rules
      if (targetTerrain === 'water') {
        return { valid: false, reason: 'Cannot walk on water' };
      }

      // Valid move
      return { valid: true, terrain: targetTerrain };
    },
    [mapData]
  );

  // Process movement with simulated server delay
  const processMove = useCallback(
    async (direction: 'up' | 'down' | 'left' | 'right') => {
      if (isProcessing || movementCooldown > 0) {
        setLastAction(
          `Movement blocked: ${isProcessing ? 'Processing' : 'Cooldown'}`
        );
        return;
      }

      setIsProcessing(true);

      // Calculate new position
      let newX = playerPosition.x;
      let newY = playerPosition.y;

      switch (direction) {
        case 'up':
          newY -= 1;
          break;
        case 'down':
          newY += 1;
          break;
        case 'left':
          newX -= 1;
          break;
        case 'right':
          newX += 1;
          break;
      }

      // Validate move
      const validation = validateMove(newX, newY);

      // Simulate server processing
      await new Promise((resolve) => setTimeout(resolve, 200));

      if (validation.valid) {
        setPlayerPosition({ x: newX, y: newY });
        setLastAction(`Moved ${direction} to ${validation.terrain}`);

        // Set cooldown based on terrain
        setMovementCooldown(5);
      } else {
        setLastAction(`Cannot move ${direction}: ${validation.reason}`);
      }

      setIsProcessing(false);
    },
    [isProcessing, movementCooldown, playerPosition, validateMove]
  );

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          processMove('up');
          break;
        case 'ArrowDown':
        case 's':
          processMove('down');
          break;
        case 'ArrowLeft':
        case 'a':
          processMove('left');
          break;
        case 'ArrowRight':
        case 'd':
          processMove('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPosition, isProcessing, movementCooldown, processMove]);

  // Cooldown timer
  useEffect(() => {
    if (movementCooldown <= 0) return;

    const timer = setTimeout(() => {
      setMovementCooldown((prev) => prev - 1);
    }, 100);

    return () => clearTimeout(timer);
  }, [movementCooldown]);

  // Create renderable map with player
  const renderableMap = useMemo(() => {
    // Clone the map
    const mapWithPlayer = mapData.map((row) => [...row]);

    // Add player to the map
    mapWithPlayer[playerPosition.y][playerPosition.x] = 'player';

    return mapWithPlayer;
  }, [mapData, playerPosition]);

  // Create a static map for legend generation
  // This adds all terrain types including player to a small map
  // that won't change when the player moves
  const legendMap = useMemo(() => {
    // Create a small map with one of each terrain type from the original map
    // plus the player type
    const uniqueTerrains = new Set<string>();

    // Add all terrain types from the original map
    originalMapData.forEach((row) => {
      row.forEach((cell) => {
        uniqueTerrains.add(cell);
      });
    });

    // Add player type
    uniqueTerrains.add('player');

    // Convert to array
    const terrainArray = Array.from(uniqueTerrains);

    // Create a 1xN map with one cell for each terrain type
    return [terrainArray];
  }, [originalMapData]);

  return (
    <div className="container mx-auto min-h-screen p-8">
      <h1 className="mb-8 text-3xl font-bold">Movement Test</h1>

      <div className="rounded-lg border border-black p-6 dark:border-white">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Controls</h2>
          <p>Use arrow keys or WASD to move</p>
        </div>

        <div className="flex flex-col items-center">
          {/* Main game map with player */}
          <AreaMap
            mapData={renderableMap}
            roomName="Test Room"
            legend={false}
            legendData={legendMap}
          />

          {/* Hidden map just for legend generation */}
          <div className="sr-only">
            <AreaMap mapData={legendMap} roomName="Legend" legend={true} />
          </div>

          {/* Extract and display just the legend from the hidden map */}
          <div className="mt-4 grid grid-cols-4 gap-x-4 gap-y-1 text-sm">
            {Array.from(new Set(legendMap[0])).map((terrainType) => {
              // Import terrainSymbols directly here to access the data
              const terrain = terrainSymbols[terrainType];
              return (
                <div key={terrainType} className="flex items-center">
                  <span className={`mr-2 font-mono ${terrain.color}`}>
                    {terrain.symbol}
                  </span>
                  <span>{terrain.name}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded bg-gray-800 p-4 text-white">
            <p>
              Position: ({playerPosition.x}, {playerPosition.y})
            </p>
            <p>Cooldown: {movementCooldown}</p>
            <p>Status: {isProcessing ? 'Processing...' : 'Ready'}</p>
            <p>Last Action: {lastAction}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
