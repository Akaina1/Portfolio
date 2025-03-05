/**
 * Interface for a single attribute
 */
export interface Attribute {
  name: string;
  value: number;
  max?: number; // Keeping for backward compatibility
  color?: string;
  description?: string;
}

/**
 * Props for the AttributeDisplay component
 */
export interface AttributeDisplayProps {
  attributes: Attribute[];
  title?: string;
  showLabels?: boolean;
  showValues?: boolean;
  showDescriptions?: boolean;
  compact?: boolean;
  className?: string;
}
