/**
 * Props for the EnemyDisplay component
 */
export interface EnemyDisplayProps {
  type: string;
  name: string;
  level: number;
  health: number;
  maxHealth: number;
  status?: string[];
}
