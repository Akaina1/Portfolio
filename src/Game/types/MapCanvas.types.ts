import { RefObject } from 'react';
import { MapPoint } from './MapPoint.type';

export interface MapCanvasProps {
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
