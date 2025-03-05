import { CharacterClassResponse } from './CharacterResponse.types';

/**
 * Props for the CharacterDetails component
 */
export interface CharacterDetailsProps {
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
  backstory: string;
}

/**
 * Default form values
 */
export const defaultFormValues: CharacterFormValues = {
  name: '',
  gender: 'male',
  backstory: '',
};
