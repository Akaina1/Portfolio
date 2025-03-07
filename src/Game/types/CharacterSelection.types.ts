/**
 * Character display interface for the UI
 */
export interface CharacterDisplay {
  id: string;
  name: string;
  className: string;
  level: number;
  lastPlayed: string;
}

/**
 * Type for character data from backend
 * This is a simplified version of what we receive
 */
export interface BackendCharacter {
  _id: string;
  name: string;
  level: number;
  classId: string | { name: string; _id: string };
  lastPlayed?: string | Date;
}
