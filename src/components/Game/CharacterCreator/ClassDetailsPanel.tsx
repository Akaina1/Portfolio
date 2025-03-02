import React, { memo } from 'react';
import ClassDetails from './ClassDetails';
import { CharacterClassResponse } from '@/types/CharacterResponse';

/**
 * Props for the ClassDetailsPanel component
 */
interface ClassDetailsPanelProps {
  selectedClass: CharacterClassResponse | null;
  isLoading: boolean;
  selectedClassId: string | null;
}

/**
 * ClassDetailsPanel Component
 *
 * Displays detailed information about a selected class.
 * Shows a loading indicator when class details are being fetched.
 * Memoized to prevent unnecessary rerenders when parent component changes.
 */
const ClassDetailsPanel = memo(
  ({ selectedClass, isLoading, selectedClassId }: ClassDetailsPanelProps) => {
    return (
      <div className="custom-scrollbar sticky top-4 max-h-[700px] overflow-y-auto pr-2">
        {isLoading ? (
          <div className="flex h-full min-h-[400px] w-full items-center justify-center rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/50">
            <div className="text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-purple-600 dark:border-gray-700 dark:border-t-purple-500"></div>
              <p className="text-gray-600 dark:text-gray-300">
                Loading class details...
              </p>
            </div>
          </div>
        ) : (
          selectedClass && (
            <ClassDetails
              key={`class-details-${selectedClassId || 'none'}`}
              characterClass={selectedClass}
            />
          )
        )}
      </div>
    );
  }
);

ClassDetailsPanel.displayName = 'ClassDetailsPanel';
export default ClassDetailsPanel;
