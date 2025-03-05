import { CharacterClassResponse } from './CharacterResponse.types';

/**
 * Props for the ClassDetailsPanel component
 */
export interface ClassDetailsPanelProps {
  selectedClass: CharacterClassResponse | null;
  isLoading: boolean;
  selectedClassId: string | null;
}
