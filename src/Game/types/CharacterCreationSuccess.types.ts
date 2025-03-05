/**
 * Props for the CharacterCreationSuccess component
 */
export interface CharacterCreationSuccessProps {
  characterName: string;
  characterClass: string;
  onPlayNow: () => void;
  onCreateAnother: () => void;
  className?: string;
}
