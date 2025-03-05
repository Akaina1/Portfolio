import React, { memo } from 'react';
import { CharacterClassResponse } from '@/types/CharacterResponse.types';
import ClassCard from './ClassCard';

/**
 * Props for the ClassList component
 */
interface ClassListProps {
  classes: CharacterClassResponse[];
  selectedClassId: string | null;
  onClassSelect: (id: string) => void;
}

/**
 * ClassList Component
 *
 * Renders a grid of class cards.
 * This component is memoized to prevent unnecessary re-renders.
 */
const ClassList = memo(
  ({ classes, selectedClassId, onClassSelect }: ClassListProps) => {
    return (
      <div className="custom-scrollbar max-h-[600px] overflow-y-auto p-4 pr-2">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {classes.map((characterClass) => {
            // Validate that the character class has the required properties
            const isValidClass =
              characterClass &&
              typeof characterClass === 'object' &&
              '_id' in characterClass &&
              'name' in characterClass;

            if (!isValidClass) {
              console.error('Invalid character class object:', characterClass);
              return null; // Skip rendering invalid classes
            }

            return (
              <div
                key={`class-container-${characterClass._id}`}
                className="p-2"
              >
                <ClassCard
                  key={`class-${characterClass._id}`}
                  _id={characterClass._id}
                  name={characterClass.name}
                  category={characterClass.category || 'Unknown'}
                  difficulty={characterClass.difficulty || 1}
                  description={
                    characterClass.description || 'No description available.'
                  }
                  iconUrl={characterClass.iconUrl}
                  isSelected={selectedClassId === characterClass._id}
                  onSelect={onClassSelect}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

ClassList.displayName = 'ClassList';
export default ClassList;
