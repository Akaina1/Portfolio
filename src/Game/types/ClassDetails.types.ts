import { CharacterClassResponse } from './CharacterResponse.types';

/**
 * Props for the ClassDetails component
 */
export interface ClassDetailsProps {
  characterClass: CharacterClassResponse;
  className?: string;
}
