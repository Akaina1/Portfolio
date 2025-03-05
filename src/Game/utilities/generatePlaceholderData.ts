// src/utils/placeholderGenerator.ts
import { MapPoint } from '../types/MapPoint.type';
import { LocationData } from '../components/GameInterface/LocationCard';

// Define difficulty levels with corresponding colors
export const DIFFICULTY_LEVELS = {
  BEGINNER: { label: 'Beginner', color: 'bg-green-500' },
  INTERMEDIATE: { label: 'Intermediate', color: 'bg-yellow-500' },
  ADVANCED: { label: 'Advanced', color: 'bg-orange-500' },
  EXPERT: { label: 'Expert', color: 'bg-red-500' },
  LEGENDARY: { label: 'Legendary', color: 'bg-purple-500' },
};

// Define resource types
export const RESOURCE_TYPES = [
  'Herbs',
  'Ore',
  'Wood',
  'Leather',
  'Cloth',
  'Gems',
  'Magic Essence',
];

// Define potential enemy types
export const ENEMY_TYPES = [
  'Bandits',
  'Wolves',
  'Undead',
  'Elementals',
  'Dragons',
  'Demons',
  'Cultists',
  'Wildlife',
  'Constructs',
];

// Define utility types
export const UTILITY_TYPES = {
  INN: { icon: '🛏️', label: 'Inn' },
  SHOP: { icon: '🛒', label: 'Shop' },
  BLACKSMITH: { icon: '⚒️', label: 'Blacksmith' },
  ALCHEMIST: { icon: '⚗️', label: 'Alchemist' },
  STABLE: { icon: '🐎', label: 'Stable' },
  BANK: { icon: '💰', label: 'Bank' },
  GUILD: { icon: '🏛️', label: 'Guild' },
  TAVERN: { icon: '🍺', label: 'Tavern' },
};

// Cache for generated location data
const locationDataCache: Record<string, LocationData> = {};

/**
 * Generate placeholder data based on MapPoint
 * Uses a deterministic approach based on the point ID to ensure consistent data
 *
 * @param point - The map point to generate data for
 * @returns LocationData object with consistent values for the same point
 */
export const generatePlaceholderData = (point: MapPoint): LocationData => {
  // Check if we already have cached data for this point
  if (locationDataCache[point.id]) {
    return locationDataCache[point.id];
  }

  // Extract the point ID number
  const idNumber = parseInt(point.id.replace(/\D/g, ''), 10);

  // Use the ID number as a seed for "random" values
  // This ensures the same point always gets the same values
  const seedValue = idNumber;

  // Deterministic "random" function based on the seed
  const pseudoRandom = (max: number, offset = 0): number => {
    return ((seedValue * 9301 + 49297 + offset) % 233280) % max;
  };

  // Determine difficulty based on ID number
  let difficulty: keyof typeof DIFFICULTY_LEVELS = 'BEGINNER';
  if (idNumber > 300) difficulty = 'LEGENDARY';
  else if (idNumber > 200) difficulty = 'EXPERT';
  else if (idNumber > 100) difficulty = 'ADVANCED';
  else if (idNumber > 50) difficulty = 'INTERMEDIATE';

  // Generate deterministic resources (1-3)
  const resourceCount = 1 + pseudoRandom(3);
  const resources: string[] = [];
  for (let i = 0; i < resourceCount; i++) {
    const resourceIndex = pseudoRandom(RESOURCE_TYPES.length, i * 100);
    const resource = RESOURCE_TYPES[resourceIndex];
    if (!resources.includes(resource)) {
      resources.push(resource);
    }
  }

  // Generate deterministic enemies (1-3)
  const enemyCount = 1 + pseudoRandom(3, 500);
  const enemies: string[] = [];
  for (let i = 0; i < enemyCount; i++) {
    const enemyIndex = pseudoRandom(ENEMY_TYPES.length, i * 200 + 500);
    const enemy = ENEMY_TYPES[enemyIndex];
    if (!enemies.includes(enemy)) {
      enemies.push(enemy);
    }
  }

  // Generate deterministic utilities (0-3)
  const utilityCount = pseudoRandom(4, 1000);
  const utilityKeys = Object.keys(
    UTILITY_TYPES
  ) as (keyof typeof UTILITY_TYPES)[];
  const utilities: (keyof typeof UTILITY_TYPES)[] = [];
  for (let i = 0; i < utilityCount; i++) {
    const utilityIndex = pseudoRandom(utilityKeys.length, i * 300 + 1000);
    const utility = utilityKeys[utilityIndex];
    if (!utilities.includes(utility)) {
      utilities.push(utility);
    }
  }

  // Determine if location is safe based on type and utilities
  const isSafe = point.type === 'city' || utilities.includes('INN');

  // Generate recommended level range based on difficulty
  let minLevel = 1,
    maxLevel = 10;
  switch (difficulty) {
    case 'BEGINNER':
      minLevel = 1;
      maxLevel = 10;
      break;
    case 'INTERMEDIATE':
      minLevel = 11;
      maxLevel = 20;
      break;
    case 'ADVANCED':
      minLevel = 21;
      maxLevel = 30;
      break;
    case 'EXPERT':
      minLevel = 31;
      maxLevel = 40;
      break;
    case 'LEGENDARY':
      minLevel = 41;
      maxLevel = 50;
      break;
  }

  // Generate climate based on point coordinates
  const climates = [
    'TROPICAL',
    'TEMPERATE',
    'ARID',
    'COLD',
    'ARCTIC',
    'MAGICAL',
  ];
  const climateIndex = Math.floor((point.y / 6000) * climates.length);
  const climate = climates[Math.min(climateIndex, climates.length - 1)];

  // Determine if location has questgivers (based on ID rather than random)
  const hasQuestgivers = pseudoRandom(10, 2000) < 3; // 30% chance

  // Generate description based on type and climate
  let description = '';
  switch (point.type) {
    case 'city':
      description = `A bustling ${climate.toLowerCase()} city with various services and opportunities.`;
      break;
    case 'landmark':
      description = `A notable ${climate.toLowerCase()} landmark that attracts visitors from far and wide.`;
      break;
    case 'point-of-interest':
      description = `An intriguing ${climate.toLowerCase()} location with unique features.`;
      break;
    case 'location':
      description = `A ${climate.toLowerCase()} area with various resources and potential dangers.`;
      break;
  }

  // Create the location data
  const locationData: LocationData = {
    id: point.id,
    name: point.label,
    type: point.type,
    description,
    difficulty,
    resources,
    enemies,
    utilities: utilities as (keyof typeof UTILITY_TYPES)[],
    isSafe,
    recommendedLevelRange: [minLevel, maxLevel] as [number, number],
    climate,
    hasQuestgivers,
  };

  // Cache the data for future renders
  locationDataCache[point.id] = locationData;

  return locationData;
};
