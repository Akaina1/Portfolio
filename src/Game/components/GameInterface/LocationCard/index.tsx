import React, { useState, useEffect } from 'react';
import { LocationService } from '../../../services/location/locationService';
import {
  DIFFICULTY_LEVELS,
  UTILITY_TYPES,
} from '../../../utilities/generatePlaceholderData';
import {
  LocationCardProps,
  LocationData,
} from '../../../types/LocationData.types';

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
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchLocationData = async () => {
      try {
        setIsLoading(true);
        // Cast the result to LocationData to ensure type compatibility
        const data = (await LocationService.getLocationDetails(
          point
        )) as LocationData;

        if (isMounted) {
          setLocationData(data);
          setIsLoading(false);
        }
      } catch (_error) {
        // Prefix with underscore to indicate it's intentionally unused
        if (isMounted) {
          setError('Failed to load location details');
          setIsLoading(false);
        }
      }
    };

    fetchLocationData();

    return () => {
      isMounted = false;
    };
  }, [point]);

  // Determine card position
  const cardStyle: React.CSSProperties = {
    left: `${position.x}px`,
    top: `${position.y}px`,
    maxWidth: '320px',
    maxHeight: '80vh',
    overflowY: 'auto',
  };

  // Loading state
  if (isLoading) {
    return (
      <div
        className="absolute z-50 rounded-lg border-2 border-gray-700 bg-gray-800 p-4 shadow-lg"
        style={cardStyle}
      >
        <div className="flex items-center justify-center p-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
          <span className="ml-2 text-gray-300">Loading location data...</span>
        </div>
        {onClose && (
          <button
            className="absolute right-2 top-2 text-gray-400 hover:text-white"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        )}
      </div>
    );
  }

  // Error state
  if (error || !locationData) {
    return (
      <div
        className="absolute z-50 rounded-lg border-2 border-gray-700 bg-gray-800 p-4 shadow-lg"
        style={cardStyle}
      >
        <div className="text-center text-red-400">
          <p>{error || 'Unable to load location data'}</p>
        </div>
        {onClose && (
          <button
            className="absolute right-2 top-2 text-gray-400 hover:text-white"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        )}
      </div>
    );
  }

  // Get difficulty color class - fix the unused expression
  const difficultyInfo = DIFFICULTY_LEVELS[locationData.difficulty];

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
