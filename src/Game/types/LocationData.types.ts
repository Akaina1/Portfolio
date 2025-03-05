import { MapPoint } from './MapPoint.type';
import { UTILITY_TYPES } from '../utilities/generatePlaceholderData';
import { DIFFICULTY_LEVELS } from '../utilities/generatePlaceholderData';

// Interface for location data
// TODO: review duplicate type from MapPoint.type.ts
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

export interface LocationCardProps {
  point: MapPoint;
  position: { x: number; y: number };
  onClose?: () => void;
}
