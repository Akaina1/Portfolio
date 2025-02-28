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

  // Prevent page scrolling when mouse is over the map container
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
  }, [scale, position, setScale, setPosition]);

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

  // Handle point click - now with visibility toggle when in edit mode
  const handlePointClick = (point: MapPoint) => {
    if (isAddingPoints) {
      // In edit mode, toggle visibility
      const updatedPoints = togglePointVisibility(mapPoints, point.id);
      setMapPoints(updatedPoints);

      // Generate and log the code for the updated points array
      const code = exportMapPointsAsCode(updatedPoints);
      console.log('Updated map points:');
      console.log(code);

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
    console.log('Updated map points:');
    console.log(code);

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

          <span className="self-end text-xs">
            {isAddingPoints
              ? 'Click on the map to add new points. Click on existing points to toggle visibility.'
              : 'Use mouse wheel to zoom in/out, click and drag to pan the map'}
          </span>
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
            Click on points to toggle visibility
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
                  )} ${
                    !point.visible ? 'opacity-50' : ''
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
