import { TerrainDefinition, TILE_RANGES } from '@/Game/types/AreaMap.types';

console.log('Terrain module initialization');

// terrain symbols to consider:
// ░ ▒ ▓ - rock
// ¿ - unique?
// ? - quest giver?
// ╬ - cross?
// ■ - floor?

// unicode symbols instead?
// https://www.unicode.org/charts/nameslist/
// https://symbl.cc/en/unicode-table/
//

/**
 * Complete terrain registry using new TerrainDefinition format
 */
const terrainRegistry: Record<string, TerrainDefinition> = {
  // Base Terrain (0-255)
  floor: {
    code: TILE_RANGES.BASE_TERRAIN.start,
    type: 'base',
    symbol: '·',
    color: 'text-gray-400',
    name: 'Floor',
    properties: {
      passable: true,
    },
  },
  wall: {
    code: TILE_RANGES.BASE_TERRAIN.start + 1,
    type: 'base',
    symbol: '█',
    color: 'text-gray-700',
    name: 'Wall',
    properties: {
      passable: false,
      destructible: false,
    },
  },
  water: {
    code: TILE_RANGES.BASE_TERRAIN.start + 2,
    type: 'base',
    symbol: '~',
    color: 'text-blue-400',
    name: 'Water',
    properties: {
      passable: false,
    },
  },

  // Natural Features (256-511)
  tree: {
    code: TILE_RANGES.NATURAL.start,
    type: 'natural',
    symbol: '♣',
    color: 'text-green-700',
    name: 'Tree',
    properties: {
      passable: false,
      destructible: true,
    },
  },
  grass: {
    code: TILE_RANGES.NATURAL.start + 1,
    type: 'natural',
    symbol: '"',
    color: 'text-green-500',
    name: 'Grass',
    properties: {
      passable: true,
    },
  },
  mountain: {
    code: TILE_RANGES.NATURAL.start + 2,
    type: 'natural',
    symbol: '▲',
    color: 'text-gray-600',
    name: 'Mountain',
    properties: {
      passable: false,
    },
  },

  // Structures (512-1023)
  door: {
    code: TILE_RANGES.STRUCTURES.start,
    type: 'structure',
    symbol: '◙',
    color: 'text-yellow-800',
    name: 'Door',
    properties: {
      passable: true,
      interactive: true,
    },
  },
  bridge: {
    code: TILE_RANGES.STRUCTURES.start + 1,
    type: 'structure',
    symbol: '=',
    color: 'text-yellow-700',
    name: 'Bridge',
    properties: {
      passable: true,
    },
  },
  stairs_up: {
    code: TILE_RANGES.STRUCTURES.start + 2,
    type: 'structure',
    symbol: '<',
    color: 'text-gray-500',
    name: 'Stairs Up',
    properties: {
      passable: true,
      interactive: true,
    },
  },
  stairs_down: {
    code: TILE_RANGES.STRUCTURES.start + 3,
    type: 'structure',
    symbol: '>',
    color: 'text-gray-500',
    name: 'Stairs Down',
    properties: {
      passable: true,
      interactive: true,
    },
  },

  // Objects (1024-2047)
  chest: {
    code: TILE_RANGES.OBJECTS.start,
    type: 'object',
    symbol: '■',
    color: 'text-yellow-600',
    name: 'Chest',
    properties: {
      passable: false,
      interactive: true,
    },
  },
  altar: {
    code: TILE_RANGES.OBJECTS.start + 1,
    type: 'object',
    symbol: 'A',
    color: 'text-indigo-500',
    name: 'Altar',
    properties: {
      passable: false,
      interactive: true,
    },
  },
  trap: {
    code: TILE_RANGES.OBJECTS.start + 2,
    type: 'object',
    symbol: 'x',
    color: 'text-red-400',
    name: 'Trap',
    properties: {
      passable: true,
      interactive: true,
    },
  },

  // Entities (2048-4095)
  player: {
    code: TILE_RANGES.ENTITIES.start,
    type: 'entity',
    symbol: '@',
    color: 'text-blue-500 font-bold',
    name: 'Player',
    properties: {
      passable: false,
      interactive: true,
    },
  },
  enemy: {
    code: TILE_RANGES.ENTITIES.start + 1,
    type: 'entity',
    symbol: 'E',
    color: 'text-red-500',
    name: 'Enemy',
    properties: {
      passable: false,
      interactive: true,
    },
  },
  npc: {
    code: TILE_RANGES.ENTITIES.start + 2,
    type: 'entity',
    symbol: 'N',
    color: 'text-purple-500',
    name: 'NPC',
    properties: {
      passable: false,
      interactive: true,
    },
  },

  // Special
  empty: {
    code: TILE_RANGES.RESERVED.start,
    type: 'base',
    symbol: ' ',
    color: 'text-transparent',
    name: 'Empty',
    properties: {
      passable: true,
    },
  },
};

console.log('Terrain registry created:', {
  hasFloor: 'floor' in terrainRegistry,
  floorDef: terrainRegistry.floor,
  hasWall: 'wall' in terrainRegistry,
  wallDef: terrainRegistry.wall,
});

// Add debug logging to verify initialization
console.log('Initializing terrain registry with types:', TILE_RANGES);

// Add verification after registry creation
if (!terrainRegistry.wall || !terrainRegistry.floor) {
  console.error(
    'Critical terrain types missing from registry:',
    terrainRegistry
  );
}

/**
 * Get terrain definition by code
 */
export function getTerrainByCode(code: number): TerrainDefinition | undefined {
  return Object.values(terrainRegistry).find(
    (terrain) => terrain.code === code
  );
}

/**
 * Get terrain definition by key
 */
export function getTerrainByKey(key: string): TerrainDefinition | undefined {
  console.log('Getting terrain for key:', key);
  console.log('Available in registry:', key in terrainRegistry);
  console.log('Terrain value:', terrainRegistry[key]);
  return terrainRegistry[key];
}

/**
 * Check if terrain has specific property
 */
export function hasTerrainProperty(
  terrain: TerrainDefinition,
  property: string
): boolean {
  return Boolean(terrain.properties[property]);
}

// Export a function to verify terrain availability
export function verifyTerrainAvailability(requiredTypes: string[]): boolean {
  const missingTypes = requiredTypes.filter((type) => !terrainRegistry[type]);
  if (missingTypes.length > 0) {
    console.error('Missing required terrain types:', missingTypes);
    return false;
  }
  return true;
}

export { terrainRegistry };
