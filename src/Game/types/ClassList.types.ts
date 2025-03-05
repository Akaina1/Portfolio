import { CharacterClassResponse } from './CharacterResponse.types';

/**
 * Props for the ClassList component
 */
export interface ClassListProps {
  classes: CharacterClassResponse[];
  selectedClassId: string | null;
  onClassSelect: (id: string) => void;
}
