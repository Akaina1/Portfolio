import { MapControlsProps } from '@/Game/types/MapControls.types';
import React from 'react';

const MapControls: React.FC<MapControlsProps> = ({
  isMapReady,
  scale,
  showCoordinates,
  isAddingPoints,
  showHiddenPoints,
  showSearch,
  zoomCentered,
  setShowCoordinates,
  setIsAddingPoints,
  setShowHiddenPoints,
  setShowSearch,
  resetView,
}) => {
  if (!isMapReady) return null;

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <button
        className="rounded bg-gray-200 px-2 py-1 text-xs dark:bg-gray-700"
        onClick={() => zoomCentered(Math.min(scale + 0.1, 2))}
      >
        Zoom In (+)
      </button>
      <button
        className="rounded bg-gray-200 px-2 py-1 text-xs dark:bg-gray-700"
        onClick={() => zoomCentered(Math.max(scale - 0.1, 0.1))}
      >
        Zoom Out (-)
      </button>
      <button
        className="rounded bg-gray-200 px-2 py-1 text-xs dark:bg-gray-700"
        onClick={resetView}
      >
        Reset View
      </button>

      {/* Coordinate toggle button */}
      <button
        className={`rounded px-2 py-1 text-xs ${
          showCoordinates
            ? 'bg-blue-500 text-white dark:bg-blue-700'
            : 'bg-gray-200 dark:bg-gray-700'
        }`}
        onClick={() => setShowCoordinates(!showCoordinates)}
      >
        {showCoordinates ? 'Hide Coordinates' : 'Show Coordinates'}
      </button>

      {/* Point creation mode toggle */}
      <button
        className={`rounded px-2 py-1 text-xs ${
          isAddingPoints
            ? 'bg-green-500 text-white dark:bg-green-700'
            : 'bg-gray-200 dark:bg-gray-700'
        }`}
        onClick={() => setIsAddingPoints(!isAddingPoints)}
      >
        {isAddingPoints ? 'Exit Point Creation' : 'Enter Point Creation'}
      </button>

      {/* Show hidden points toggle - only visible in edit mode */}
      {isAddingPoints && (
        <button
          className={`rounded px-2 py-1 text-xs ${
            showHiddenPoints
              ? 'bg-yellow-500 text-white dark:bg-yellow-700'
              : 'bg-gray-200 dark:bg-gray-700'
          }`}
          onClick={() => setShowHiddenPoints(!showHiddenPoints)}
        >
          {showHiddenPoints ? 'Hide Invisible Points' : 'Show All Points'}
        </button>
      )}

      {/* Search toggle button */}
      <button
        className={`rounded px-2 py-1 text-xs ${
          showSearch
            ? 'bg-purple-500 text-white dark:bg-purple-700'
            : 'bg-gray-200 dark:bg-gray-700'
        }`}
        onClick={() => setShowSearch(!showSearch)}
      >
        {showSearch ? 'Hide Search' : 'Search Locations'}
      </button>

      <span className="self-end text-xs">
        {isAddingPoints
          ? 'Click on the map to add new points. Click on existing points to toggle visibility.'
          : 'Use mouse wheel to zoom in/out, click and drag to pan the map. Hover over points to see details.'}
      </span>
    </div>
  );
};

export default MapControls;
