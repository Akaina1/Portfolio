// Sample messages to demonstrate different types of content
import { GameMessage } from '@/Game/types/GameMessage.types';
export const messages: GameMessage[] = [
  {
    id: '1',
    type: 'system',
    timestamp: new Date(Date.now() - 60000 * 5),
    content: 'Welcome to the game world!',
    isImportant: true,
  },
  {
    id: '2',
    type: 'environment',
    timestamp: new Date(Date.now() - 60000 * 4),
    content:
      'You find yourself standing in a vast open field. The grass sways gently in the breeze.',
  },
  {
    id: '3',
    type: 'environment',
    timestamp: new Date(Date.now() - 60000 * 3.5),
    content:
      'To the north, you can see mountains in the distance.\nTo the east, there appears to be a forest.\nTo the south, you can make out what looks like a small village.\nTo the west, there is a winding river.',
  },
  {
    id: '4',
    type: 'npc',
    timestamp: new Date(Date.now() - 60000 * 3),
    speaker: 'Village Elder',
    content:
      "Greetings, traveler! We don't get many visitors these days. What brings you to our humble village?",
  },
  {
    id: '5',
    type: 'player',
    timestamp: new Date(Date.now() - 60000 * 2.5),
    content:
      "I'm just exploring the area. What can you tell me about this place?",
  },
  {
    id: '6',
    type: 'npc',
    timestamp: new Date(Date.now() - 60000 * 2),
    speaker: 'Village Elder',
    content:
      "This is the village of Meadowbrook. We're a peaceful farming community, though lately we've had trouble with wolves coming down from the northern mountains.",
  },
  {
    id: '7',
    type: 'quest',
    timestamp: new Date(Date.now() - 60000 * 1.5),
    content: 'New Quest Available: "The Wolf Problem"',
    isImportant: true,
  },
  {
    id: '8',
    type: 'npc',
    timestamp: new Date(Date.now() - 60000 * 1),
    speaker: 'Village Elder',
    content:
      "If you're handy with a blade, we could use your help dealing with those wolves. I'd reward you handsomely.",
  },
  {
    id: '9',
    type: 'combat',
    timestamp: new Date(Date.now() - 30000),
    content:
      'A wolf suddenly appears from the nearby bushes, growling menacingly!',
  },
  {
    id: '10',
    type: 'combat',
    timestamp: new Date(Date.now() - 20000),
    content: 'You draw your sword, ready to defend yourself.',
  },
  {
    id: '11',
    type: 'combat',
    timestamp: new Date(Date.now() - 10000),
    content: 'You strike the wolf for 15 damage!',
  },
  {
    id: '12',
    type: 'combat',
    timestamp: new Date(Date.now() - 5000),
    content: 'The wolf howls in pain and retreats back into the forest.',
  },
  {
    id: '13',
    type: 'system',
    timestamp: new Date(),
    content: 'What would you like to do?',
  },
];

// Example enemy data
export const currentEnemy = {
  type: 'goblin',
  name: 'Goblin Archer',
  level: 3,
  health: 25,
  maxHealth: 40,
  status: ['Poisoned', 'Weakened'],
};
