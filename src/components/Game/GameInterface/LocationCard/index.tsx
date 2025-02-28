import React, { useMemo } from 'react';
import { MapPoint } from '../MapPoint/type';

// Define difficulty levels with corresponding colors
const DIFFICULTY_LEVELS = {
  BEGINNER: { label: 'Beginner', color: 'bg-green-500' },
  INTERMEDIATE: { label: 'Intermediate', color: 'bg-yellow-500' },
  ADVANCED: { label: 'Advanced', color: 'bg-orange-500' },
  EXPERT: { label: 'Expert', color: 'bg-red-500' },
  LEGENDARY: { label: 'Legendary', color: 'bg-purple-500' },
};

// Define resource types
const RESOURCE_TYPES = [
  'Herbs',
  'Ore',
  'Wood',
  'Leather',
  'Cloth',
  'Gems',
  'Magic Essence',
];

// Define potential enemy types
const ENEMY_TYPES = [
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
const UTILITY_TYPES = {
  INN: { icon: '🛏️', label: 'Inn' },
  SHOP: { icon: '🛒', label: 'Shop' },
  BLACKSMITH: { icon: '⚒️', label: 'Blacksmith' },
  ALCHEMIST: { icon: '⚗️', label: 'Alchemist' },
  STABLE: { icon: '🐎', label: 'Stable' },
  BANK: { icon: '💰', label: 'Bank' },
  GUILD: { icon: '🏛️', label: 'Guild' },
  TAVERN: { icon: '🍺', label: 'Tavern' },
};

// Interface for location data
export interface LocationData {
  id: string;
  name: string;
  type: string;
  description: string;
  difficulty: keyof typeof DIFFICULTY_LEVELS;
  resources: string[];
  enemies: string[];
  utilities: (keyof typeof UTILITY_TYPES)[];
  isSafe: boolean;
  recommendedLevelRange: [number, number];
  climate: string;
  hasQuestgivers: boolean;
}

// Cache for generated location data to prevent randomization on re-renders
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
  const locationData = {
    id: point.id,
    name: point.label,
    type: point.type,
    description,
    difficulty,
    resources,
    enemies,
    utilities,
    isSafe,
    recommendedLevelRange: [minLevel, maxLevel] as [number, number],
    climate,
    hasQuestgivers,
  };

  // Cache the data for future renders
  locationDataCache[point.id] = locationData;

  return locationData;
};

interface LocationCardProps {
  point: MapPoint;
  position: { x: number; y: number };
  onClose?: () => void;
}

/**
 * LocationCard component displays detailed information about a map location
 * when hovering over a map point
 *
 * @param point - The MapPoint data for the location
 * @param position - The position where the card should be displayed
 * @param onClose - Optional callback for closing the card
 */
export const LocationCard: React.FC<LocationCardProps> = ({
  point,
  position,
  onClose,
}) => {
  // Use useMemo to prevent regenerating data on every render
  const locationData = useMemo(() => generatePlaceholderData(point), [point]);

  // Get difficulty color class
  const difficultyInfo = DIFFICULTY_LEVELS[locationData.difficulty];

  // Determine card position to ensure it stays within viewport
  const cardStyle: React.CSSProperties = {
    left: `${position.x}px`,
    top: `${position.y}px`,
    maxWidth: '320px',
  };

  return (
    <div
      className="absolute z-50 rounded-lg border-2 border-gray-700 bg-gray-800 p-4 shadow-lg"
      style={cardStyle}
    >
      {/* Close button */}
      {onClose && (
        <button
          className="absolute right-2 top-2 text-gray-400 hover:text-white"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
      )}

      {/* Header with name and type */}
      <div className="mb-2">
        <h3 className="text-xl font-bold text-white">{locationData.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm capitalize text-gray-300">
            {locationData.type}
          </span>
          <span
            className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold text-white ${difficultyInfo.color}`}
          >
            {difficultyInfo.label}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="mb-3 text-sm text-gray-300">{locationData.description}</p>

      {/* Safety indicator */}
      <div className="mb-2 flex items-center">
        <span className="mr-2 text-sm font-semibold text-gray-300">
          Safety:
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${locationData.isSafe ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
        >
          {locationData.isSafe ? 'Safe Zone' : 'Dangerous'}
        </span>
      </div>

      {/* Level range */}
      <div className="mb-2 text-sm">
        <span className="font-semibold text-gray-300">Recommended Level:</span>
        <span className="ml-2 text-white">
          {locationData.recommendedLevelRange[0]} -{' '}
          {locationData.recommendedLevelRange[1]}
        </span>
      </div>

      {/* Climate */}
      <div className="mb-2 text-sm">
        <span className="font-semibold text-gray-300">Climate:</span>
        <span className="ml-2 capitalize text-white">
          {locationData.climate.toLowerCase()}
        </span>
      </div>

      {/* Resources */}
      {locationData.resources.length > 0 && (
        <div className="mb-2">
          <h4 className="text-sm font-semibold text-gray-300">Resources:</h4>
          <div className="flex flex-wrap gap-1">
            {locationData.resources.map((resource) => (
              <span
                key={resource}
                className="rounded-full bg-blue-900 px-2 py-0.5 text-xs text-white"
              >
                {resource}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Enemies */}
      {!locationData.isSafe && locationData.enemies.length > 0 && (
        <div className="mb-2">
          <h4 className="text-sm font-semibold text-gray-300">
            Potential Enemies:
          </h4>
          <div className="flex flex-wrap gap-1">
            {locationData.enemies.map((enemy) => (
              <span
                key={enemy}
                className="rounded-full bg-red-900 px-2 py-0.5 text-xs text-white"
              >
                {enemy}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Utilities */}
      {locationData.utilities.length > 0 && (
        <div className="mb-2">
          <h4 className="text-sm font-semibold text-gray-300">Services:</h4>
          <div className="flex flex-wrap gap-2">
            {locationData.utilities.map((utility) => (
              <div key={utility} className="flex items-center">
                <span className="mr-1">{UTILITY_TYPES[utility].icon}</span>
                <span className="text-xs text-white">
                  {UTILITY_TYPES[utility].label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quest indicator */}
      {locationData.hasQuestgivers && (
        <div className="mt-2 flex items-center">
          <span className="mr-2 text-yellow-500">❗</span>
          <span className="text-xs text-yellow-500">Quests Available</span>
        </div>
      )}
    </div>
  );
};

export default LocationCard;
