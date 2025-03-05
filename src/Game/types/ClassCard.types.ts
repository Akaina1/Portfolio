/**
 * Props for the ClassCard component
 */
export interface ClassCardProps {
  _id: string;
  name: string;
  category: string;
  difficulty: number;
  description?: string;
  iconUrl?: string; // Not used in ASCII version
  isSelected: boolean;
  onSelect: (id: string) => void;
}
