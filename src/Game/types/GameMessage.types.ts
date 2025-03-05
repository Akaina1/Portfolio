// Define types for different message categories
export type MessageType =
  | 'system'
  | 'npc'
  | 'player'
  | 'combat'
  | 'environment'
  | 'quest';

export interface GameMessage {
  id: string;
  type: MessageType;
  timestamp: Date;
  content: string;
  speaker?: string;
  isImportant?: boolean;
}
