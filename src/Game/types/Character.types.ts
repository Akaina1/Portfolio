import {
  CharacterClassResponse,
  CharacterResponse,
} from './CharacterResponse.types';

/**
 * Character Creation Form State
 *
 * Tracks the state of the character creation process
 */
interface CharacterCreationForm {
  step: number;
  characterName: string;
  selectedClassId: string | null;
  isNameValid: boolean;
  isReviewComplete: boolean;
}

/**
 * Character Store State Interface
 *
 * Manages character-related data including:
 * - Available character classes
 * - Character creation form state
 * - Selected class data
 * - Player's characters
 * - Loading/error states
 */
export interface CharacterState {
  // Character Data
  characterClasses: CharacterClassResponse[];
  selectedClass: CharacterClassResponse | null;
  playerCharacters: CharacterResponse[];

  // Form State
  creationForm: CharacterCreationForm;

  // UI States
  isLoading: boolean;
  error: string | null;
  formErrors: Record<string, string>;

  // Class Filtering
  classCategories: string[];
  selectedCategory: string | null;

  // Character Creation Actions
  resetForm: () => void;
  setStep: (step: number) => void;
  setCharacterName: (name: string) => void;
  setSelectedClassId: (classId: string | null) => void;
  setSelectedClass: (characterClass: CharacterClassResponse | null) => void;
  setIsNameValid: (isValid: boolean) => void;
  setIsReviewComplete: (isComplete: boolean) => void;

  // API Actions
  fetchCharacterClasses: () => Promise<void>;
  fetchCharacterClassById: (id: string) => Promise<void>;
  fetchPlayerCharacters: () => Promise<void>;
  createCharacter: () => Promise<CharacterResponse | null>;

  // Filter Actions
  setSelectedCategory: (category: string | null) => void;

  // Error Handling
  setError: (error: string | null) => void;
  setFormError: (field: string, message: string) => void;
  clearFormErrors: () => void;
  clearError: () => void;

  // Loading State
  setLoading: (isLoading: boolean) => void;
}
