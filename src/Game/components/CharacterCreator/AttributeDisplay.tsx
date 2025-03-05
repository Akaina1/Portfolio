import React from 'react';
import {
  AttributeDisplayProps,
  Attribute,
} from '../../types/AttributeDisplay.types';
/**
 * AttributeDisplay Component
 *
 * Visualizes character attributes using progress bars.
 * Can display primary attributes, secondary attributes, or any numeric character stats.
 * Supports customization of colors, labels, and layout.
 * Uses a fixed scale of 100 for all progress bars while only showing actual values.
 */
const AttributeDisplay: React.FC<AttributeDisplayProps> = ({
  attributes,
  title,
  showLabels = true,
  showValues = true,
  showDescriptions = false,
  compact = false,
  className = '',
}) => {
  // Fixed scale of 100 for all progress bars
  const FIXED_SCALE = 100;

  // Get color for attribute bar
  const getAttributeColor = (attribute: Attribute): string => {
    if (attribute.color) return attribute.color;

    // Default colors based on attribute name if not specified
    const colorMap: Record<string, string> = {
      strength: 'bg-red-500',
      intelligence: 'bg-blue-500',
      dexterity: 'bg-green-500',
      constitution: 'bg-yellow-500',
      wisdom: 'bg-purple-500',
      charisma: 'bg-pink-500',
      // Secondary attributes
      perception: 'bg-teal-500',
      willpower: 'bg-indigo-500',
      luck: 'bg-amber-500',
      focus: 'bg-cyan-500',
      // Derived attributes
      attackPower: 'bg-rose-500',
      spellPower: 'bg-violet-500',
      defense: 'bg-slate-500',
      evasion: 'bg-lime-500',
      // Default
      default: 'bg-gray-500',
    };

    const attributeName = attribute.name.toLowerCase();
    return colorMap[attributeName] || colorMap.default;
  };

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      {title && (
        <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">
          {title}
        </h3>
      )}

      <div
        className={`grid gap-2 ${
          compact ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {attributes.map((attribute, index) => {
          // Calculate percentage using fixed scale of 100
          const percentage = Math.min(100, Math.max(0, attribute.value));
          const color = getAttributeColor(attribute);

          return (
            <div
              key={`attr-${attribute.name}-${index}`}
              className="mb-3 w-full"
            >
              {/* Attribute header with name and value */}
              {showLabels && (
                <div className="mb-1 flex justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {attribute.name}
                  </span>
                  {showValues && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {attribute.value}
                    </span>
                  )}
                </div>
              )}

              {/* Progress bar */}
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className={`h-full rounded-full ${color}`}
                  style={{ width: `${percentage}%` }}
                  role="progressbar"
                  aria-valuenow={attribute.value}
                  aria-valuemin={0}
                  aria-valuemax={FIXED_SCALE}
                  aria-label={`${attribute.name}: ${attribute.value}`}
                />
              </div>

              {/* Description (optional) */}
              {showDescriptions && attribute.description && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {attribute.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttributeDisplay;
