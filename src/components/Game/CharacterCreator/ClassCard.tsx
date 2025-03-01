import React from 'react';
import Image from 'next/image';

/**
 * Props for the ClassCard component
 */
interface ClassCardProps {
  id: string;
  name: string;
  category: string;
  difficulty: number;
  description?: string;
  iconUrl?: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

/**
 * ClassCard Component
 *
 * Displays a character class option in a card format.
 * Shows class name, category, difficulty rating, and optional description.
 * Highlights the card when selected.
 */
const ClassCard: React.FC<ClassCardProps> = ({
  id,
  name,
  category,
  difficulty,
  description,
  iconUrl,
  isSelected,
  onSelect,
}) => {
  // Generate difficulty stars
  const difficultyStars = () => {
    const maxDifficulty = 5;
    const stars: React.ReactElement[] = [];

    for (let i = 1; i <= maxDifficulty; i++) {
      stars.push(
        <svg
          key={i}
          className={`h-4 w-4 ${i <= difficulty ? 'text-yellow-500' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  // Default placeholder image if none provided
  const _defaultImage = '/images/class-placeholder.jpg';

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-lg shadow-md transition-all duration-200 ${
        isSelected
          ? 'scale-105 transform border-2 border-blue-500 shadow-lg'
          : 'border border-gray-200 hover:border-blue-300 hover:shadow-lg'
      } `}
      onClick={() => onSelect(id)}
      role="button"
      aria-pressed={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(id);
        }
      }}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute right-2 top-2 z-10 rounded-full bg-blue-500 p-1">
          <svg
            className="h-4 w-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}

      {/* Class image */}
      <div className="relative h-32 bg-gray-100">
        {iconUrl ? (
          <Image
            src={iconUrl}
            alt={`${name} class`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-200">
            <span className="text-lg font-semibold text-gray-500">{name}</span>
          </div>
        )}
      </div>

      {/* Class info */}
      <div className="flex-grow p-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
            {category}
          </span>
        </div>

        {/* Difficulty rating */}
        <div className="mt-2 flex items-center">
          <span className="mr-1 text-xs text-gray-600">Difficulty:</span>
          <div className="flex">{difficultyStars()}</div>
        </div>

        {/* Description (truncated) */}
        {description && (
          <p className="mt-3 line-clamp-2 text-sm text-gray-600">
            {description}
          </p>
        )}
      </div>

      {/* Call to action */}
      <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
        <button
          className={`w-full rounded py-1.5 text-sm font-medium transition-colors ${
            isSelected
              ? 'bg-blue-500 text-white'
              : 'border border-blue-500 bg-white text-blue-500 hover:bg-blue-50'
          } `}
        >
          {isSelected ? 'Selected' : 'Select Class'}
        </button>
      </div>
    </div>
  );
};

export default ClassCard;
