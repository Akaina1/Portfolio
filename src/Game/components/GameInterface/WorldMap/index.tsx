import { useState, useRef, useEffect } from 'react';
import { MapPoint } from '../../../types/MapPoint.type';
import { mapPoints as initialMapPoints } from '../../../data/WorldMap.data';

// Import custom hooks
import { useMapInteraction } from '../../../hooks/useMapInteraction';
import { useMapPoints } from '../../../hooks/useMapPoints';
import { useSearch } from '../../../hooks/useSearch';

// Import components
import MapControls from './MapControls';
import SearchPanel from './SearchPanel';
import MapLegend from './MapLegend';
import MapCanvas from './MapCanvas';
import ExportModal from './ExportModal';

export const ZoomableWorldMap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Use custom hooks
  const {
    scale,
    position,
    isDragging,
    mousePos,
    showCoordinates,
    isMapLoading,
    isMapReady,
    setShowCoordinates,
    zoomCentered,
    handleMouseDown,
    handleMouseMove,
    handleMouseMoveOnImage,
    handleMouseUp,
    handleMouseLeave,
    handleImageLoad,
    centerOnPoint: centerMapOnPoint,
    setScale,
    setPosition,
  } = useMapInteraction(containerRef as React.RefObject<HTMLDivElement>);

  const {
    mapPoints,
    isAddingPoints,
    showHiddenPoints,
    showExportModal,
    exportedCode,
    selectedSearchResult,
    setIsAddingPoints,
    setShowHiddenPoints,
    handlePointClick,
    handleMapClick: handleMapPointClick,
    highlightSearchResult,
    copyToClipboard,
    setShowExportModal,
  } = useMapPoints(initialMapPoints);

  const {
    showSearch,
    searchFilters,
    searchResults,
    setShowSearch,
    handleSearch: executeSearch,
    resetSearchFilters,
    updateFilter,
    toggleArrayFilter,
  } = useSearch();

  // Add state for the active location card
  const [activePoint, setActivePoint] = useState<MapPoint | null>(null);
  const [locationCardPosition, setLocationCardPosition] = useState({
    x: 0,
    y: 0,
  });

  // Add hover timeout to prevent flickering
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up hover timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

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
    handleMapPointClick(mousePos.x, mousePos.y);
  };

  // Function to center the map on a specific point
  const centerOnPoint = (point: MapPoint) => {
    centerMapOnPoint(point.x, point.y);
    highlightSearchResult(point);
    setShowSearch(false); // Hide search panel when centering on a point
  };

  // Function to handle search
  const handleSearch = () => {
    executeSearch(mapPoints, showHiddenPoints, isAddingPoints);
  };

  // Function to reset view
  const resetView = () => {
    setScale(0.2);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className="mb-4 text-lg font-bold">Detailed World Map</h3>

      {/* Controls */}
      <MapControls
        isMapReady={isMapReady}
        scale={scale}
        showCoordinates={showCoordinates}
        isAddingPoints={isAddingPoints}
        showHiddenPoints={showHiddenPoints}
        showSearch={showSearch}
        zoomCentered={zoomCentered}
        setShowCoordinates={setShowCoordinates}
        setIsAddingPoints={setIsAddingPoints}
        setShowHiddenPoints={setShowHiddenPoints}
        setShowSearch={setShowSearch}
        resetView={resetView}
      />

      {/* Search panel */}
      <SearchPanel
        isMapReady={isMapReady}
        showSearch={showSearch}
        searchFilters={searchFilters}
        searchResults={searchResults}
        updateFilter={updateFilter}
        toggleArrayFilter={toggleArrayFilter}
        resetSearchFilters={resetSearchFilters}
        handleSearch={handleSearch}
        centerOnPoint={centerOnPoint}
      />

      {/* Map legend */}
      <MapLegend isMapReady={isMapReady} isAddingPoints={isAddingPoints} />

      {/* Map canvas */}
      <MapCanvas
        containerRef={containerRef as React.RefObject<HTMLDivElement>}
        scale={scale}
        position={position}
        isDragging={isDragging}
        isMapReady={isMapReady}
        isMapLoading={isMapLoading}
        isAddingPoints={isAddingPoints}
        showCoordinates={showCoordinates}
        mousePos={mousePos}
        mapPoints={mapPoints}
        showHiddenPoints={showHiddenPoints}
        selectedSearchResult={selectedSearchResult}
        activePoint={activePoint}
        locationCardPosition={locationCardPosition}
        handleMouseDown={handleMouseDown}
        handleMouseMove={handleMouseMove}
        handleMouseUp={handleMouseUp}
        handleMouseLeave={handleMouseLeave}
        handleMouseMoveOnImage={handleMouseMoveOnImage}
        handleMapClick={handleMapClick}
        handlePointClick={handlePointClick}
        handlePointMouseEnter={handlePointMouseEnter}
        handlePointMouseLeave={handlePointMouseLeave}
        handleImageLoad={handleImageLoad}
        setActivePoint={setActivePoint}
      />

      {/* Coordinate helper text */}
      {isMapReady && showCoordinates && (
        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          Hover over the map to see coordinates.
        </div>
      )}

      {/* Export modal */}
      <ExportModal
        showExportModal={showExportModal}
        exportedCode={exportedCode}
        onClose={() => setShowExportModal(false)}
        onCopy={copyToClipboard}
      />
    </div>
  );
};

export default ZoomableWorldMap;
