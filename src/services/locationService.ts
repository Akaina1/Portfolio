import {
  MapPoint,
  LocationDetails,
} from '../components/Game/GameInterface/MapPoint/type';
import { generatePlaceholderData } from '../utilities/generatePlaceholderData';

// Cache for location details
const locationCache: Record<string, LocationDetails> = {};

export const LocationService = {
  /**
   * Get location details - currently uses placeholder generator
   * In the future, this will fetch data from the WebSocket
   */
  async getLocationDetails(point: MapPoint): Promise<LocationDetails> {
    // Return from cache if available
    if (locationCache[point.id]) {
      return locationCache[point.id];
    }

    // FUTURE: This is where we'll add WebSocket request logic
    // For now, use the existing placeholder generator

    // Simulate network delay for testing loading states
    // Remove this in production or when implementing real WebSocket
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Generate placeholder data
    const details = generatePlaceholderData(point);

    // Store in cache
    locationCache[point.id] = details;

    return details;
  },

  /**
   * Clear the location cache
   * Useful for development or when data changes
   */
  clearCache() {
    Object.keys(locationCache).forEach((key) => delete locationCache[key]);
  },
};
