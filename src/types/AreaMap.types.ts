/**
 * Constants defining the ranges for different tile types
 * Each range is exclusive of the next range's start
 */
export const TILE_RANGES = {
  BASE_TERRAIN: { start: 0, end: 255 },
  NATURAL: { start: 256, end: 511 },
  STRUCTURES: { start: 512, end: 1023 },
  OBJECTS: { start: 1024, end: 2047 },
  ENTITIES: { start: 2048, end: 4095 },
  RESERVED: { start: 4096, end: 65535 },
} as const;

/**
 * Valid terrain types for type checking
 */
export type TerrainType =
  | 'base'
  | 'natural'
  | 'structure'
  | 'object'
  | 'entity';

/**
 * Core map dimensions interface
 */
export interface MapDimensions {
  width: number;
  height: number;
}

/**
 * Raw map data structure using Uint16Array for efficient storage
 */
export interface MapData {
  /** The encoded tile data as Uint16Array */
  tiles: Uint16Array;
  /** Map dimensions */
  dimensions: MapDimensions;
  /** Format version for future compatibility */
  version: number;
  /** Optional checksum for data validation */
  checksum?: string;
}

/**
 * Complete terrain definition for a single tile type
 */
export interface TerrainDefinition {
  /** Unique numerical code (0-65535) */
  code: number;
  /** Terrain category */
  type: TerrainType;
  /** ASCII representation */
  symbol: string;
  /** Display name */
  name: string;
  /** Tailwind CSS color class */
  color: string;
  /** Terrain properties */
  properties: TerrainProperties;
}

/**
 * Properties that define terrain behavior
 */
export interface TerrainProperties {
  /** Whether entities can move through this terrain */
  passable: boolean;
  /** Whether this terrain can be interacted with */
  interactive?: boolean;
  /** Whether this terrain can be destroyed */
  destructible?: boolean;
  // add more as required
}

/**
 * Utility type for validating terrain codes
 */
export type TerrainCode = number;

/**
 * Helper type for terrain code ranges
 */
export type TerrainRange = (typeof TILE_RANGES)[keyof typeof TILE_RANGES];

/**
 * Utility type for terrain registry mapping
 */
export type TerrainRegistry = Map<TerrainCode, TerrainDefinition>;

/**
 * Error types for map operations
 */
export enum MapError {
  INVALID_DIMENSIONS = 'Invalid map dimensions',
  INVALID_TERRAIN_CODE = 'Invalid terrain code',
  OUT_OF_BOUNDS = 'Position out of bounds',
  INVALID_DATA = 'Invalid map data',
  VERSION_MISMATCH = 'Version mismatch',
}

/**
 * Current version of the map format
 */
export const CURRENT_MAP_VERSION = 1;

/**
 * Maximum allowed map dimensions
 */
export const MAX_MAP_DIMENSIONS = {
  width: 1000,
  height: 1000,
} as const;
