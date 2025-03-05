import {
  MapData,
  DecodedMapData,
  MapError,
  MapDimensions,
} from '@/types/AreaMap';
import {
  terrainRegistry,
  getTerrainByKey,
  getTerrainByCode,
} from '@/components/Game/GameInterface/ASCII/terrainSymbols';
import {
  isValidTerrainCode,
  validateDimensions,
  getAdjacentPositions,
} from '@/utilities/area-utils';

/**
 * Service for handling area map operations
 */
export class AreaService {
  /**
   * Converts string-based map data to encoded MapData format
   */
  static encodeMapData(stringMap: string[][]): MapData {
    // Validate input map
    if (!stringMap?.length || !stringMap[0]?.length) {
      throw new Error(MapError.INVALID_DATA);
    }

    const height = stringMap.length;
    const width = stringMap[0].length;
    const dimensions = { width, height };

    // Validate dimensions
    if (!validateDimensions(dimensions)) {
      throw new Error(MapError.INVALID_DIMENSIONS);
    }

    // Create Uint16Array for the map data
    const tiles = new Uint16Array(width * height);

    // Convert string terrain to codes
    for (let y = 0; y < height; y++) {
      if (stringMap[y].length !== width) {
        throw new Error(MapError.INVALID_DATA);
      }

      for (let x = 0; x < width; x++) {
        const terrainKey = stringMap[y][x];
        const terrain = getTerrainByKey(terrainKey);

        if (!terrain) {
          throw new Error(
            `${MapError.INVALID_TERRAIN_CODE}: Unknown terrain "${terrainKey}" at position (${x}, ${y})`
          );
        }

        tiles[y * width + x] = terrain.code;
      }
    }

    return {
      tiles,
      dimensions,
      version: 1,
    };
  }

  /**
   * Converts encoded MapData back to string-based format
   */
  static decodeMapData(mapData: MapData): DecodedMapData {
    // Validate input
    if (!mapData?.tiles || !mapData.dimensions) {
      throw new Error(MapError.INVALID_DATA);
    }

    const { width, height } = mapData.dimensions;

    // Validate dimensions
    if (!validateDimensions(mapData.dimensions)) {
      throw new Error(MapError.INVALID_DIMENSIONS);
    }

    // Validate array length matches dimensions
    if (mapData.tiles.length !== width * height) {
      throw new Error(MapError.INVALID_DATA);
    }

    // Create 2D array for decoded map
    const tiles: string[][] = Array(height)
      .fill(null)
      .map(() => Array(width).fill('empty'));

    // Convert codes back to terrain keys
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const code = mapData.tiles[y * width + x];
        const terrain = getTerrainByCode(code);

        if (!terrain) {
          throw new Error(
            `${MapError.INVALID_TERRAIN_CODE}: Unknown code ${code} at position (${x}, ${y})`
          );
        }

        // Find the terrain key by matching the terrain definition
        const terrainKey = Object.entries(terrainRegistry).find(
          ([_, def]) => def.code === code
        )?.[0];

        if (!terrainKey) {
          throw new Error(
            `${MapError.INVALID_TERRAIN_CODE}: No terrain key found for code ${code}`
          );
        }

        tiles[y][x] = terrainKey;
      }
    }

    return {
      tiles,
      dimensions: mapData.dimensions,
    };
  }

  /**
   * Gets a specific tile from encoded map data
   */
  static getTile(mapData: MapData, x: number, y: number): number {
    const { width, height } = mapData.dimensions;

    // Validate position
    if (x < 0 || x >= width || y < 0 || y >= height) {
      throw new Error(MapError.OUT_OF_BOUNDS);
    }

    return mapData.tiles[y * width + x];
  }

  /**
   * Sets a specific tile in encoded map data
   */
  static setTile(mapData: MapData, x: number, y: number, code: number): void {
    const { width, height } = mapData.dimensions;

    // Validate position
    if (x < 0 || x >= width || y < 0 || y >= height) {
      throw new Error(MapError.OUT_OF_BOUNDS);
    }

    // Validate terrain code
    if (!isValidTerrainCode(code)) {
      throw new Error(MapError.INVALID_TERRAIN_CODE);
    }

    mapData.tiles[y * width + x] = code;
  }

  /**
   * Creates an empty map with specified dimensions
   */
  static createEmptyMap(dimensions: MapDimensions): MapData {
    if (!validateDimensions(dimensions)) {
      throw new Error(MapError.INVALID_DIMENSIONS);
    }

    const { width, height } = dimensions;
    const tiles = new Uint16Array(width * height);
    const emptyCode = getTerrainByKey('empty')?.code;

    if (!emptyCode) {
      throw new Error(MapError.INVALID_TERRAIN_CODE);
    }

    // Fill with empty terrain
    tiles.fill(emptyCode);

    return {
      tiles,
      dimensions,
      version: 1,
    };
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

    // Get codes (we know they exist now)
    const floorCode = floorTerrain.code;
    const wallCode = wallTerrain.code;

    // Verify codes are numbers (typescript should catch this, but just in case)
    if (typeof floorCode !== 'number' || typeof wallCode !== 'number') {
      throw new Error(
        `${MapError.INVALID_TERRAIN_CODE}: Invalid terrain code type`
      );
    }

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

  /**
   * Creates a map from MapCreator format
   */
  static createFromMapCreator(
    mapName: string,
    stringMap: string[][]
  ): { mapData: MapData; name: string } {
    const mapData = this.encodeMapData(stringMap);
    return {
      mapData,
      name: mapName.replace(/\s+/g, ''),
    };
  }

  /**
   * Checks if a position is passable
   */
  static isPassable(mapData: MapData, x: number, y: number): boolean {
    const code = this.getTile(mapData, x, y);
    const terrain = getTerrainByCode(code);
    return terrain?.properties.passable ?? false;
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
    try {
      // Check basic structure
      if (!mapData?.tiles || !mapData.dimensions) return false;

      // Check dimensions
      if (!validateDimensions(mapData.dimensions)) return false;

      // Check array length
      const { width, height } = mapData.dimensions;
      if (mapData.tiles.length !== width * height) return false;

      // Check all terrain codes are valid
      for (let i = 0; i < mapData.tiles.length; i++) {
        if (!getTerrainByCode(mapData.tiles[i])) return false;
      }

      return true;
    } catch {
      return false;
    }
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
}
