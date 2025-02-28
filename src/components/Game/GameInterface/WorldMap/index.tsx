import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  MapPoint,
  addMapPoint,
  exportMapPointsAsCode,
  mapPoints as initialMapPoints,
  togglePointVisibility,
  // backend will use this to set the visibility of the point
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setPointVisibility,
} from './data';
import LocationCard from '../LocationCard';
import { generatePlaceholderData, LocationData } from '../LocationCard';

// Define search filter types
interface SearchFilters {
  label: string;
  type: string[];
  resources: string[];
  utilities: string[];
  enemies: string[];
  difficulty: string[];
  isSafe: boolean | null;
  minLevel: number | null;
  maxLevel: number | null;
  climate: string[];
  hasQuestgivers: boolean | null;
}

// Define initial search filters
const initialSearchFilters: SearchFilters = {
  label: '',
  type: [],
  resources: [],
  utilities: [],
  enemies: [],
  difficulty: [],
  isSafe: null,
  minLevel: null,
  maxLevel: null,
  climate: [],
  hasQuestgivers: null,
};

export const ZoomableWorldMap: React.FC = () => {
  const [scale, setScale] = useState(0.4); // Start zoomed out to see the whole map
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  // Add state for tracking mouse position on the image
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showCoordinates, setShowCoordinates] = useState(true); // Toggle for coordinate display
  const [isAddingPoints, setIsAddingPoints] = useState(false); // Toggle for point creation mode

  // Use the initialMapPoints from data.ts
  const [mapPoints, setMapPoints] = useState<MapPoint[]>(initialMapPoints);

  // State for code export modal
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportedCode, setExportedCode] = useState('');

  // Add state for showing hidden points in edit mode
  const [showHiddenPoints, setShowHiddenPoints] = useState(false);

  // Add loading state for the map image
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);

  // Add state for the active location card
  const [activePoint, setActivePoint] = useState<MapPoint | null>(null);
  const [locationCardPosition, setLocationCardPosition] = useState({
    x: 0,
    y: 0,
  });

  // Add hover timeout to prevent flickering
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Add search-related state
  const [showSearch, setShowSearch] = useState(false);
  const [searchFilters, setSearchFilters] =
    useState<SearchFilters>(initialSearchFilters);
  const [searchResults, setSearchResults] = useState<MapPoint[]>([]);
  const [selectedSearchResult, setSelectedSearchResult] =
    useState<MapPoint | null>(null);
  const [locationDataCache, setLocationDataCache] = useState<
    Record<string, LocationData>
  >({});

  // Log search filters when they change
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const preventScrollAndZoom = (e: WheelEvent) => {
      e.preventDefault(); // Prevent default scrolling behavior

      // Get container's bounding rectangle
      const rect = container.getBoundingClientRect();

      // Calculate mouse position relative to the container
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Calculate mouse position relative to the image
      const mouseImageX = (mouseX - position.x) / scale;
      const mouseImageY = (mouseY - position.y) / scale;

      // Calculate new scale
      const delta = e.deltaY * -0.001;
      const newScale = Math.min(Math.max(0.1, scale + delta), 2);

      // Calculate new position to keep mouse over the same image point
      const newPosX = mouseX - mouseImageX * newScale;
      const newPosY = mouseY - mouseImageY * newScale;

      // Update state
      setScale(newScale);
      setPosition({ x: newPosX, y: newPosY });
    };

    container.addEventListener('wheel', preventScrollAndZoom, {
      passive: false,
    });

    return () => {
      container.removeEventListener('wheel', preventScrollAndZoom);
    };
  }, [scale, position, setScale, setPosition, searchFilters]);

  // Handle image loading states
  useEffect(() => {
    // Set a timeout to ensure we show the loading state for at least a short time
    // even if the image loads very quickly from cache
    const minLoadingTimeout = setTimeout(() => {
      if (!isMapReady) {
        setIsMapLoading(true);
      }
    }, 100);

    // Set another timeout to handle cases where onLoad might not fire
    const maxLoadingTimeout = setTimeout(() => {
      setIsMapLoading(false);
      setIsMapReady(true);
    }, 5000); // 5 second fallback

    return () => {
      clearTimeout(minLoadingTimeout);
      clearTimeout(maxLoadingTimeout);
    };
  }, [isMapReady]);

  // Clean up hover timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Handle point click - now with visibility toggle when in edit mode
  const handlePointClick = (point: MapPoint) => {
    if (isAddingPoints) {
      // In edit mode, toggle visibility
      const updatedPoints = togglePointVisibility(mapPoints, point.id);
      setMapPoints(updatedPoints);

      // Generate and log the code for the updated points array
      const code = exportMapPointsAsCode(updatedPoints);

      // Set the exported code for the modal
      setExportedCode(code);
      setShowExportModal(true);
    } else {
      // Normal mode - just log the click
      console.log(
        `Clicked on ${point.label} (${point.type}), visible: ${point.visible}`
      );
      // You can add your custom logic here
    }
  };

  // Handle point hover to show location card
  const handlePointMouseEnter = (e: React.MouseEvent, point: MapPoint) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Set a small delay to prevent flickering on quick mouse movements
    hoverTimeoutRef.current = setTimeout(() => {
      // Get container's bounding rectangle
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      // Calculate position for the location card
      const pointScreenX = point.x * scale + position.x;
      const pointScreenY = point.y * scale + position.y;

      // Card dimensions (approximate)
      const cardWidth = 320;
      const cardHeight = 400; // Estimate based on content

      // Determine best position for the card
      // Try to position it to the right of the point first
      let cardX = pointScreenX + 20;
      let cardY = pointScreenY - cardHeight / 2;

      // Check if card would go off the right edge
      if (cardX + cardWidth > rect.width) {
        // Position to the left of the point instead
        cardX = pointScreenX - cardWidth - 20;
      }

      // If card would go off the left edge too, center it horizontally
      if (cardX < 0) {
        cardX = Math.max(
          10,
          Math.min(rect.width - cardWidth - 10, pointScreenX - cardWidth / 2)
        );
      }

      // Check if card would go off the top or bottom
      if (cardY < 0) {
        cardY = 10; // Keep a small margin from the top
      } else if (cardY + cardHeight > rect.height) {
        cardY = rect.height - cardHeight - 10; // Keep a small margin from the bottom
      }

      setLocationCardPosition({ x: cardX, y: cardY });
      setActivePoint(point);
    }, 200); // 200ms delay
  };

  // Handle point mouse leave to hide location card
  const handlePointMouseLeave = () => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Set a small delay before hiding to prevent flickering
    hoverTimeoutRef.current = setTimeout(() => {
      setActivePoint(null);
    }, 100);
  };

  // Add a function to track mouse position on the image
  const handleMouseMoveOnImage = (e: React.MouseEvent) => {
    if (isDragging) return; // Don't update coordinates while dragging

    // Get container's bounding rectangle
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Calculate mouse position relative to the container
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Convert to image coordinates by accounting for current position and scale
    const imageX = Math.round((mouseX - position.x) / scale);
    const imageY = Math.round((mouseY - position.y) / scale);

    setMousePos({ x: imageX, y: imageY });
  };

  // Handle map click for adding new points
  const handleMapClick = (e: React.MouseEvent) => {
    // Only add points if in adding mode and not clicking on an existing point
    if (
      !isAddingPoints ||
      (e.target as HTMLElement).classList.contains('map-point')
    ) {
      return;
    }

    // Add new point at current mouse position
    const updatedPoints = addMapPoint(mapPoints, mousePos.x, mousePos.y);
    setMapPoints(updatedPoints);

    // Generate and log the code for the updated points array
    const code = exportMapPointsAsCode(updatedPoints);

    // Set the exported code for the modal
    setExportedCode(code);
    setShowExportModal(true);
  };

  // Handle mouse down to start dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start dragging if we're clicking on the map background, not a point
    if ((e.target as HTMLElement).classList.contains('map-point')) {
      return;
    }

    // If in adding points mode, don't start dragging
    if (isAddingPoints) {
      return;
    }

    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  // Handle mouse move for panning
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setPosition({ x: newX, y: newY });
  };

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle mouse leave to stop dragging
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Get point style based on type
  const getPointStyle = (type: MapPoint['type']) => {
    switch (type) {
      case 'city':
        return 'bg-red-500 border-red-700';
      case 'landmark':
        return 'bg-blue-500 border-blue-700';
      case 'point-of-interest':
        return 'bg-green-500 border-green-700';
      case 'location':
        return 'bg-purple-500 border-purple-700';
      default:
        return 'bg-gray-500 border-gray-700';
    }
  };

  // Copy exported code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(exportedCode)
      .then(() => {
        alert('Code copied to clipboard!');
        setShowExportModal(false);
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  // Helper function for zooming centered on the viewport
  const zoomCentered = (newScale: number) => {
    if (!containerRef.current) return;

    // Get container dimensions
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate center position relative to the image
    const centerImageX = (centerX - position.x) / scale;
    const centerImageY = (centerY - position.y) / scale;

    // Calculate new position to keep center point fixed
    const newPosX = centerX - centerImageX * newScale;
    const newPosY = centerY - centerImageY * newScale;

    // Update state
    setScale(newScale);
    setPosition({ x: newPosX, y: newPosY });
  };

  // Handle image load completion
  const handleImageLoad = () => {
    setIsMapLoading(false);
    setIsMapReady(true);
  };

  // Function to center the map on a specific point
  const centerOnPoint = (point: MapPoint) => {
    if (!containerRef.current) return;

    // Get container dimensions
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate position to center the point
    const newPosX = centerX - point.x * scale;
    const newPosY = centerY - point.y * scale;

    // Update position
    setPosition({ x: newPosX, y: newPosY });

    // Highlight the point
    setSelectedSearchResult(point);

    // Hide search overlay when centering on a point from search results
    setShowSearch(false);

    // Clear the highlight after 3 seconds
    setTimeout(() => {
      setSelectedSearchResult(null);
    }, 3000);
  };

  // Function to handle search
  const handleSearch = () => {
    // Generate location data for all points if not already cached
    const updatedCache = { ...locationDataCache };

    // Filter points based on search criteria
    const results = mapPoints.filter((point) => {
      // Skip hidden points unless in edit mode with showHiddenPoints enabled
      if (!point.visible && (!isAddingPoints || !showHiddenPoints)) {
        return false;
      }

      // Get or generate location data
      let locationData = updatedCache[point.id];
      if (!locationData) {
        locationData = generatePlaceholderData(point);
        updatedCache[point.id] = locationData;
      }

      // Check label match (case insensitive)
      if (
        searchFilters.label &&
        !point.label.toLowerCase().includes(searchFilters.label.toLowerCase())
      ) {
        return false;
      }

      // Check type match
      if (
        searchFilters.type.length > 0 &&
        !searchFilters.type.includes(point.type)
      ) {
        return false;
      }

      // Check resources match
      if (
        searchFilters.resources.length > 0 &&
        !searchFilters.resources.some((resource) =>
          locationData.resources.includes(resource)
        )
      ) {
        return false;
      }

      // Check utilities match
      if (
        searchFilters.utilities.length > 0 &&
        !searchFilters.utilities.some((utility) =>
          locationData.utilities.some(
            (locUtility) => locUtility.toString() === utility
          )
        )
      ) {
        return false;
      }

      // Check enemies match
      if (
        searchFilters.enemies.length > 0 &&
        !searchFilters.enemies.some((enemy) =>
          locationData.enemies.includes(enemy)
        )
      ) {
        return false;
      }

      // Check difficulty match
      if (
        searchFilters.difficulty.length > 0 &&
        !searchFilters.difficulty.includes(locationData.difficulty)
      ) {
        return false;
      }

      // Check safety match
      if (
        searchFilters.isSafe !== null &&
        locationData.isSafe !== searchFilters.isSafe
      ) {
        return false;
      }

      // Check level range match
      if (
        searchFilters.minLevel !== null &&
        locationData.recommendedLevelRange[0] < searchFilters.minLevel
      ) {
        return false;
      }

      if (
        searchFilters.maxLevel !== null &&
        locationData.recommendedLevelRange[1] > searchFilters.maxLevel
      ) {
        return false;
      }

      // Check climate match
      if (
        searchFilters.climate.length > 0 &&
        !searchFilters.climate.includes(locationData.climate)
      ) {
        return false;
      }

      // Check quest availability match
      if (
        searchFilters.hasQuestgivers !== null &&
        locationData.hasQuestgivers !== searchFilters.hasQuestgivers
      ) {
        return false;
      }

      // If all checks pass, include this point in results
      return true;
    });

    // Update cache and search results
    setLocationDataCache(updatedCache);
    setSearchResults(results);
  };

  // Function to reset search filters
  const resetSearchFilters = () => {
    setSearchFilters(initialSearchFilters);
    setSearchResults([]);
  };

  // Function to update a single filter
  const updateFilter = (
    key: keyof SearchFilters,
    value: string | string[] | boolean | null | number
  ) => {
    setSearchFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Function to toggle a value in an array filter
  const toggleArrayFilter = (key: keyof SearchFilters, value: string) => {
    setSearchFilters((prev) => {
      const currentArray = prev[key] as string[];
      return {
        ...prev,
        [key]: currentArray.includes(value)
          ? currentArray.filter((item) => item !== value)
          : [...currentArray, value],
      };
    });
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className="mb-4 text-lg font-bold">Detailed World Map</h3>

      {/* Controls - only show when map is ready */}
      {isMapReady && (
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
            onClick={() => {
              setScale(0.2);
              setPosition({ x: 0, y: 0 });
            }}
          >
            Reset View
          </button>

          {/* Add coordinate toggle button */}
          <button
            className={`rounded px-2 py-1 text-xs ${
              showCoordinates
                ? 'bg-blue-500 text-white dark:bg-blue-700'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
            onClick={() => setShowCoordinates((prev) => !prev)}
          >
            {showCoordinates ? 'Hide Coordinates' : 'Show Coordinates'}
          </button>

          {/* Add point creation mode toggle */}
          <button
            className={`rounded px-2 py-1 text-xs ${
              isAddingPoints
                ? 'bg-green-500 text-white dark:bg-green-700'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
            onClick={() => setIsAddingPoints((prev) => !prev)}
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
              onClick={() => setShowHiddenPoints((prev) => !prev)}
            >
              {showHiddenPoints ? 'Hide Invisible Points' : 'Show All Points'}
            </button>
          )}

          {/* Add search toggle button */}
          <button
            className={`rounded px-2 py-1 text-xs ${
              showSearch
                ? 'bg-purple-500 text-white dark:bg-purple-700'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
            onClick={() => setShowSearch((prev) => !prev)}
          >
            {showSearch ? 'Hide Search' : 'Search Locations'}
          </button>

          <span className="self-end text-xs">
            {isAddingPoints
              ? 'Click on the map to add new points. Click on existing points to toggle visibility.'
              : 'Use mouse wheel to zoom in/out, click and drag to pan the map. Hover over points to see details.'}
          </span>
        </div>
      )}

      {/* Search panel */}
      {isMapReady && showSearch && (
        <div className="search-overlay mb-4 w-full rounded-lg border border-gray-700 bg-gray-800 p-4">
          <h4 className="mb-2 text-sm font-bold text-white">
            Search Locations
          </h4>

          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Name search */}
            <div>
              <label className="mb-1 block text-xs text-gray-300">
                Location Name
              </label>
              <input
                type="text"
                className="w-full rounded border border-gray-600 bg-gray-700 px-2 py-1 text-sm text-white"
                placeholder="Search by name..."
                value={searchFilters.label}
                onChange={(e) => updateFilter('label', e.target.value)}
              />
            </div>

            {/* Type filter */}
            <div>
              <label className="mb-1 block text-xs text-gray-300">
                Location Type
              </label>
              <div className="flex flex-wrap gap-1">
                {['city', 'landmark', 'point-of-interest', 'location'].map(
                  (type) => (
                    <button
                      key={type}
                      className={`rounded px-2 py-0.5 text-xs ${
                        searchFilters.type.includes(type)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-600 text-gray-300'
                      }`}
                      onClick={() => toggleArrayFilter('type', type)}
                    >
                      {type}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Resources filter */}
            <div>
              <label className="mb-1 block text-xs text-gray-300">
                Resources
              </label>
              <select
                className="w-full rounded border border-gray-600 bg-gray-700 px-2 py-1 text-sm text-white"
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    toggleArrayFilter('resources', e.target.value);
                  }
                }}
              >
                <option value="">Select resource...</option>
                {[
                  'Herbs',
                  'Ore',
                  'Wood',
                  'Leather',
                  'Cloth',
                  'Gems',
                  'Magic Essence',
                ].map((resource) => (
                  <option key={resource} value={resource}>
                    {resource}{' '}
                    {searchFilters.resources.includes(resource) ? '✓' : ''}
                  </option>
                ))}
              </select>
              {searchFilters.resources.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {searchFilters.resources.map((resource) => (
                    <span
                      key={resource}
                      className="flex items-center rounded bg-blue-900 px-1 py-0.5 text-xs text-white"
                    >
                      {resource}
                      <button
                        className="ml-1 text-xs text-gray-300 hover:text-white"
                        onClick={() => toggleArrayFilter('resources', resource)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Services filter */}
            <div>
              <label className="mb-1 block text-xs text-gray-300">
                Services
              </label>
              <select
                className="w-full rounded border border-gray-600 bg-gray-700 px-2 py-1 text-sm text-white"
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    toggleArrayFilter('utilities', e.target.value);
                  }
                }}
              >
                <option value="">Select service...</option>
                {[
                  'INN',
                  'SHOP',
                  'BLACKSMITH',
                  'ALCHEMIST',
                  'STABLE',
                  'BANK',
                  'GUILD',
                  'TAVERN',
                ].map((utility) => (
                  <option key={utility} value={utility}>
                    {utility}{' '}
                    {searchFilters.utilities.includes(utility) ? '✓' : ''}
                  </option>
                ))}
              </select>
              {searchFilters.utilities.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {searchFilters.utilities.map((utility) => (
                    <span
                      key={utility}
                      className="flex items-center rounded bg-purple-900 px-1 py-0.5 text-xs text-white"
                    >
                      {utility}
                      <button
                        className="ml-1 text-xs text-gray-300 hover:text-white"
                        onClick={() => toggleArrayFilter('utilities', utility)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Enemies filter */}
            <div>
              <label className="mb-1 block text-xs text-gray-300">
                Enemies
              </label>
              <select
                className="w-full rounded border border-gray-600 bg-gray-700 px-2 py-1 text-sm text-white"
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    toggleArrayFilter('enemies', e.target.value);
                  }
                }}
              >
                <option value="">Select enemy type...</option>
                {[
                  'Bandits',
                  'Wolves',
                  'Undead',
                  'Elementals',
                  'Dragons',
                  'Demons',
                  'Cultists',
                  'Wildlife',
                  'Constructs',
                ].map((enemy) => (
                  <option key={enemy} value={enemy}>
                    {enemy} {searchFilters.enemies.includes(enemy) ? '✓' : ''}
                  </option>
                ))}
              </select>
              {searchFilters.enemies.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {searchFilters.enemies.map((enemy) => (
                    <span
                      key={enemy}
                      className="flex items-center rounded bg-red-900 px-1 py-0.5 text-xs text-white"
                    >
                      {enemy}
                      <button
                        className="ml-1 text-xs text-gray-300 hover:text-white"
                        onClick={() => toggleArrayFilter('enemies', enemy)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Difficulty filter */}
            <div>
              <label className="mb-1 block text-xs text-gray-300">
                Difficulty
              </label>
              <div className="flex flex-wrap gap-1">
                {[
                  'BEGINNER',
                  'INTERMEDIATE',
                  'ADVANCED',
                  'EXPERT',
                  'LEGENDARY',
                ].map((diff) => (
                  <button
                    key={diff}
                    className={`rounded px-2 py-0.5 text-xs ${
                      searchFilters.difficulty.includes(diff)
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-600 text-gray-300'
                    }`}
                    onClick={() => toggleArrayFilter('difficulty', diff)}
                  >
                    {diff.charAt(0) + diff.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Safety filter */}
            <div>
              <label className="mb-1 block text-xs text-gray-300">Safety</label>
              <div className="flex gap-2">
                <button
                  className={`rounded px-2 py-0.5 text-xs ${
                    searchFilters.isSafe === true
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-600 text-gray-300'
                  }`}
                  onClick={() =>
                    updateFilter(
                      'isSafe',
                      searchFilters.isSafe === true ? null : true
                    )
                  }
                >
                  Safe Zones
                </button>
                <button
                  className={`rounded px-2 py-0.5 text-xs ${
                    searchFilters.isSafe === false
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-600 text-gray-300'
                  }`}
                  onClick={() =>
                    updateFilter(
                      'isSafe',
                      searchFilters.isSafe === false ? null : false
                    )
                  }
                >
                  Dangerous Areas
                </button>
              </div>
            </div>

            {/* Level range filter */}
            <div>
              <label className="mb-1 block text-xs text-gray-300">
                Level Range
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="w-16 rounded border border-gray-600 bg-gray-700 px-2 py-1 text-sm text-white"
                  placeholder="Min"
                  min="1"
                  max="50"
                  value={searchFilters.minLevel || ''}
                  onChange={(e) =>
                    updateFilter(
                      'minLevel',
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                />
                <span className="text-xs text-gray-400">to</span>
                <input
                  type="number"
                  className="w-16 rounded border border-gray-600 bg-gray-700 px-2 py-1 text-sm text-white"
                  placeholder="Max"
                  min="1"
                  max="50"
                  value={searchFilters.maxLevel || ''}
                  onChange={(e) =>
                    updateFilter(
                      'maxLevel',
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                />
              </div>
            </div>

            {/* Climate filter */}
            <div>
              <label className="mb-1 block text-xs text-gray-300">
                Climate
              </label>
              <div className="flex flex-wrap gap-1">
                {[
                  'TROPICAL',
                  'TEMPERATE',
                  'ARID',
                  'COLD',
                  'ARCTIC',
                  'MAGICAL',
                ].map((climate) => (
                  <button
                    key={climate}
                    className={`rounded px-2 py-0.5 text-xs ${
                      searchFilters.climate.includes(climate)
                        ? 'bg-teal-500 text-white'
                        : 'bg-gray-600 text-gray-300'
                    }`}
                    onClick={() => toggleArrayFilter('climate', climate)}
                  >
                    {climate.charAt(0) + climate.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Quest availability filter */}
            <div>
              <label className="mb-1 block text-xs text-gray-300">Quests</label>
              <div className="flex gap-2">
                <button
                  className={`rounded px-2 py-0.5 text-xs ${
                    searchFilters.hasQuestgivers === true
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-600 text-gray-300'
                  }`}
                  onClick={() =>
                    updateFilter(
                      'hasQuestgivers',
                      searchFilters.hasQuestgivers === true ? null : true
                    )
                  }
                >
                  Has Quests
                </button>
                <button
                  className={`rounded px-2 py-0.5 text-xs ${
                    searchFilters.hasQuestgivers === false
                      ? 'bg-gray-500 text-white'
                      : 'bg-gray-600 text-gray-300'
                  }`}
                  onClick={() =>
                    updateFilter(
                      'hasQuestgivers',
                      searchFilters.hasQuestgivers === false ? null : false
                    )
                  }
                >
                  No Quests
                </button>
              </div>
            </div>
          </div>

          {/* Search buttons */}
          <div className="flex justify-end gap-2">
            <button
              className="rounded bg-gray-600 px-3 py-1 text-sm text-white hover:bg-gray-500"
              onClick={resetSearchFilters}
            >
              Reset
            </button>
            <button
              className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-500"
              onClick={() => {
                handleSearch();
              }}
            >
              Search
            </button>
          </div>

          {/* Search results */}
          {searchResults.length > 0 && (
            <div className="mt-4">
              <h5 className="mb-2 text-sm font-semibold text-white">
                Results ({searchResults.length})
              </h5>
              <div className="max-h-40 overflow-y-auto rounded border border-gray-700 bg-gray-900 p-2">
                {searchResults.map((point) => (
                  <div
                    key={point.id}
                    className="mb-1 flex cursor-pointer items-center justify-between rounded px-2 py-1 hover:bg-gray-700"
                    onClick={() => centerOnPoint(point)}
                  >
                    <div>
                      <span className="text-sm font-medium text-white">
                        {point.label}
                      </span>
                      <span className="ml-2 text-xs text-gray-400">
                        ({point.type})
                      </span>
                    </div>
                    <button
                      className="rounded bg-blue-600 px-2 py-0.5 text-xs text-white hover:bg-blue-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        centerOnPoint(point);
                      }}
                    >
                      Center
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No results message */}
          {searchResults.length === 0 &&
            searchFilters !== initialSearchFilters && (
              <div className="mt-4 text-center text-sm text-gray-400">
                No locations match your search criteria.
              </div>
            )}
        </div>
      )}

      {/* Map legend - only show when map is ready */}
      {isMapReady && (
        <div className="mb-2 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center">
            <div className="mr-1 h-3 w-3 rounded-full bg-red-500"></div>
            <span>City</span>
          </div>
          <div className="flex items-center">
            <div className="mr-1 h-3 w-3 rounded-full bg-blue-500"></div>
            <span>Landmark</span>
          </div>
          <div className="flex items-center">
            <div className="mr-1 h-3 w-3 rounded-full bg-green-500"></div>
            <span>Point of Interest</span>
          </div>
          <div className="flex items-center">
            <div className="mr-1 h-3 w-3 rounded-full bg-purple-500"></div>
            <span>Location (New Points)</span>
          </div>
          <div className="flex items-center">
            <div className="mr-1 h-3 w-3 rounded-full bg-gray-300 opacity-50"></div>
            <span>Hidden Point</span>
          </div>
          <div className="ml-4 text-xs italic">
            {isAddingPoints
              ? 'Click on points to toggle visibility'
              : 'Hover over points to see location details'}
          </div>
        </div>
      )}

      {/* Map container with fixed dimensions */}
      <div
        ref={containerRef}
        className={`relative h-[500px] w-full overflow-hidden border-2 border-gray-700 bg-gray-900 ${
          isAddingPoints && isMapReady ? 'cursor-crosshair' : 'cursor-move'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={(e) => {
          handleMouseMove(e);
          handleMouseMoveOnImage(e);
        }}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClick={handleMapClick}
      >
        {/* Loading overlay */}
        {isMapLoading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gray-900">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
            <p className="text-lg font-semibold text-white">Loading map...</p>
          </div>
        )}

        {/* The actual map image with transform for zoom and position */}
        <div
          className={`absolute ${isAddingPoints ? '' : 'cursor-move'} ${
            !isMapReady ? 'invisible' : ''
          }`}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          }}
        >
          <Image
            src="/ultratest.jpg"
            alt="Detailed World Map"
            className="max-w-none" // Important to prevent the image from being constrained
            width={16384} // Original dimensions
            height={6286}
            priority
            unoptimized // For very large images that exceed Next.js optimization limits
            onLoad={handleImageLoad}
          />

          {/* Map Points - only show when map is ready */}
          {isMapReady &&
            mapPoints
              .filter(
                (point) => point.visible || (isAddingPoints && showHiddenPoints)
              )
              .map((point) => (
                <div
                  key={point.id}
                  className={`map-point absolute z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-4 ${getPointStyle(
                    point.type
                  )} ${!point.visible ? 'opacity-50' : ''} ${
                    selectedSearchResult && selectedSearchResult.id === point.id
                      ? 'animate-pulse border-white ring-4 ring-white'
                      : ''
                  } transition-all hover:h-14 hover:w-14 hover:border-white`}
                  style={{
                    left: `${point.x}px`,
                    top: `${point.y}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePointClick(point);
                  }}
                  onMouseEnter={(e) => handlePointMouseEnter(e, point)}
                  onMouseLeave={handlePointMouseLeave}
                  title={`${point.label}${!point.visible ? ' (Hidden)' : ''}`}
                >
                  {/* Add visibility indicator */}
                  {isAddingPoints && !point.visible && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-8 w-0.5 rotate-45 bg-gray-800"></div>
                    </div>
                  )}
                  <span className="sr-only">{point.label}</span>
                </div>
              ))}
        </div>

        {/* UI elements - only show when map is ready */}
        {isMapReady && (
          <>
            {/* Zoom level indicator */}
            <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
              Zoom: {Math.round(scale * 100)}%
            </div>

            {/* Coordinates display */}
            {showCoordinates && (
              <div className="absolute right-2 top-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                X: {mousePos.x}, Y: {mousePos.y}
              </div>
            )}

            {/* Crosshair cursor when coordinates are shown */}
            {showCoordinates && !isDragging && (
              <div
                className="pointer-events-none absolute z-20"
                style={{
                  left: `${mousePos.x * scale + position.x}px`,
                  top: `${mousePos.y * scale + position.y}px`,
                  width: '20px',
                  height: '20px',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-white/50"></div>
                <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-white/50"></div>
              </div>
            )}

            {/* Mode indicator - updated with visibility info */}
            {isAddingPoints && (
              <div className="absolute left-2 top-2 rounded bg-green-500/70 px-2 py-1 text-xs text-white">
                Point Creation Mode: Click to add a new point
                {showHiddenPoints && (
                  <span className="ml-1">(Showing hidden points)</span>
                )}
              </div>
            )}
          </>
        )}

        {/* Location Card - show when hovering over a point */}
        {activePoint && (
          <LocationCard
            point={activePoint}
            position={locationCardPosition}
            onClose={() => setActivePoint(null)}
          />
        )}
      </div>

      {/* Coordinate helper text - only show when map is ready */}
      {isMapReady && showCoordinates && (
        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          Hover over the map to see coordinates.
        </div>
      )}

      {/* Export modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-[80vh] w-[80vw] max-w-3xl overflow-auto rounded-lg bg-white p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-bold">Updated Map Points</h3>
            <p className="mb-4 text-sm">
              Copy this code and update your data.ts file:
            </p>
            <pre className="mb-4 max-h-[40vh] overflow-auto rounded bg-gray-100 p-4 text-xs dark:bg-gray-900">
              {exportedCode}
            </pre>
            <div className="flex justify-end gap-2">
              <button
                className="rounded bg-gray-200 px-4 py-2 text-sm dark:bg-gray-700"
                onClick={() => setShowExportModal(false)}
              >
                Close
              </button>
              <button
                className="rounded bg-blue-500 px-4 py-2 text-sm text-white"
                onClick={copyToClipboard}
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
