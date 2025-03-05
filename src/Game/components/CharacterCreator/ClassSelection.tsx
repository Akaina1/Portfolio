import React, { useState, useEffect } from 'react';
import { CharacterClassResponse } from '@/Game/types/CharacterResponse.types';
import characterService from '../../services/character/characterService';
import ClassList from './ClassList';
import ClassDetailsPanel from './ClassDetailsPanel';
import { ClassSelectionProps } from '@/Game/types/ClassSelection.types';

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
  const [isClassesLoading, setIsClassesLoading] = useState(initialIsLoading);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [classesError, setClassesError] = useState<string | null>(initialError);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(
    initialSelectedClassId
  );

  // Ref to track if classes have been fetched
  const classesLoadedRef = React.useRef(false);

  // Add debug logging for component mounting and state changes
  useEffect(() => {
    console.log('ClassSelection mounted or state changed');
    console.log('Current state:', {
      characterClasses,
      selectedClassId,
      selectedClass,
      initialIsLoading,
      isClassesLoading,
      isDetailLoading,
      initialError,
      classesError,
      detailError,
    });
  }, [
    characterClasses,
    selectedClassId,
    selectedClass,
    initialIsLoading,
    isClassesLoading,
    isDetailLoading,
    initialError,
    classesError,
    detailError,
  ]);

  // Fetch classes only once when component mounts
  useEffect(() => {
    const fetchClasses = async () => {
      // Skip fetching if we already have classes or if we've already loaded them
      if (
        (characterClasses.length > 0 && !initialIsLoading) ||
        classesLoadedRef.current
      ) {
        console.log('Classes already loaded, skipping fetch');
        return;
      }

      try {
        setIsClassesLoading(true);
        console.log('Fetching character classes...');
        const classes = await characterService.getCharacterClasses();
        console.log('Received character classes:', classes);

        // Mark that we've loaded classes
        classesLoadedRef.current = true;

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
          setClassesError(
            'Received invalid data format for character classes.'
          );
        }
      } catch (error: unknown) {
        console.error('Error fetching character classes:', error);
        setClassesError('Failed to load character classes. Please try again.');
      } finally {
        setIsClassesLoading(false);
      }
    };

    fetchClasses();
  }, [characterClasses.length, initialIsLoading, selectedClassId]);

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

  // Loading state - only for initial class list load
  if (isClassesLoading) {
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

  // Error state for classes list loading
  if (classesError) {
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
            {classesError}
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
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left column: Header and Class cards grid */}
        <div className="w-full">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Choose Your Class
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Select a class that matches your preferred playstyle. Each class
              has unique abilities, attributes, and resource systems.
            </p>
          </div>

          {/* Wrapper with negative margin to preserve layout */}
          <div className="-mx-2 -mt-2">
            {/* The ClassList remains visible even when details are loading */}
            <ClassList
              classes={characterClasses}
              selectedClassId={selectedClassId}
              onClassSelect={handleClassSelect}
            />
          </div>
        </div>

        {/* Right column: Class details panel - this is the only part that shows loading spinner */}
        <div className="w-full">
          {/* Error message for details, if any */}
          {detailError && !isDetailLoading && (
            <div className="mb-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-400">
                    {detailError}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* The ClassDetailsPanel handles its own loading state */}
          <ClassDetailsPanel
            selectedClass={selectedClass}
            isLoading={isDetailLoading}
            selectedClassId={selectedClassId}
          />
        </div>
      </div>
    </div>
  );
};

export default ClassSelection;
