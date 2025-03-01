import React from 'react';

/**
 * Props for the ClassCard component
 */
interface ClassCardProps {
  _id: string;
  name: string;
  category: string;
  difficulty: number;
  description?: string;
  iconUrl?: string; // Not used in ASCII version
  isSelected: boolean;
  onSelect: (id: string) => void;
}

/**
 * ClassCard Component
 *
 * Displays a character class option in a card format with ASCII art.
 * Shows class name, category, difficulty rating, and optional description.
 * Highlights the card when selected.
 */
const ClassCard: React.FC<ClassCardProps> = ({
  _id,
  name,
  category,
  difficulty,
  description,
  isSelected,
  onSelect,
}) => {
  // Add this debug log to see what props the component receives
  console.log(`ClassCard rendering for ${name || 'unknown'}:`, {
    _id,
    name,
    category,
    difficulty,
    description,
    isSelected,
  });

  // Generate difficulty stars
  const difficultyStars = () => {
    const maxDifficulty = 5;
    const stars: React.ReactElement[] = [];

    for (let i = 1; i <= maxDifficulty; i++) {
      stars.push(
        <svg
          key={`difficulty-star-${i}`}
          className={`h-4 w-4 ${i <= difficulty ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}
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

  // ASCII art characters based on class type
  const getAsciiArt = () => {
    // Simple default ASCII representation
    const defaultAscii = `
   /\\__/\\
  ( ͡° ͜ʖ ͡°)
  /      \\
 /        \\
/          \\`;

    // You could customize this based on class name or category
    return defaultAscii;
  };

  return (
    <div
      className={`relative flex cursor-pointer flex-col overflow-hidden rounded-lg shadow-md transition-all duration-200 ${
        isSelected
          ? 'scale-105 transform border-2 border-purple-500 shadow-lg'
          : 'border border-gray-200 hover:border-purple-300 hover:shadow-lg dark:border-gray-700 dark:hover:border-purple-700'
      } `}
      onClick={() => {
        // Add debug log for click events
        console.log(`ClassCard clicked: _id=${_id}, name=${name}`);
        onSelect(_id);
      }}
      role="button"
      aria-pressed={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(_id);
        }
      }}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute right-2 top-2 z-10 rounded-full bg-purple-500 p-1">
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

      {/* ASCII Art representation instead of image */}
      <div className="flex h-32 items-center justify-center bg-gray-800 p-2 dark:bg-gray-900">
        <pre className="font-mono text-xs text-green-400">{getAsciiArt()}</pre>
      </div>

      {/* Class info */}
      <div className="flex-grow bg-white p-4 dark:bg-gray-900/70">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {name || 'Unknown Class'}
          </h3>
          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            {category || 'N/A'}
          </span>
        </div>

        {/* Difficulty rating */}
        <div className="mt-2 flex items-center">
          <span className="mr-1 text-xs text-gray-600 dark:text-gray-400">
            Difficulty:
          </span>
          <div className="flex">{difficultyStars()}</div>
        </div>

        {/* Description (truncated) */}
        {description ? (
          <p className="mt-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        ) : (
          <p className="mt-3 text-sm italic text-gray-400 dark:text-gray-500">
            No description available
          </p>
        )}
      </div>

      {/* Call to action */}
      <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
        <button
          className={`w-full rounded py-1.5 text-sm font-medium transition-colors ${
            isSelected
              ? 'bg-purple-500 text-white'
              : 'border border-purple-500 bg-white text-purple-500 hover:bg-purple-50 dark:bg-gray-700 dark:text-purple-300 dark:hover:bg-gray-600'
          } `}
        >
          {isSelected ? 'Selected' : 'Select Class'}
        </button>
      </div>
    </div>
  );
};

export default ClassCard;
