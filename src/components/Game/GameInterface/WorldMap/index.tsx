import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

/**
 * Interface defining a map point with position and metadata
 */
interface MapPoint {
  id: string;
  x: number; // X coordinate on the original image (in pixels)
  y: number; // Y coordinate on the original image (in pixels)
  label: string;
  type: 'city' | 'landmark' | 'point-of-interest';
}

export const ZoomableWorldMap: React.FC = () => {
  const [scale, setScale] = useState(0.2); // Start zoomed out to see the whole map
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Sample map points - easily editable
  // Coordinates are in pixels relative to the original image dimensions
  // Using underscore prefix to avoid ESLint warning since we're not using the setter in this component
  const [mapPoints, _setMapPoints] = useState<MapPoint[]>([
    { id: 'point1', x: 2000, y: 1000, label: 'Eldoria Lake', type: 'landmark' },
    { id: 'point2', x: 8000, y: 2000, label: 'Sunrest', type: 'city' },
    {
      id: 'point3',
      x: 5000,
      y: 3000,
      label: 'Crystal Bay',
      type: 'point-of-interest',
    },
    { id: 'point4', x: 12000, y: 1800, label: 'Aurelis', type: 'city' },
    {
      id: 'point5',
      x: 3500,
      y: 2500,
      label: 'Mistral Forest',
      type: 'landmark',
    },
  ]);

  // Prevent page scrolling when mouse is over the map container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const preventScrollAndZoom = (e: WheelEvent) => {
      e.preventDefault(); // Prevent default scrolling behavior

      // Apply zoom logic
      const delta = e.deltaY * -0.001;
      const newScale = Math.min(Math.max(0.1, scale + delta), 2);
      setScale(newScale);
    };

    container.addEventListener('wheel', preventScrollAndZoom, {
      passive: false,
    });

    return () => {
      container.removeEventListener('wheel', preventScrollAndZoom);
    };
  }, [scale, setScale]); // Include scale and setScale in dependencies

  // Handle point click
  const handlePointClick = (point: MapPoint) => {
    console.log(`Clicked on ${point.label} (${point.type})`);
    // You can add your custom logic here
  };

  // Handle mouse down to start dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start dragging if we're clicking on the map background, not a point
    if ((e.target as HTMLElement).classList.contains('map-point')) {
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
      default:
        return 'bg-gray-500 border-gray-700';
    }
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

      {/* Map legend */}
      <div className="mb-2 flex gap-4 text-xs">
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
      </div>

      {/* Map container with fixed dimensions */}
      <div
        ref={containerRef}
        className="relative h-[500px] w-full overflow-hidden border-2 border-gray-700 bg-gray-900"
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

          {/* Map Points - positioned absolutely within the transformed container */}
          {mapPoints.map((point) => (
            <div
              key={point.id}
              className={`map-point absolute z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-4 ${getPointStyle(point.type)} transition-all hover:h-14 hover:w-14 hover:border-white`}
              style={{
                left: `${point.x}px`,
                top: `${point.y}px`,
                transform: 'translate(-50%, -50%)', // Center the point on its coordinates
              }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering map drag
                handlePointClick(point);
              }}
              title={point.label}
            >
              <span className="sr-only">{point.label}</span>
            </div>
          ))}
        </div>

        {/* Zoom level indicator */}
        <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
          Zoom: {Math.round(scale * 100)}%
        </div>

        {/* Tooltip for the currently hovered point - could be implemented in the future */}
      </div>
    </div>
  );
};
