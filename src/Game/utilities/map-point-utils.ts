import { MapPoint } from '../types/MapPoint.type';

/**
 * Function to add a new map point
 * @param points Current map points array
 * @param x X coordinate
 * @param y Y coordinate
 * @returns Updated map points array with new point added
 */
export const addMapPoint = (
  points: MapPoint[],
  x: number,
  y: number
): MapPoint[] => {
  // Find the highest numeric ID to determine the next ID
  const highestId = points.reduce((max, point) => {
    const idNumber = parseInt(point.id.replace(/\D/g, ''), 10);
    return isNaN(idNumber) ? max : Math.max(max, idNumber);
  }, 0);

  // Create new point with incremented ID
  const newPoint: MapPoint = {
    id: `point${highestId + 1}`,
    x,
    y,
    label: `Template ${highestId + 1}`,
    type: 'location',
    visible: true, // New points are visible by default
  };

  // Return new array with added point
  return [...points, newPoint];
};

/**
 * Function to toggle a point's visibility
 * @param points Current map points array
 * @param pointId ID of the point to toggle
 * @returns Updated map points array with toggled visibility
 */
export const togglePointVisibility = (
  points: MapPoint[],
  pointId: string
): MapPoint[] => {
  return points.map((point) =>
    point.id === pointId ? { ...point, visible: !point.visible } : point
  );
};

/**
 * Function to set a point's visibility
 * @param points Current map points array
 * @param pointId ID of the point to update
 * @param visible New visibility state
 * @returns Updated map points array with updated visibility
 */
export const setPointVisibility = (
  points: MapPoint[],
  pointId: string,
  visible: boolean
): MapPoint[] => {
  return points.map((point) =>
    point.id === pointId ? { ...point, visible } : point
  );
};

/**
 * Function to export map points as formatted code
 * @param points Map points array
 * @returns Formatted string representation of the map points array
 */
export const exportMapPointsAsCode = (points: MapPoint[]): string => {
  return `export const mapPoints: MapPoint[] = [
  ${points
    .map(
      (point) =>
        `  { id: '${point.id}', x: ${point.x}, y: ${point.y}, label: '${point.label}', type: '${point.type}', visible: ${point.visible} },`
    )
    .join('\n')}
  ];`;
};
