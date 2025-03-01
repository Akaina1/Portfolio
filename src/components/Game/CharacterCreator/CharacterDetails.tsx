import React, { useState } from 'react';
import { CharacterClassResponse } from '@/types/CharacterResponse';
import AttributeDisplay from './AttributeDisplay';

/**
 * Props for the CharacterDetails component
 */
interface CharacterDetailsProps {
  selectedClass: CharacterClassResponse;
  initialValues?: CharacterFormValues;
  onSubmit: (values: CharacterFormValues) => void;
  className?: string;
}

/**
 * Character form values interface
 */
export interface CharacterFormValues {
  name: string;
  gender: 'male' | 'female' | 'other';
  appearance: {
    skinTone: string;
    hairStyle: string;
    hairColor: string;
    faceStyle: string;
  };
  backstory: string;
}

/**
 * Default form values
 */
const defaultFormValues: CharacterFormValues = {
  name: '',
  gender: 'male',
  appearance: {
    skinTone: 'medium',
    hairStyle: 'short',
    hairColor: 'brown',
    faceStyle: 'neutral',
  },
  backstory: '',
};

/**
 * CharacterDetails Component
 *
 * Second step in character creation process.
 * Allows customization of character name, appearance, and backstory.
 * Shows base attributes from the selected class.
 */
const CharacterDetails: React.FC<CharacterDetailsProps> = ({
  selectedClass,
  initialValues = defaultFormValues,
  onSubmit,
  className = '',
}) => {
  // Form state
  const [formValues, setFormValues] =
    useState<CharacterFormValues>(initialValues);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CharacterFormValues, string>>
  >({});

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Handle nested appearance properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'appearance') {
        setFormValues((prev) => ({
          ...prev,
          appearance: {
            ...prev.appearance,
            [child]: value,
          },
        }));
      }
    } else {
      setFormValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when field is edited
    if (errors[name as keyof CharacterFormValues]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CharacterFormValues, string>> = {};

    // Name validation
    if (!formValues.name.trim()) {
      newErrors.name = 'Character name is required';
    } else if (formValues.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    } else if (formValues.name.length > 20) {
      newErrors.name = 'Name must be less than 20 characters';
    }

    // Set errors and return validation result
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formValues);
    }
  };

  // Format attributes for display
  const attributes = Object.entries(selectedClass.baseAttributes).map(
    ([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
      max: 20, // Assuming max attribute value is 20
    })
  );

  // Available options for customization
  const skinTones = ['fair', 'light', 'medium', 'tan', 'dark', 'deep'];
  const hairStyles = [
    'short',
    'long',
    'curly',
    'straight',
    'bald',
    'mohawk',
    'ponytail',
  ];
  const hairColors = [
    'black',
    'brown',
    'blonde',
    'red',
    'white',
    'blue',
    'green',
    'purple',
  ];
  const faceStyles = [
    'neutral',
    'stern',
    'friendly',
    'wise',
    'young',
    'old',
    'scarred',
  ];

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Customize Your Character
        </h2>
        <p className="mt-2 text-gray-600">
          Personalize your {selectedClass.name} with a unique name, appearance,
          and backstory.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Form section */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic info section */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Basic Information
              </h3>

              {/* Character name */}
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Character Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formValues.name}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200`}
                  placeholder="Enter character name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Gender selection */}
              <div className="mb-4">
                <label
                  htmlFor="gender"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formValues.gender}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Appearance section */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Appearance
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Skin tone */}
                <div>
                  <label
                    htmlFor="appearance.skinTone"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Skin Tone
                  </label>
                  <select
                    id="appearance.skinTone"
                    name="appearance.skinTone"
                    value={formValues.appearance.skinTone}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    {skinTones.map((tone) => (
                      <option key={tone} value={tone}>
                        {tone.charAt(0).toUpperCase() + tone.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hair style */}
                <div>
                  <label
                    htmlFor="appearance.hairStyle"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Hair Style
                  </label>
                  <select
                    id="appearance.hairStyle"
                    name="appearance.hairStyle"
                    value={formValues.appearance.hairStyle}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    {hairStyles.map((style) => (
                      <option key={style} value={style}>
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hair color */}
                <div>
                  <label
                    htmlFor="appearance.hairColor"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Hair Color
                  </label>
                  <select
                    id="appearance.hairColor"
                    name="appearance.hairColor"
                    value={formValues.appearance.hairColor}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    {hairColors.map((color) => (
                      <option key={color} value={color}>
                        {color.charAt(0).toUpperCase() + color.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Face style */}
                <div>
                  <label
                    htmlFor="appearance.faceStyle"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Face Style
                  </label>
                  <select
                    id="appearance.faceStyle"
                    name="appearance.faceStyle"
                    value={formValues.appearance.faceStyle}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    {faceStyles.map((style) => (
                      <option key={style} value={style}>
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Backstory section */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Backstory
              </h3>

              <div>
                <label
                  htmlFor="backstory"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Character Backstory (Optional)
                </label>
                <textarea
                  id="backstory"
                  name="backstory"
                  value={formValues.backstory}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Write a brief backstory for your character..."
                />
              </div>
            </div>

            {/* Submit button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-6 py-2 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Continue to Review
              </button>
            </div>
          </form>
        </div>

        {/* Class info sidebar */}
        <div className="md:col-span-1">
          <div className="sticky top-4 space-y-6">
            {/* Class summary */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Class Summary
              </h3>
              <div className="mb-3 flex items-center">
                <span className="mr-2 font-medium text-gray-700">Class:</span>
                <span className="text-gray-600">{selectedClass.name}</span>
              </div>
              <div className="mb-3 flex items-center">
                <span className="mr-2 font-medium text-gray-700">
                  Category:
                </span>
                <span className="text-gray-600">{selectedClass.category}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2 font-medium text-gray-700">
                  Difficulty:
                </span>
                <span className="text-gray-600">
                  {selectedClass.difficulty}/5
                </span>
              </div>
            </div>

            {/* Base attributes */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Base Attributes
              </h3>
              <AttributeDisplay attributes={attributes} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetails;
