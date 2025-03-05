'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AreaMap } from '@/components/Game/GameInterface/AreaMap';
import {
  getTerrainByCode,
  terrainRegistry,
} from '@/components/Game/GameInterface/ASCII/terrainSymbols';
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

  // Add new state for enemy position
  const [enemyPosition, setEnemyPosition] = useState({ x: 2, y: 2 });
  const [enemyLastMove, setEnemyLastMove] = useState('');

  // First, let's define the return type for validateMove
  type MoveValidation =
    | { valid: false; reason: string }
    | { valid: true; terrainCode: number };

  // Update validateMove to work with codes directly
  const validateMove = useCallback(
    (newX: number, newY: number): MoveValidation => {
      try {
        // Check if position is in bounds and passable
        if (!AreaService.isPassable(mapData, newX, newY)) {
          const code = AreaService.getTile(mapData, newX, newY);
          const terrain = getTerrainByCode(code);
          return {
            valid: false,
            reason: `Cannot move through ${terrain?.name.toLowerCase() ?? 'invalid terrain'}`,
          };
        }

        return {
          valid: true,
          terrainCode: AreaService.getTile(mapData, newX, newY),
        };
      } catch {
        return { valid: false, reason: 'Invalid position' };
      }
    },
    [mapData]
  );

  // Update processMove to use terrain codes
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

      const validation = validateMove(newX, newY);

      await new Promise((resolve) => setTimeout(resolve, 200));

      if (validation.valid) {
        setPlayerPosition({ x: newX, y: newY });
        const terrain = getTerrainByCode(validation.terrainCode);
        setLastAction(
          `Moved to ${terrain?.name.toLowerCase() ?? 'unknown terrain'}`
        );
        setMovementCooldown(5);
      } else {
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

  // Add enemy movement logic
  const moveEnemy = useCallback(() => {
    // Get possible directions
    const directions: ('up' | 'down' | 'left' | 'right')[] = [
      'up',
      'down',
      'left',
      'right',
    ];
    const randomDirection =
      directions[Math.floor(Math.random() * directions.length)];

    // Calculate new position
    let newX = enemyPosition.x;
    let newY = enemyPosition.y;

    switch (randomDirection) {
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

    // Validate move using the same logic as player
    const validation = validateMove(newX, newY);

    if (validation.valid) {
      setEnemyPosition({ x: newX, y: newY });
      setEnemyLastMove(`Moved ${randomDirection}`);
    } else {
      setEnemyLastMove(`Failed to move: ${validation.reason}`);
    }
  }, [enemyPosition, validateMove]);

  // Add enemy movement interval
  useEffect(() => {
    const interval = setInterval(() => {
      moveEnemy();
    }, 2000); // Move every 2 seconds

    return () => clearInterval(interval);
  }, [moveEnemy]);

  // Update renderableMap to include both player and enemy
  const renderableMap = useMemo(() => {
    const mapWithEntities = AreaService.createEmptyMap(mapData.dimensions);

    // Copy all tiles
    mapWithEntities.tiles.set(mapData.tiles);

    // Add enemy
    const enemyCode = terrainRegistry.enemy.code;
    AreaService.setTile(
      mapWithEntities,
      enemyPosition.x,
      enemyPosition.y,
      enemyCode
    );

    // Add player (last to ensure player is always visible)
    const playerCode = terrainRegistry.player.code;
    AreaService.setTile(
      mapWithEntities,
      playerPosition.x,
      playerPosition.y,
      playerCode
    );

    return mapWithEntities;
  }, [mapData, playerPosition, enemyPosition]);

  // Create legend map with codes
  const legendMap = useMemo<MapData>(() => {
    const terrainCodes = Object.values(terrainRegistry).map((t) => t.code);
    const legendMapData = AreaService.createEmptyMap({
      width: terrainCodes.length,
      height: 1,
    });

    terrainCodes.forEach((code, index) => {
      AreaService.setTile(legendMapData, index, 0, code);
    });

    return legendMapData;
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

          {/* Legend display */}
          <div className="mt-4 grid grid-cols-4 gap-x-4 gap-y-1 text-sm">
            {Object.values(terrainRegistry).map((terrain) => (
              <div key={terrain.code} className="flex items-center">
                <span className={`mr-2 font-mono ${terrain.color}`}>
                  {terrain.symbol}
                </span>
                <span>{terrain.name}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded bg-gray-800 p-4 text-white">
            <p>
              Player Position: ({playerPosition.x}, {playerPosition.y})
            </p>
            <p>
              Enemy Position: ({enemyPosition.x}, {enemyPosition.y})
            </p>
            <p>Player Cooldown: {movementCooldown}</p>
            <p>Status: {isProcessing ? 'Processing...' : 'Ready'}</p>
            <p>Player Last Action: {lastAction}</p>
            <p>Enemy Last Move: {enemyLastMove}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
