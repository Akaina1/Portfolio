import { useState, useCallback, useEffect } from 'react';
import { useCharacterStore } from '../stores/Game/characterStore';
import { useGameStore } from '../stores/Game/gameStore';
import { CharacterResponse } from '../types/CharacterResponse.types';
import characterService from '../services/character/characterService';

/**
 * Custom hook for managing the character creation flow
 *
 * This hook provides:
 * - Multi-step form state management
 * - Navigation between steps
 * - Form validation
 * - API interactions
 * - Error handling
 */
export const useCharacterCreation = () => {
  // Get state and actions from character store
  const {
    characterClasses,
    selectedClass,
    creationForm,
    isLoading,
    error,
    formErrors,
    fetchCharacterClasses,
    fetchCharacterClassById,
    setStep,
    setCharacterName,
    setSelectedClassId,
    setIsNameValid,
    setIsReviewComplete,
    resetForm,
    createCharacter,
    clearError,
    clearFormErrors,
    setFormError,
  } = useCharacterStore();

  // Get navigation methods from game store
  const { goToGame, goToCharacterSelection } = useGameStore();

  // Local state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCharacter, setCreatedCharacter] =
    useState<CharacterResponse | null>(null);

  // Extract values from form state
  const {
    step,
    characterName,
    selectedClassId,
    isNameValid,
    isReviewComplete,
  } = creationForm;

  /**
   * Initialize the character creation flow
   * Fetch character classes when the hook is first used
   */
  useEffect(() => {
    // Reset form when component mounts
    resetForm();

    // Load character classes
    fetchCharacterClasses();
  }, [fetchCharacterClasses, resetForm]);

  /**
   * Load character class details when a class is selected
   */
  useEffect(() => {
    if (selectedClassId) {
      fetchCharacterClassById(selectedClassId);
    }
  }, [selectedClassId, fetchCharacterClassById]);

  /**
   * Validate character name
   * Names must be 3-20 characters and contain only letters, numbers, and spaces
   */
  const validateName = useCallback(
    (name: string) => {
      clearFormErrors();

      if (!name || name.trim().length === 0) {
        setFormError('name', 'Name is required');
        setIsNameValid(false);
        return false;
      }

      if (name.length < 3) {
        setFormError('name', 'Name must be at least 3 characters');
        setIsNameValid(false);
        return false;
      }

      if (name.length > 20) {
        setFormError('name', 'Name must be less than 20 characters');
        setIsNameValid(false);
        return false;
      }

      // Check if name contains only allowed characters
      const nameRegex = /^[a-zA-Z0-9 ]+$/;
      if (!nameRegex.test(name)) {
        setFormError(
          'name',
          'Name can only contain letters, numbers, and spaces'
        );
        setIsNameValid(false);
        return false;
      }

      setIsNameValid(true);
      return true;
    },
    [clearFormErrors, setFormError, setIsNameValid]
  );

  /**
   * Handle character name change
   */
  const handleNameChange = useCallback(
    (name: string) => {
      setCharacterName(name);
      validateName(name);
    },
    [setCharacterName, validateName]
  );

  /**
   * Select a character class
   */
  const selectClass = useCallback(
    (classId: string) => {
      setSelectedClassId(classId);
    },
    [setSelectedClassId]
  );

  /**
   * Check if the current step is valid and can proceed
   */
  const canProceed = useCallback(() => {
    switch (step) {
      case 1: // Class Selection
        return !!selectedClassId;
      case 2: // Character Details
        return !!characterName && isNameValid;
      case 3: // Review
        return isReviewComplete;
      default:
        return false;
    }
  }, [step, selectedClassId, characterName, isNameValid, isReviewComplete]);

  /**
   * Move to the next step in the creation process
   */
  const nextStep = useCallback(() => {
    if (!canProceed()) return;

    if (step < 4) {
      setStep(step + 1);
    }
  }, [canProceed, step, setStep]);

  /**
   * Move to the previous step in the creation process
   */
  const prevStep = useCallback(() => {
    if (step > 1) {
      setStep(step - 1);
    }
  }, [step, setStep]);

  /**
   * Go to a specific step (if it's valid to do so)
   */
  const goToStep = useCallback(
    (targetStep: number) => {
      if (targetStep < 1 || targetStep > 3) return;

      // Can only jump to already visited steps or the next step
      if (targetStep <= step || (targetStep === step + 1 && canProceed())) {
        setStep(targetStep);
      }
    },
    [step, canProceed, setStep]
  );

  /**
   * Mark the review as complete
   */
  const completeReview = useCallback(() => {
    setIsReviewComplete(true);
  }, [setIsReviewComplete]);

  /**
   * Submit the character creation form
   */
  const submitCharacter = useCallback(async () => {
    if (!canProceed() || !selectedClassId || !characterName) {
      return null;
    }

    setIsSubmitting(true);
    clearError();

    try {
      const newCharacter = await createCharacter();

      if (newCharacter) {
        setCreatedCharacter(newCharacter);
        return newCharacter;
      }
      return null;
    } catch (err) {
      console.error('Error creating character:', err);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [canProceed, selectedClassId, characterName, clearError, createCharacter]);

  /**
   * Enter the game with the created character
   */
  const enterGame = useCallback(async () => {
    try {
      // Check character count to determine where to go
      const countResponse = await characterService.getCharacterCount();
      const characterCount = countResponse.characterCount;

      if (characterCount === 1 && createdCharacter) {
        // If only one character, set it and go directly to game
        useGameStore.getState().setCharacter({
          id: createdCharacter._id,
          name: createdCharacter.name,
        });
        goToGame();
      } else {
        // If multiple characters, go to selection screen
        goToCharacterSelection();
      }
    } catch (error) {
      console.error('Error checking character count:', error);
      // Default to character selection if there's an error
      goToCharacterSelection();
    }
  }, [createdCharacter, goToGame, goToCharacterSelection]);

  return {
    // Form state
    step,
    characterName,
    selectedClassId,
    selectedClass,
    characterClasses,
    isNameValid,
    isReviewComplete,
    isSubmitting,
    createdCharacter,

    // Form actions
    handleNameChange,
    selectClass,
    completeReview,

    // Navigation
    nextStep,
    prevStep,
    goToStep,
    canProceed,

    // Submission
    submitCharacter,
    enterGame,

    // UI state
    isLoading,
    error,
    formErrors,
  };
};
