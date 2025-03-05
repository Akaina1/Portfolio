import { CharacterFormValues } from './CharacterDetails.types';
import { CharacterClassResponse } from './CharacterResponse.types';

/**
 * Props for the ReviewCharacter component
 */
export interface ReviewCharacterProps {
  characterClass: CharacterClassResponse;
  characterDetails: CharacterFormValues;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
  className?: string;
}
