import { useState, useRef } from 'react';
import Image from 'next/image';

export const ZoomableWorldMap: React.FC = () => {
  const [scale, setScale] = useState(0.2); // Start zoomed out to see the whole map
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle mouse wheel for zooming
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newScale = Math.min(Math.max(0.1, scale + delta), 2); // Limit zoom between 0.1x and 2x
    setScale(newScale);
  };

  // Handle mouse down to start dragging
  const handleMouseDown = (e: React.MouseEvent) => {
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

  return (
    <div className="flex flex-col items-center">
      <h3 className="mb-4 text-lg font-bold">Detailed World Map</h3>

      {/* Controls */}
      <div className="mb-4 flex gap-2">
        <button
          className="rounded bg-gray-200 px-2 py-1 text-xs dark:bg-gray-700"
          onClick={() => setScale((prev) => Math.min(prev + 0.1, 2))}
        >
          Zoom In (+)
        </button>
        <button
          className="rounded bg-gray-200 px-2 py-1 text-xs dark:bg-gray-700"
          onClick={() => setScale((prev) => Math.max(prev - 0.1, 0.1))}
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
        <span className="self-end text-xs">
          Use mouse wheel to zoom in/out, click and drag to pan the map
        </span>
      </div>

      {/* Map container with fixed dimensions */}
      <div
        ref={containerRef}
        className="relative h-[500px] w-full overflow-hidden border-2 border-gray-700 bg-gray-900"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* The actual map image with transform for zoom and position */}
        <div
          className="absolute cursor-move"
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
          />
        </div>

        {/* Zoom level indicator */}
        <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
          Zoom: {Math.round(scale * 100)}%
        </div>
      </div>
    </div>
  );
};
