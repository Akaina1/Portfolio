import { useState, useEffect, RefObject } from 'react';

export function useMapInteraction(containerRef: RefObject<HTMLDivElement>) {
  const [scale, setScale] = useState(0.4);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showCoordinates, setShowCoordinates] = useState(true);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);

  // Handle zoom and pan
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const preventScrollAndZoom = (e: WheelEvent) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const mouseImageX = (mouseX - position.x) / scale;
      const mouseImageY = (mouseY - position.y) / scale;
      const delta = e.deltaY * -0.001;
      const newScale = Math.min(Math.max(0.1, scale + delta), 2);
      const newPosX = mouseX - mouseImageX * newScale;
      const newPosY = mouseY - mouseImageY * newScale;
      setScale(newScale);
      setPosition({ x: newPosX, y: newPosY });
    };

    container.addEventListener('wheel', preventScrollAndZoom, {
      passive: false,
    });
    return () => {
      container.removeEventListener('wheel', preventScrollAndZoom);
    };
  }, [scale, position, containerRef]);

  // Handle image loading
  useEffect(() => {
    const minLoadingTimeout = setTimeout(() => {
      if (!isMapReady) {
        setIsMapLoading(true);
      }
    }, 100);

    const maxLoadingTimeout = setTimeout(() => {
      setIsMapLoading(false);
      setIsMapReady(true);
    }, 5000);

    return () => {
      clearTimeout(minLoadingTimeout);
      clearTimeout(maxLoadingTimeout);
    };
  }, [isMapReady]);

  // Helper function for zooming centered on the viewport
  const zoomCentered = (newScale: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const centerImageX = (centerX - position.x) / scale;
    const centerImageY = (centerY - position.y) / scale;
    const newPosX = centerX - centerImageX * newScale;
    const newPosY = centerY - centerImageY * newScale;
    setScale(newScale);
    setPosition({ x: newPosX, y: newPosY });
  };

  // Handle mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('map-point')) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setPosition({ x: newX, y: newY });
  };

  const handleMouseMoveOnImage = (e: React.MouseEvent) => {
    if (isDragging) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const imageX = Math.round((mouseX - position.x) / scale);
    const imageY = Math.round((mouseY - position.y) / scale);
    setMousePos({ x: imageX, y: imageY });
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);
  const handleImageLoad = () => {
    setIsMapLoading(false);
    setIsMapReady(true);
  };

  // Function to center the map on a specific point
  const centerOnPoint = (x: number, y: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const newPosX = centerX - x * scale;
    const newPosY = centerY - y * scale;
    setPosition({ x: newPosX, y: newPosY });
  };

  return {
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
    centerOnPoint,
    setScale,
    setPosition,
  };
}
