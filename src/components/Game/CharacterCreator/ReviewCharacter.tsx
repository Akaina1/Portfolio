import React from 'react';
import { CharacterClassResponse } from '@/types/CharacterResponse.types';
import { CharacterFormValues } from './CharacterDetails';
import AttributeDisplay from './AttributeDisplay';

/**
 * Props for the ReviewCharacter component
 */
interface ReviewCharacterProps {
  characterClass: CharacterClassResponse;
  characterDetails: CharacterFormValues;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
  className?: string;
}

/**
 * ReviewCharacter Component
 *
 * Third step in character creation process.
 * Displays a summary of the character for review before final submission.
 * Shows class details and character details.
 */
const ReviewCharacter: React.FC<ReviewCharacterProps> = ({
  characterClass,
  characterDetails,
  onSubmit,
  onBack,
  isSubmitting = false,
  className = '',
}) => {
  // Format attributes for display
  const attributes = Object.entries(characterClass.baseAttributes).map(
    ([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
      max: 20, // Assuming max attribute value is 20
    })
  );

  // Format secondary attributes if available
  const secondaryAttributes = characterClass.secondaryAttributeModifiers
    ? Object.entries(characterClass.secondaryAttributeModifiers).map(
        ([key, value]) => ({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          value,
          max: 10, // Assuming max secondary attribute value is 10
        })
      )
    : [];

  // Handle submit with confirmation
  const handleSubmit = () => {
    if (
      window.confirm(
        'Are you sure you want to create this character? This action cannot be undone.'
      )
    ) {
      onSubmit();
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Review Your Character
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Review your character details before finalizing. Once created, some
          aspects cannot be changed.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left column - Character summary */}
        <div className="custom-scrollbar max-h-[600px] space-y-6 overflow-y-auto pr-2">
          {/* Basic info */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/50">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
              Character Summary
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Name:
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {characterDetails.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Class:
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {characterClass.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Gender:
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {characterDetails.gender.charAt(0).toUpperCase() +
                    characterDetails.gender.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Backstory */}
          {characterDetails.backstory && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/50">
              <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
                Backstory
              </h3>
              <p className="whitespace-pre-line text-gray-600 dark:text-gray-400">
                {characterDetails.backstory}
              </p>
            </div>
          )}
        </div>

        {/* Right column - Class details */}
        <div className="custom-scrollbar max-h-[600px] space-y-6 overflow-y-auto pr-2">
          {/* Class info */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/50">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
              Class Information
            </h3>

            <div className="mb-3">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {characterClass.name}
              </span>
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                {characterClass.category}
              </span>
            </div>

            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              {characterClass.description}
            </p>

            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-600 dark:text-gray-400">
                Difficulty:
              </span>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 ${i < characterClass.difficulty ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>

          {/* Attributes */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/50">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
              Attributes
            </h3>
            <AttributeDisplay
              attributes={attributes}
              title="Primary Attributes"
            />

            {secondaryAttributes.length > 0 && (
              <div className="mt-4">
                <AttributeDisplay
                  attributes={secondaryAttributes}
                  title="Secondary Attributes"
                />
              </div>
            )}
          </div>

          {/* Resource system */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/50">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
              Resource System
            </h3>

            <div className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {formatResourceType(characterClass.primaryResource.type)}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Base: {characterClass.primaryResource.baseValue}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className={`h-full rounded-full ${getResourceColor(characterClass.primaryResource.type)}`}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {characterClass.secondaryResource && (
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {formatResourceType(
                        characterClass.secondaryResource.type
                      )}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Base: {characterClass.secondaryResource.baseValue}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-full rounded-full ${getResourceColor(characterClass.secondaryResource.type)}`}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-gray-300 bg-white px-6 py-2 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-800"
          disabled={isSubmitting}
        >
          Back to Details
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="rounded-md bg-purple-600 px-6 py-2 text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              Creating...
            </>
          ) : (
            'Create Character'
          )}
        </button>
      </div>
    </div>
  );
};

/**
 * Format resource type for display
 */
const formatResourceType = (type: string): string => {
  const resourceNames: Record<string, string> = {
    mana: 'Mana',
    rage: 'Rage',
    energy: 'Energy',
    focus: 'Focus',
    fury: 'Fury',
    chi: 'Chi',
    runicPower: 'Runic Power',
    soulShards: 'Soul Shards',
    astralPower: 'Astral Power',
    maelstrom: 'Maelstrom',
    insanity: 'Insanity',
    holyPower: 'Holy Power',
    default: 'Resource',
  };

  return resourceNames[type] || resourceNames.default;
};

/**
 * Get color for resource bar
 */
const getResourceColor = (type: string): string => {
  const resourceColors: Record<string, string> = {
    mana: 'bg-blue-500',
    rage: 'bg-red-500',
    energy: 'bg-yellow-500',
    focus: 'bg-green-500',
    fury: 'bg-purple-500',
    chi: 'bg-emerald-500',
    runicPower: 'bg-cyan-500',
    soulShards: 'bg-violet-500',
    astralPower: 'bg-indigo-500',
    maelstrom: 'bg-sky-500',
    insanity: 'bg-fuchsia-500',
    holyPower: 'bg-amber-500',
    default: 'bg-gray-500',
  };

  return resourceColors[type] || resourceColors.default;
};

export default ReviewCharacter;
