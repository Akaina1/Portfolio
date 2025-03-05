/**
 * Interface defining a map point with position and metadata
 */
export interface MapPoint {
  id: string;
  x: number; // X coordinate on the original image (in pixels)
  y: number; // Y coordinate on the original image (in pixels)
  label: string;
  type: 'city' | 'landmark' | 'point-of-interest' | 'location';
  visible: boolean; // Whether the point should be displayed on the map
}

// Create a new interface for the detailed location data
// to be used by the backend server
// location data will flow from backend to frontend via websocket
export interface LocationDetails {
  id: string;
  description: string;
  difficulty: string;
  resources: string[];
  enemies: string[];
  utilities: string[];
  isSafe: boolean;
  recommendedLevelRange: [number, number];
  climate: string;
  hasQuestgivers: boolean;
}
