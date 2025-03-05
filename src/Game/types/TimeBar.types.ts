export interface TimeBarProps {
  color: string; // Single color for simplicity
  segmentTime: number; // in milliseconds
  stopFill?: boolean;
  stopFillTime?: number; // in milliseconds
  slowBar?: number; // percentage (0.01 to 1)
  fastBar?: number; // percentage (1 to n)
  onSegmentComplete?: () => void;
  width?: string;
  height?: string;
  label?: string;
  showPercentage?: boolean;
  initialFill?: number; // 0 to 1
  entityId?: string; // for tracking multiple entities
  maxActionPoints?: number; // Maximum AP that can be stored
  currentActionPoints?: number; // Current AP for this entity
}
