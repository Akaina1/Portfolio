import React, { RefObject } from 'react';
import Image from 'next/image';
import { MapPoint } from '../MapPoint/type';
import LocationCardWrapper from './LocationCardWrapper';

interface MapCanvasProps {
  containerRef: RefObject<HTMLDivElement>;
  scale: number;
  position: { x: number; y: number };
  isDragging: boolean;
  isMapReady: boolean;
  isMapLoading: boolean;
  isAddingPoints: boolean;
  showCoordinates: boolean;
  mousePos: { x: number; y: number };
  mapPoints: MapPoint[];
  showHiddenPoints: boolean;
  selectedSearchResult: MapPoint | null;
  activePoint: MapPoint | null;
  locationCardPosition: { x: number; y: number };
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: () => void;
  handleMouseLeave: () => void;
  handleMouseMoveOnImage: (e: React.MouseEvent) => void;
  handleMapClick: (e: React.MouseEvent) => void;
  handlePointClick: (point: MapPoint) => void;
  handlePointMouseEnter: (e: React.MouseEvent, point: MapPoint) => void;
  handlePointMouseLeave: () => void;
  handleImageLoad: () => void;
  setActivePoint: (point: MapPoint | null) => void;
}

const MapCanvas: React.FC<MapCanvasProps> = ({
  containerRef,
  scale,
  position,
  isDragging,
  isMapReady,
  isMapLoading,
  isAddingPoints,
  showCoordinates,
  mousePos,
  mapPoints,
  showHiddenPoints,
  selectedSearchResult,
  activePoint,
  locationCardPosition,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleMouseLeave,
  handleMouseMoveOnImage,
  handleMapClick,
  handlePointClick,
  handlePointMouseEnter,
  handlePointMouseLeave,
  handleImageLoad,
  setActivePoint,
}) => {
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

  return (
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
          className="max-w-none"
          width={16384}
          height={6286}
          priority
          unoptimized
          onLoad={handleImageLoad}
        />

        {/* Map Points */}
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
                {/* Visibility indicator */}
                {isAddingPoints && !point.visible && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-0.5 rotate-45 bg-gray-800"></div>
                  </div>
                )}
                <span className="sr-only">{point.label}</span>
              </div>
            ))}
      </div>

      {/* UI elements */}
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

          {/* Crosshair cursor */}
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

          {/* Mode indicator */}
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

      {/* Location card - render inside the map container */}
      {activePoint && (
        <LocationCardWrapper
          activePoint={activePoint}
          position={locationCardPosition}
          onClose={() => setActivePoint(null)}
          containerRef={containerRef}
        />
      )}
    </div>
  );
};

export default MapCanvas;
