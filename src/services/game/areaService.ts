import { MapData, MapError, MapDimensions } from '@/types/AreaMap.types';
import {
  getTerrainByKey,
  getTerrainByCode,
} from '@/components/Game/GameInterface/ASCII/terrainSymbols';
import {
  isValidTerrainCode,
  validateDimensions,
  getAdjacentPositions,
  isValidPosition,
} from '@/utilities/area-utils';

/**
 * Service for handling area map operations
 */
export class AreaService {
  /**
   * Gets a specific tile from encoded map data
   */
  static getTile(mapData: MapData, x: number, y: number): number {
    if (!isValidPosition(x, y, mapData.dimensions)) {
      throw new Error(MapError.OUT_OF_BOUNDS);
    }
    return mapData.tiles[y * mapData.dimensions.width + x];
  }

  /**
   * Sets a specific tile in encoded map data
   */
  static setTile(mapData: MapData, x: number, y: number, code: number): void {
    if (!isValidPosition(x, y, mapData.dimensions)) {
      throw new Error(MapError.OUT_OF_BOUNDS);
    }
    if (!isValidTerrainCode(code)) {
      throw new Error(MapError.INVALID_TERRAIN_CODE);
    }
    mapData.tiles[y * mapData.dimensions.width + x] = code;
  }

  /**
   * Creates an empty map with specified dimensions
   */
  static createEmptyMap(dimensions: MapDimensions): MapData {
    if (!validateDimensions(dimensions)) {
      throw new Error(MapError.INVALID_DIMENSIONS);
    }
    return {
      tiles: new Uint16Array(dimensions.width * dimensions.height),
      dimensions,
      version: 1,
    };
  }

  /**
   * Checks if a position is passable
   */
  static isPassable(mapData: MapData, x: number, y: number): boolean {
    try {
      const code = this.getTile(mapData, x, y);
      const terrain = getTerrainByCode(code);
      return terrain?.properties.passable ?? false;
    } catch {
      return false;
    }
  }

  /**
   * Gets all passable adjacent positions
   */
  static getPassableAdjacent(
    mapData: MapData,
    x: number,
    y: number,
    includeDiagonals = false
  ): { x: number; y: number }[] {
    return getAdjacentPositions(
      x,
      y,
      mapData.dimensions,
      includeDiagonals
    ).filter((pos) => this.isPassable(mapData, pos.x, pos.y));
  }

  /**
   * Validates an entire map's structure
   */
  static validateMap(mapData: MapData): boolean {
    return (
      mapData?.tiles instanceof Uint16Array &&
      validateDimensions(mapData.dimensions) &&
      mapData.tiles.length ===
        mapData.dimensions.width * mapData.dimensions.height
    );
  }

  /**
   * Converts MapData to a format suitable for saving/transmission
   */
  static serializeMap(mapData: MapData): string {
    return JSON.stringify({
      tiles: Array.from(mapData.tiles),
      dimensions: mapData.dimensions,
      version: mapData.version,
    });
  }

  /**
   * Recreates MapData from serialized format
   */
  static deserializeMap(serialized: string): MapData {
    try {
      const parsed = JSON.parse(serialized);
      return {
        ...parsed,
        tiles: new Uint16Array(parsed.tiles),
      };
    } catch {
      throw new Error(MapError.INVALID_DATA);
    }
  }

  /**
   * Creates a map with walls around the perimeter
   */
  static createWalledMap(dimensions: MapDimensions): MapData {
    // First create empty map
    const mapData = this.createEmptyMap(dimensions);

    // Get terrains
    const floorTerrain = getTerrainByKey('floor');
    const wallTerrain = getTerrainByKey('wall');

    // Check if terrains exist
    if (!floorTerrain) {
      throw new Error(
        `${MapError.INVALID_TERRAIN_CODE}: Could not find 'floor' terrain`
      );
    }
    if (!wallTerrain) {
      throw new Error(
        `${MapError.INVALID_TERRAIN_CODE}: Could not find 'wall' terrain`
      );
    }

    const floorCode = floorTerrain.code;
    const wallCode = wallTerrain.code;

    const { width, height } = dimensions;

    // Fill with floor
    mapData.tiles.fill(floorCode);

    // Add walls around perimeter
    for (let x = 0; x < width; x++) {
      this.setTile(mapData, x, 0, wallCode);
      this.setTile(mapData, x, height - 1, wallCode);
    }
    for (let y = 0; y < height; y++) {
      this.setTile(mapData, 0, y, wallCode);
      this.setTile(mapData, width - 1, y, wallCode);
    }

    return mapData;
  }

  /**
   * Fills an area of the map with a specific terrain
   */
  static fillArea(
    mapData: MapData,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    terrainCode: number
  ): void {
    const { width, height } = mapData.dimensions;
    const x1 = Math.max(0, Math.min(startX, endX));
    const x2 = Math.min(width - 1, Math.max(startX, endX));
    const y1 = Math.max(0, Math.min(startY, endY));
    const y2 = Math.min(height - 1, Math.max(startY, endY));

    for (let y = y1; y <= y2; y++) {
      for (let x = x1; x <= x2; x++) {
        this.setTile(mapData, x, y, terrainCode);
      }
    }
  }
}
