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
