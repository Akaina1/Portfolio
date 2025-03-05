'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AreaMap } from '@/components/Game/GameInterface/AreaMap';
import { terrainRegistry } from '@/components/Game/GameInterface/ASCII/terrainSymbols';
import { AreaService } from '@/services/game/areaService';
import { MapData } from '@/types/AreaMap';

/**
 * Test Page Component
 * A blank page for testing components and layouts
 */
export default function TestPage() {
  // Example map data - you can replace this with any map from the creator
  const mapData = useMemo<MapData>(() => {
    const NewMapData = {
      tiles: [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 257, 257, 257, 257, 257, 2, 2, 2, 1, 1,
        257, 257, 257, 257, 257, 257, 2, 2, 1, 1, 257, 257, 257, 257, 257, 257,
        257, 2, 1, 1, 257, 257, 256, 257, 257, 257, 257, 257, 1, 1, 257, 257,
        257, 256, 256, 256, 257, 257, 1, 1, 257, 257, 257, 257, 256, 256, 257,
        257, 1, 1, 258, 257, 257, 257, 257, 257, 257, 257, 1, 1, 258, 258, 257,
        257, 257, 257, 257, 257, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      ],
      dimensions: { width: 10, height: 10 },
      version: 1,
    };

    // Parse the map data using AreaService
    return AreaService.deserializeMap(JSON.stringify(NewMapData));
  }, []);

  // Player state
  const [playerPosition, setPlayerPosition] = useState({ x: 5, y: 5 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [movementCooldown, setMovementCooldown] = useState(0);
  const [lastAction, setLastAction] = useState('');

  // First, let's define the return type for validateMove
  type MoveValidation =
    | { valid: false; reason: string }
    | { valid: true; terrainKey: string };

  // Update validateMove to explicitly return this type
  const validateMove = useCallback(
    (newX: number, newY: number): MoveValidation => {
      try {
        // Check if position is in bounds and passable
        if (!AreaService.isPassable(mapData, newX, newY)) {
          const terrainKey =
            AreaService.decodeMapData(mapData).tiles[newY][newX];
          const terrain = terrainRegistry[terrainKey];
          return {
            valid: false,
            reason: `Cannot move through ${terrain.name.toLowerCase()}`,
          };
        }

        return {
          valid: true,
          terrainKey: AreaService.decodeMapData(mapData).tiles[newY][newX],
        };
      } catch {
        return { valid: false, reason: 'Invalid position' };
      }
    },
    [mapData]
  );

  // Update processMove to use type guard
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
        // TypeScript now knows validation.terrainKey exists when valid is true
        setPlayerPosition({ x: newX, y: newY });
        setLastAction(
          `Moved to ${terrainRegistry[validation.terrainKey].name.toLowerCase()}`
        );
        setMovementCooldown(5);
      } else {
        // TypeScript now knows validation.reason exists when valid is false
        setLastAction(`Cannot move: ${validation.reason}`);
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
    // Create a copy of the map data
    const mapWithPlayer = AreaService.createEmptyMap(mapData.dimensions);

    // Copy all tiles
    mapWithPlayer.tiles.set(mapData.tiles);

    // Add player by getting the code for 'player' terrain
    const playerCode = terrainRegistry.player.code;
    AreaService.setTile(
      mapWithPlayer,
      playerPosition.x,
      playerPosition.y,
      playerCode
    );

    return mapWithPlayer;
  }, [mapData, playerPosition]);

  // Create legend map
  const legendMap = useMemo(() => {
    // Get all unique terrain types from the registry
    const terrainKeys = Object.keys(terrainRegistry);
    return [terrainKeys];
  }, []);

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
              const terrain = terrainRegistry[terrainType];
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
