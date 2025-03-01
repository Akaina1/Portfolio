import React from 'react';
import { CharacterClassResponse } from '@/types/CharacterResponse';
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
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
        <p className="text-gray-500">Select a class to view details</p>
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
      className={`rounded-lg border border-gray-200 bg-white p-6 shadow-sm ${className}`}
    >
      {/* Class header */}
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {characterClass.name}
        </h2>
        <div className="mt-2 flex items-center">
          <span className="mr-3 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
            {characterClass.category}
          </span>
          <span className="flex items-center text-sm text-gray-600">
            <span className="mr-1">Difficulty:</span>
            <span className="font-medium">{characterClass.difficulty}/5</span>
          </span>
        </div>
        <p className="mt-4 text-gray-600">{characterClass.description}</p>
      </div>

      {/* Attributes section */}
      <div className="mb-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          Base Attributes
        </h3>
        <AttributeDisplay
          attributes={primaryAttributes}
          compact={true}
          showDescriptions={true}
        />
      </div>

      {/* Secondary attributes */}
      {secondaryAttributes.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Secondary Attributes
          </h3>
          <AttributeDisplay attributes={secondaryAttributes} compact={true} />
        </div>
      )}

      {/* Resource system */}
      <div className="mb-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          Resource System
        </h3>
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-medium text-gray-700">
              {formatResourceType(characterClass.primaryResource.type)}
            </span>
            <span className="text-sm text-gray-600">
              Base: {characterClass.primaryResource.baseValue}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Grows by {characterClass.primaryResource.growthPerLevel} per level.
            Base regeneration: {characterClass.primaryResource.regenBase} per
            tick.
          </p>

          {characterClass.secondaryResource && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-medium text-gray-700">
                  {formatResourceType(characterClass.secondaryResource.type)}
                </span>
                <span className="text-sm text-gray-600">
                  Base: {characterClass.secondaryResource.baseValue}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Grows by {characterClass.secondaryResource.growthPerLevel} per
                level. Base regeneration:{' '}
                {characterClass.secondaryResource.regenBase} per tick.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Class features */}
      {characterClass.classFeatures &&
        characterClass.classFeatures.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Class Features
            </h3>
            <div className="space-y-3">
              {characterClass.classFeatures.map((feature, index) => (
                <div
                  key={`feature-${feature.name}-${index}`}
                  className="rounded-lg border border-gray-200 p-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-800">
                      {feature.name}
                    </h4>
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                      Level {feature.unlockedAtLevel}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
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
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Starting Abilities
            </h3>
            <div className="flex flex-wrap gap-2">
              {characterClass.startingAbilities.map((ability, index) => (
                <span
                  key={`ability-${ability}-${index}`}
                  className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700"
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
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Recommended Playstyles
            </h3>
            <div className="flex flex-wrap gap-2">
              {characterClass.recommendedPlaystyles.map((style, index) => (
                <span
                  key={`style-${style}-${index}`}
                  className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700"
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
 * Get description for primary attributes
 */
const getAttributeDescription = (attribute: string): string => {
  const descriptions: Record<string, string> = {
    strength: 'Increases physical damage and carrying capacity.',
    intelligence: 'Increases spell power and mana pool.',
    dexterity: 'Improves attack speed, ranged damage, and evasion.',
    constitution: 'Increases health points and physical resistance.',
    wisdom: 'Improves mana regeneration and magical resistance.',
    charisma: 'Enhances social interactions and certain magical abilities.',
  };

  return descriptions[attribute] || '';
};

export default ClassDetails;
