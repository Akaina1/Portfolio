import { CharacterClassResponse } from './CharacterResponse.types';

/**
 * Props for the ClassSelection component
 */
export interface ClassSelectionProps {
  availableClasses: CharacterClassResponse[];
  selectedClassId: string | null;
  onClassSelect: (classId: string) => void;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}
