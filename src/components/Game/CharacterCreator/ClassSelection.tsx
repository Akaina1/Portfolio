import React, { useState, useEffect } from 'react';
import { CharacterClassResponse } from '@/types/CharacterResponse';
import ClassCard from './ClassCard';
import ClassDetails from './ClassDetails';
import characterService from '@/services/api/characterService';

/**
 * Props for the ClassSelection component
 */
interface ClassSelectionProps {
  availableClasses: CharacterClassResponse[];
  selectedClassId: string | null;
  onClassSelect: (classId: string) => void;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

/**
 * ClassSelection Component
 *
 * First step in character creation process.
 * Displays available character classes and allows the user to select one.
 * Shows detailed information about the selected class.
 */
const ClassSelection: React.FC<ClassSelectionProps> = ({
  availableClasses,
  selectedClassId: initialSelectedClassId,
  onClassSelect,
  isLoading: initialIsLoading = false,
  error: initialError = null,
  className = '',
}) => {
  // State to store the selected class details
  const [selectedClass, setSelectedClass] =
    useState<CharacterClassResponse | null>(null);
  const [characterClasses, setCharacterClasses] =
    useState<CharacterClassResponse[]>(availableClasses);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(
    initialSelectedClassId
  );

  // Add debug logging for component mounting and state changes
  useEffect(() => {
    console.log('ClassSelection mounted or state changed');
    console.log('Current state:', {
      characterClasses,
      selectedClassId,
      selectedClass,
      initialIsLoading,
      isDetailLoading,
      initialError,
      detailError,
    });
  }, [
    characterClasses,
    selectedClassId,
    selectedClass,
    initialIsLoading,
    isDetailLoading,
    initialError,
    detailError,
  ]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setIsDetailLoading(true);
        console.log('Fetching character classes...');
        const classes = await characterService.getCharacterClasses();
        console.log('Received character classes:', classes);

        // Validate that classes is an array of the expected shape
        if (Array.isArray(classes)) {
          setCharacterClasses(classes);

          // If we have classes but no selection, select the first one
          if (
            classes.length > 0 &&
            !selectedClassId &&
            classes[0]._id &&
            classes[0].name
          ) {
            console.log('Auto-selecting first class:', classes[0]._id);
            setSelectedClassId(classes[0]._id);
          }
        } else {
          console.error(
            'Invalid data format received for character classes:',
            classes
          );
          setDetailError('Received invalid data format for character classes.');
        }
      } catch (error: unknown) {
        console.error('Error fetching character classes:', error);
        setDetailError('Failed to load character classes. Please try again.');
      } finally {
        setIsDetailLoading(false);
      }
    };

    fetchClasses();
  }, [selectedClassId]);

  const fetchClassDetails = async (id: string) => {
    if (!id) {
      console.log('fetchClassDetails called with empty id, skipping');
      return;
    }

    try {
      console.log(`Fetching details for class ID: ${id}`);
      setIsDetailLoading(true);
      const details = await characterService.getCharacterClassById(id);
      console.log('Received class details:', details);
      setSelectedClass(details);
    } catch (error: unknown) {
      console.error(`Error fetching details for class ID ${id}:`, error);
      setDetailError('Failed to load class details. Please try again.');
    } finally {
      setIsDetailLoading(false);
    }
  };

  useEffect(() => {
    // When selectedClassId changes, fetch the details
    if (selectedClassId) {
      console.log(
        `selectedClassId changed to ${selectedClassId}, fetching details`
      );
      fetchClassDetails(selectedClassId);
      // Call the parent's onClassSelect to propagate the change
      onClassSelect(selectedClassId);
    }
  }, [selectedClassId, onClassSelect]);

  const handleClassSelect = (id: string) => {
    console.log(`handleClassSelect called with id: ${id}`);
    setSelectedClassId(id);
  };

  // Add debug before rendering
  console.log('ClassSelection rendering with:', {
    characterClassesCount: characterClasses.length,
    selectedClassId,
    hasSelectedClass: !!selectedClass,
  });

  // Loading state
  if (initialIsLoading || isDetailLoading) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center ${className}`}
      >
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-purple-600 dark:border-gray-700 dark:border-t-purple-500"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Loading available classes...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (initialError || detailError) {
    const errorMessage = initialError || detailError;
    return (
      <div
        className={`flex h-full w-full items-center justify-center ${className}`}
      >
        <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-900/20">
          <svg
            className="mx-auto h-12 w-12 text-red-500 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-3 text-lg font-medium text-red-800 dark:text-red-300">
            Error Loading Classes
          </h3>
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {errorMessage}
          </p>
          <button
            className="mt-4 rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-800/30 dark:text-red-300 dark:hover:bg-red-800/50"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No classes available
  if (!characterClasses || characterClasses.length === 0) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center ${className}`}
      >
        <div className="max-w-md rounded-lg border border-gray-200 bg-gray-50 p-6 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-300">
            No character classes available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Choose Your Class
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Select a class that matches your preferred playstyle. Each class has
          unique abilities, attributes, and resource systems.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
        {/* Class cards grid */}
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {characterClasses.map((characterClass) => {
              // Validate that the character class has the required properties
              const isValidClass =
                characterClass &&
                typeof characterClass === 'object' &&
                '_id' in characterClass &&
                'name' in characterClass;

              if (!isValidClass) {
                console.error(
                  'Invalid character class object:',
                  characterClass
                );
                return null; // Skip rendering invalid classes
              }

              console.log(
                `Rendering ClassCard for: ${characterClass.name}`,
                characterClass
              );
              return (
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
                  onSelect={handleClassSelect}
                />
              );
            })}
          </div>
        </div>

        {/* Class details panel */}
        <div className="md:col-span-2">
          <div className="sticky top-4 max-h-[calc(60vh-2rem)] overflow-y-auto">
            {selectedClass && (
              <ClassDetails
                key={`class-details-${selectedClassId || 'none'}`}
                characterClass={selectedClass}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassSelection;
