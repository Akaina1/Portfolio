import React, { useCallback } from 'react';
import { useCharacterCreation } from '@/hooks/useCharacterCreation';
import StepProgress from './StepProgress';
import ClassSelection from './ClassSelection';
import CharacterDetails, { CharacterFormValues } from './CharacterDetails';
import ReviewCharacter from './ReviewCharacter';
import CharacterCreationSuccess from './CharacterCreationSuccess';

/**
 * Steps in the character creation process
 */
const CREATION_STEPS = [
  { label: 'Class Selection', description: 'Choose class' },
  {
    label: 'Character Details',
    description: 'Customize backstory',
  },
  { label: 'Review', description: 'Review and confirm' },
  { label: 'Complete', description: 'Character created' },
];

/**
 * CharacterCreator Component
 *
 * Main container for the character creation process.
 * Manages the multi-step flow and state between steps.
 * Handles API calls for fetching classes and creating characters.
 */
const CharacterCreator: React.FC = () => {
  // Use the character creation hook for state management
  const {
    step,
    characterName,
    selectedClassId,
    selectedClass,
    characterClasses,
    isNameValid,
    isSubmitting,
    createdCharacter,
    handleNameChange,
    selectClass,
    completeReview,
    nextStep,
    prevStep,
    goToStep,
    submitCharacter,
    enterGame,
    isLoading,
    error,
  } = useCharacterCreation();

  // Map the current step from the hook to our component's step
  const currentStep = step - 1; // Hook uses 1-indexed steps, we use 0-indexed

  // Handle class selection
  const handleClassSelect = useCallback(
    (classId: string) => {
      selectClass(classId);
    },
    [selectClass]
  );

  // Handle character details submission
  const handleDetailsSubmit = useCallback(
    (values: CharacterFormValues) => {
      handleNameChange(values.name);
      nextStep();
    },
    [handleNameChange, nextStep]
  );

  // Handle character creation
  const handleCreateCharacter = useCallback(async () => {
    completeReview();
    await submitCharacter();
    nextStep();
  }, [completeReview, submitCharacter, nextStep]);

  // Handle back button
  const handleBack = useCallback(() => {
    prevStep();
  }, [prevStep]);

  // Handle step click in progress indicator
  const handleStepClick = useCallback(
    (stepIndex: number) => {
      // Add 1 to convert from 0-indexed to 1-indexed for the hook
      goToStep(stepIndex + 1);
    },
    [goToStep]
  );

  // Handle play now action from success screen
  const handlePlayNow = useCallback(() => {
    enterGame();
  }, [enterGame]);

  // Handle create another character action from success screen
  const handleCreateAnother = useCallback(() => {
    // Reset the character creation process
    window.location.href = '/game/characters/create';
  }, []);

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Class Selection
        return (
          <ClassSelection
            availableClasses={characterClasses}
            selectedClassId={selectedClassId || ''}
            onClassSelect={handleClassSelect}
            isLoading={isLoading}
            error={error}
            className="mt-8"
          />
        );

      case 1: // Character Details
        return selectedClass ? (
          <CharacterDetails
            selectedClass={selectedClass}
            initialValues={{
              name: characterName,
              gender: 'male',
              backstory: '',
            }}
            onSubmit={handleDetailsSubmit}
            className="mt-8"
          />
        ) : (
          <div className="mt-8 text-center">
            <p className="text-red-600 dark:text-red-400">
              Please select a class first
            </p>
            <button
              onClick={() => goToStep(1)}
              className="mt-4 rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Back to Class Selection
            </button>
          </div>
        );

      case 2: // Review
        return selectedClass ? (
          <ReviewCharacter
            characterClass={selectedClass}
            characterDetails={{
              name: characterName,
              gender: 'male',
              backstory: '',
            }}
            onSubmit={handleCreateCharacter}
            onBack={handleBack}
            isSubmitting={isSubmitting}
            className="mt-8"
          />
        ) : (
          <div className="mt-8 text-center">
            <p className="text-red-600 dark:text-red-400">
              Missing character information
            </p>
            <button
              onClick={() => goToStep(1)}
              className="mt-4 rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Start Over
            </button>
          </div>
        );

      case 3: // Success
        return createdCharacter ? (
          <CharacterCreationSuccess
            characterName={createdCharacter.name}
            characterClass={selectedClass?.name || ''}
            onPlayNow={handlePlayNow}
            onCreateAnother={handleCreateAnother}
            className="mt-8"
          />
        ) : (
          <div className="mt-8 text-center">
            <p className="text-red-600 dark:text-red-400">
              Character creation failed
            </p>
            <button
              onClick={() => goToStep(1)}
              className="mt-4 rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Try Again
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  // Determine if next button should be enabled
  const isNextEnabled = () => {
    switch (currentStep) {
      case 0:
        return !!selectedClassId;
      case 1:
        return !!characterName && isNameValid;
      default:
        return false;
    }
  };

  // Handle next button click
  const handleNext = () => {
    nextStep();
  };

  return (
    <div className="w-full max-w-none rounded-lg bg-white/50 px-8 py-2 shadow-lg dark:bg-gray-900/70">
      {/* Header and Progress section with max width */}
      <div className="mx-auto max-w-9xl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Create Your Character
          </h1>

          {/* Navigation buttons moved to top right */}
          {currentStep < 2 && (
            <div className="flex space-x-4">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="rounded-md border border-gray-300 bg-white px-6 py-2 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-800"
                >
                  Back
                </button>
              )}

              <button
                onClick={handleNext}
                disabled={!isNextEnabled()}
                className={`rounded-md px-6 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                  isNextEnabled()
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Step progress indicator */}
        <StepProgress
          steps={CREATION_STEPS}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          className="mt-6"
        />
      </div>

      {/* Step content - full width */}
      <div className="h-[820px] w-full rounded-lg bg-white/80 px-6 py-1 shadow-inner dark:bg-gray-800/50">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default CharacterCreator;
