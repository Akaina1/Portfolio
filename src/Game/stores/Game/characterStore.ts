import { create } from 'zustand';
import { CharacterClassResponse } from '../../types/CharacterResponse.types';
import characterService from '../../services/character/characterService';
import { CharacterState } from '../../types/Character.types';

/**
 * Create Character Store
 *
 * Manages state for character creation, selection, and management
 */
export const useCharacterStore = create<CharacterState>((set, get) => ({
  // Initial Data State
  characterClasses: [],
  selectedClass: null,
  playerCharacters: [],

  // Initial Form State
  creationForm: {
    step: 1,
    characterName: '',
    selectedClassId: null,
    isNameValid: false,
    isReviewComplete: false,
  },

  // UI States
  isLoading: false,
  error: null,
  formErrors: {},

  // Class Filtering
  classCategories: [],
  selectedCategory: null,

  // Form Reset
  resetForm: () =>
    set({
      creationForm: {
        step: 1,
        characterName: '',
        selectedClassId: null,
        isNameValid: false,
        isReviewComplete: false,
      },
      selectedClass: null,
      error: null,
      formErrors: {},
    }),

  // Form Actions
  setStep: (step) =>
    set((state) => ({
      creationForm: { ...state.creationForm, step },
    })),

  setCharacterName: (characterName) =>
    set((state) => ({
      creationForm: { ...state.creationForm, characterName },
    })),

  setSelectedClassId: (selectedClassId) =>
    set((state) => ({
      creationForm: { ...state.creationForm, selectedClassId },
    })),

  setSelectedClass: (selectedClass) => set({ selectedClass }),

  setIsNameValid: (isNameValid) =>
    set((state) => ({
      creationForm: { ...state.creationForm, isNameValid },
    })),

  setIsReviewComplete: (isReviewComplete) =>
    set((state) => ({
      creationForm: { ...state.creationForm, isReviewComplete },
    })),

  // Error Handling
  setError: (error) => set({ error }),

  setFormError: (field, message) =>
    set((state) => ({
      formErrors: { ...state.formErrors, [field]: message },
    })),

  clearFormErrors: () => set({ formErrors: {} }),

  clearError: () => set({ error: null }),

  // Loading State
  setLoading: (isLoading) => set({ isLoading }),

  // API Actions
  fetchCharacterClasses: async () => {
    const { setLoading, setError } = get();
    setLoading(true);
    setError(null);

    try {
      const classes = await characterService.getCharacterClasses();

      // Extract unique categories from classes
      const categories = Array.from(
        new Set(classes.map((cls) => cls.category))
      );

      set({
        characterClasses: classes,
        classCategories: categories,
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to fetch character classes'
      );
      console.error('Error fetching character classes:', error);
    } finally {
      setLoading(false);
    }
  },

  fetchCharacterClassById: async (id) => {
    const { setLoading, setError, setSelectedClass, setSelectedClassId } =
      get();
    setLoading(true);
    setError(null);

    try {
      const characterClass = await characterService.getCharacterClassById(id);
      setSelectedClass(characterClass);
      setSelectedClassId(id);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to fetch character class'
      );
      console.error('Error fetching character class:', error);
    } finally {
      setLoading(false);
    }
  },

  fetchPlayerCharacters: async () => {
    const { setLoading, setError } = get();
    setLoading(true);
    setError(null);

    try {
      const response = await characterService.getPlayerCharacters();

      // Extract characters array from the response object
      const characters = response?.characters || [];

      // Set the characters array to state
      set({ playerCharacters: characters });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to fetch player characters'
      );
      console.error('Error fetching player characters:', error);
      // Set an empty array on error
      set({ playerCharacters: [] });
    } finally {
      setLoading(false);
    }
  },

  createCharacter: async () => {
    const { setLoading, setError, creationForm } = get();
    const { characterName, selectedClassId } = creationForm;

    if (!characterName || !selectedClassId) {
      setError('Character name and class are required');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const newCharacter = await characterService.createCharacter({
        name: characterName,
        classId: selectedClassId,
      });

      // Update the player characters list with the new character
      const response = await characterService.getPlayerCharacters();
      set({ playerCharacters: response.characters });

      return newCharacter;
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to create character'
      );
      console.error('Error creating character:', error);
      return null;
    } finally {
      setLoading(false);
    }
  },

  // Filter Actions
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
}));

/**
 * Get filtered character classes based on the selected category
 *
 * @returns Filtered array of character classes
 */
export const getFilteredCharacterClasses = (): CharacterClassResponse[] => {
  const { characterClasses, selectedCategory } = useCharacterStore.getState();

  if (!selectedCategory) {
    return characterClasses;
  }

  return characterClasses.filter((cls) => cls.category === selectedCategory);
};

/**
 * Check if the current step in the character creation process is valid
 *
 * @returns Whether the current step is valid and can proceed
 */
export const isCurrentStepValid = (): boolean => {
  const { creationForm, selectedClass } = useCharacterStore.getState();
  const { step, characterName, isNameValid, isReviewComplete } = creationForm;

  switch (step) {
    case 1: // Class Selection
      return !!selectedClass;
    case 2: // Character Details
      return !!characterName && isNameValid;
    case 3: // Review
      return isReviewComplete;
    default:
      return false;
  }
};
