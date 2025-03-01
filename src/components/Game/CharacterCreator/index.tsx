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
  { label: 'Class Selection', description: 'Choose your character class' },
  {
    label: 'Character Details',
    description: 'Customize appearance and backstory',
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
              appearance: {
                skinTone: 'light',
                hairStyle: 'short',
                hairColor: 'brown',
                faceStyle: 'neutral',
              },
              backstory: '',
            }}
            onSubmit={handleDetailsSubmit}
            className="mt-8"
          />
        ) : (
          <div className="mt-8 text-center">
            <p className="text-red-600">Please select a class first</p>
            <button
              onClick={() => goToStep(1)}
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white"
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
              appearance: {
                skinTone: 'light',
                hairStyle: 'short',
                hairColor: 'brown',
                faceStyle: 'neutral',
              },
              backstory: '',
            }}
            onSubmit={handleCreateCharacter}
            onBack={handleBack}
            isSubmitting={isSubmitting}
            className="mt-8"
          />
        ) : (
          <div className="mt-8 text-center">
            <p className="text-red-600">Missing character information</p>
            <button
              onClick={() => goToStep(1)}
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white"
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
            <p className="text-red-600">Character creation failed</p>
            <button
              onClick={() => goToStep(1)}
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white"
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
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Create Your Character
      </h1>

      {/* Step progress indicator */}
      <StepProgress
        steps={CREATION_STEPS}
        currentStep={currentStep}
        onStepClick={handleStepClick}
        className="mt-6"
      />

      {/* Step content */}
      {renderStepContent()}

      {/* Navigation buttons (only show on first two steps) */}
      {currentStep < 2 && (
        <div className="mt-8 flex justify-between">
          {currentStep > 0 ? (
            <button
              onClick={handleBack}
              className="rounded-md border border-gray-300 bg-white px-6 py-2 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back
            </button>
          ) : (
            <div></div> // Empty div to maintain flex layout
          )}

          {currentStep < 2 && (
            <button
              onClick={handleNext}
              disabled={!isNextEnabled()}
              className={`rounded-md px-6 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isNextEnabled()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'cursor-not-allowed bg-gray-300 text-gray-500'
              }`}
            >
              {currentStep === 0 ? 'Continue to Details' : 'Continue to Review'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CharacterCreator;
