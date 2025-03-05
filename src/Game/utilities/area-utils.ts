import {
  TerrainCode,
  TerrainType,
  MapDimensions,
  MAX_MAP_DIMENSIONS,
  TerrainProperties,
} from '@/Game/types/AreaMap.types';
import { terrainRegistry } from '@/Game/components/GameInterface/ASCII/terrainSymbols';

/**
 * Type guard to check if a number is a valid terrain code
 */
export function isValidTerrainCode(code: number): code is TerrainCode {
  return Number.isInteger(code) && code >= 0 && code <= 65535;
}

/**
 * Type guard to check if a string is a valid terrain type
 */
export function isTerrainType(type: string): type is TerrainType {
  return ['base', 'natural', 'structure', 'object', 'entity'].includes(type);
}

/**
 * Validates map dimensions
 */
export function validateDimensions(dimensions: MapDimensions): boolean {
  return (
    dimensions.width > 0 &&
    dimensions.height > 0 &&
    dimensions.width <= MAX_MAP_DIMENSIONS.width &&
    dimensions.height <= MAX_MAP_DIMENSIONS.height
  );
}

/**
 * Validates a position within map dimensions
 */
export function isValidPosition(
  x: number,
  y: number,
  dimensions: MapDimensions
): boolean {
  return x >= 0 && x < dimensions.width && y >= 0 && y < dimensions.height;
}

/**
 * Converts 2D coordinates to 1D array index
 */
export function coordsToIndex(x: number, y: number, width: number): number {
  return y * width + x;
}

/**
 * Converts 1D array index to 2D coordinates
 */
export function indexToCoords(
  index: number,
  width: number
): { x: number; y: number } {
  return {
    x: index % width,
    y: Math.floor(index / width),
  };
}

/**
 * Checks if a terrain has a specific property
 */
export function hasTerrainProperty(
  terrainKey: string,
  property: keyof TerrainProperties
): boolean {
  const terrain = terrainRegistry[terrainKey];
  return Boolean(terrain?.properties?.[property]);
}

/**
 * Gets adjacent positions for a given coordinate
 */
export function getAdjacentPositions(
  x: number,
  y: number,
  dimensions: MapDimensions,
  includeDiagonals = false
): { x: number; y: number }[] {
  const directions = includeDiagonals
    ? [
        [-1, -1],
        [0, -1],
        [1, -1],
        [-1, 0],
        [1, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
      ]
    : [
        [0, -1],
        [-1, 0],
        [1, 0],
        [0, 1],
      ];

  return directions
    .map(([dx, dy]) => ({ x: x + dx, y: y + dy }))
    .filter((pos) => isValidPosition(pos.x, pos.y, dimensions));
}
