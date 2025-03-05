import React from 'react';
import { CharacterClassResponse } from '@/types/CharacterResponse.types';
import AttributeDisplay from './AttributeDisplay';

/**
 * Props for the ClassDetails component
 */
interface ClassDetailsProps {
  characterClass: CharacterClassResponse;
  className?: string;
}

/**
 * ClassDetails Component
 *
 * Displays detailed information about a character class.
 * Shows attributes, resources, abilities, and other class-specific information.
 */
const ClassDetails: React.FC<ClassDetailsProps> = ({
  characterClass,
  className = '',
}) => {
  if (!characterClass) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">
          Select a class to view details
        </p>
      </div>
    );
  }

  // Format primary attributes for display
  const primaryAttributes = Object.entries(characterClass.baseAttributes).map(
    ([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
      max: 20, // Assuming max attribute value is 20
      description: getAttributeDescription(key),
    })
  );

  // Format secondary attributes for display
  const secondaryAttributes = characterClass.secondaryAttributeModifiers
    ? Object.entries(characterClass.secondaryAttributeModifiers).map(
        ([key, value]) => ({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          value,
          max: 10, // Assuming max secondary attribute value is 10
        })
      )
    : [];

  // Format derived attributes for display
  const _derivedAttributes = characterClass.attributeModifiers
    ?.derivedAttributeModifiers
    ? Object.entries(
        characterClass.attributeModifiers.derivedAttributeModifiers
      ).map(([key, value]) => ({
        name: formatAttributeName(key),
        value,
        max: 100, // Using percentage for derived attributes
      }))
    : [];

  return (
    <div
      className={`custom-scrollbar overflow-y-auto rounded-lg border border-gray-200 bg-white p-6 pr-2 shadow-sm dark:border-gray-700 dark:bg-gray-800/50 ${className}`}
    >
      {/* Class header */}
      <div className="mb-6 border-b border-gray-100 pb-4 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {characterClass.name}
        </h2>
        <div className="mt-2 flex items-center">
          <span className="mr-3 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300">
            {characterClass.category}
          </span>
          <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <span className="mr-1">Difficulty:</span>
            <span className="font-medium">{characterClass.difficulty}/5</span>
          </span>
        </div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          {characterClass.description}
        </p>
      </div>

      {/* Attributes section */}
      <div className="mb-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
          Base Attributes
        </h3>
        <AttributeDisplay
          attributes={primaryAttributes}
          compact={false}
          showDescriptions={true}
          className="w-full"
        />
      </div>

      {/* Secondary attributes */}
      {secondaryAttributes.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
            Secondary Attributes
          </h3>
          <AttributeDisplay
            attributes={secondaryAttributes}
            compact={false}
            className="w-full"
          />
        </div>
      )}

      {/* Resource system */}
      <div className="mb-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
          Resource System
        </h3>
        <div className="rounded-lg bg-gray-50 p-5 dark:bg-gray-800">
          <div className="mb-3 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-gray-700 dark:text-gray-300">
                {formatResourceType(characterClass.primaryResource.type)}
              </span>
              <span className="font-medium text-gray-600 dark:text-gray-400">
                Base: {characterClass.primaryResource.baseValue}
              </span>
            </div>
            <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <span className="font-medium">Growth:</span>{' '}
                {characterClass.primaryResource.growthPerLevel} per level
              </p>
              <p>
                <span className="font-medium">Regeneration:</span>{' '}
                {characterClass.primaryResource.regenBase} per tick
              </p>
            </div>
          </div>

          {characterClass.secondaryResource && (
            <div className="mt-5 border-t border-gray-200 pt-5 dark:border-gray-700">
              <div className="mb-3 flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-gray-700 dark:text-gray-300">
                    {formatResourceType(characterClass.secondaryResource.type)}
                  </span>
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    Base: {characterClass.secondaryResource.baseValue}
                  </span>
                </div>
                <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    <span className="font-medium">Growth:</span>{' '}
                    {characterClass.secondaryResource.growthPerLevel} per level
                  </p>
                  <p>
                    <span className="font-medium">Regeneration:</span>{' '}
                    {characterClass.secondaryResource.regenBase} per tick
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Class features */}
      {characterClass.classFeatures &&
        characterClass.classFeatures.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
              Class Features
            </h3>
            <div className="space-y-4">
              {characterClass.classFeatures.map((feature, index) => (
                <div
                  key={`feature-${feature.name}-${index}`}
                  className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">
                      {feature.name}
                    </h4>
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                      Level {feature.unlockedAtLevel}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Starting abilities */}
      {characterClass.startingAbilities &&
        characterClass.startingAbilities.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
              Starting Abilities
            </h3>
            <div className="flex flex-wrap gap-2">
              {characterClass.startingAbilities.map((ability, index) => (
                <span
                  key={`ability-${ability}-${index}`}
                  className="rounded-full bg-purple-100 px-3 py-1.5 text-sm font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                >
                  {ability}
                </span>
              ))}
            </div>
          </div>
        )}

      {/* Recommended playstyles */}
      {characterClass.recommendedPlaystyles &&
        characterClass.recommendedPlaystyles.length > 0 && (
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
              Recommended Playstyles
            </h3>
            <div className="flex flex-wrap gap-2">
              {characterClass.recommendedPlaystyles.map((style, index) => (
                <span
                  key={`style-${style}-${index}`}
                  className="rounded-full bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300"
                >
                  {style}
                </span>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};

/**
 * Format attribute name for display
 * Converts camelCase to Title Case with spaces
 */
const formatAttributeName = (name: string): string => {
  // Convert camelCase to space-separated words
  const spacedName = name.replace(/([A-Z])/g, ' $1');
  // Capitalize first letter and return
  return spacedName.charAt(0).toUpperCase() + spacedName.slice(1);
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
 * Get attribute description
 */
const getAttributeDescription = (attribute: string): string => {
  const descriptions: Record<string, string> = {
    strength: 'Increases physical damage and carrying capacity.',
    intelligence: 'Improves spell power and mana reserves.',
    dexterity: 'Enhances agility, accuracy, and dodge chance.',
    constitution: 'Boosts health and physical resilience.',
    wisdom: 'Increases mental resilience and perception.',
    charisma: 'Improves social interactions and certain abilities.',
    default: 'A core attribute of your character.',
  };

  return descriptions[attribute] || descriptions.default;
};

export default ClassDetails;
