import React, { useState, useEffect } from 'react';
import { CharacterClassResponse } from '@/types/CharacterResponse';
import ClassCard from './ClassCard';
import ClassDetails from './ClassDetails';

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
  selectedClassId,
  onClassSelect,
  isLoading = false,
  error = null,
  className = '',
}) => {
  // State to store the selected class details
  const [selectedClass, setSelectedClass] =
    useState<CharacterClassResponse | null>(null);

  // Update selected class when selectedClassId changes
  useEffect(() => {
    if (selectedClassId) {
      const classDetails =
        availableClasses.find((c) => c.id === selectedClassId) || null;
      setSelectedClass(classDetails);
    } else {
      setSelectedClass(null);
    }
  }, [selectedClassId, availableClasses]);

  // Handle class selection
  const handleClassSelect = (classId: string) => {
    onClassSelect(classId);
  };

  // Loading state
  if (isLoading) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center ${className}`}
      >
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          <p className="text-gray-600">Loading available classes...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center ${className}`}
      >
        <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <svg
            className="mx-auto h-12 w-12 text-red-500"
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
          <h3 className="mt-3 text-lg font-medium text-red-800">
            Error Loading Classes
          </h3>
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <button
            className="mt-4 rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No classes available
  if (!availableClasses || availableClasses.length === 0) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center ${className}`}
      >
        <div className="max-w-md rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
          <p className="text-gray-600">No character classes available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Choose Your Class</h2>
        <p className="mt-2 text-gray-600">
          Select a class that matches your preferred playstyle. Each class has
          unique abilities, attributes, and resource systems.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
        {/* Class cards grid */}
        <div className="md:col-span-2 lg:col-span-3">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {availableClasses.map((characterClass) => (
              <ClassCard
                key={`class-card-${characterClass.id}`}
                id={characterClass.id}
                name={characterClass.name}
                category={characterClass.category}
                difficulty={characterClass.difficulty}
                description={characterClass.description}
                iconUrl={characterClass.iconUrl}
                isSelected={selectedClassId === characterClass.id}
                onSelect={handleClassSelect}
              />
            ))}
          </div>
        </div>

        {/* Class details panel */}
        <div className="md:col-span-1 lg:col-span-1">
          <div className="sticky top-4">
            <ClassDetails
              key={`class-details-${selectedClassId || 'none'}`}
              characterClass={selectedClass as CharacterClassResponse}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassSelection;
