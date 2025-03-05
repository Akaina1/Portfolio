import { MapPoint } from './MapPoint.type';

export interface LocationCardWrapperProps {
  activePoint: MapPoint | null;
  position: { x: number; y: number };
  onClose: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
}
