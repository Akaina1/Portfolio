import { TimedEntity, Keybind } from '../types/GameInterfaceStore.types';

// Define the default keybinds
export const defaultKeybinds: Keybind[] = [
  // Movement
  {
    actionId: 'move-north',
    label: 'North',
    category: 'Movement',
    keybind: 'w',
  },
  { actionId: 'move-west', label: 'West', category: 'Movement', keybind: 'a' },
  {
    actionId: 'move-south',
    label: 'South',
    category: 'Movement',
    keybind: 's',
  },
  { actionId: 'move-east', label: 'East', category: 'Movement', keybind: 'd' },
  { actionId: 'look', label: 'Look', category: 'Movement', keybind: 'q' },

  // Utility
  { actionId: 'action', label: 'Action', category: 'Utility', keybind: 'e' },
  {
    actionId: 'inventory',
    label: 'Inventory',
    category: 'Utility',
    keybind: 'i',
  },
  { actionId: 'stats', label: 'Stats', category: 'Utility', keybind: 'c' },
  { actionId: 'skills', label: 'Skills', category: 'Utility', keybind: 'k' },
  { actionId: 'quests', label: 'Quests', category: 'Utility', keybind: 'j' },
  { actionId: 'map', label: 'Map', category: 'Utility', keybind: 'm' },
  { actionId: 'help', label: 'Help', category: 'Utility', keybind: 'h' },
  {
    actionId: 'settings',
    label: 'Settings',
    category: 'Utility',
    keybind: 'o',
  },
  { actionId: 'trade', label: 'Trade', category: 'Utility', keybind: 't' },
  { actionId: 'save', label: 'Save', category: 'Utility', keybind: 'Ctrl+s' },
  { actionId: 'load', label: 'Load', category: 'Utility', keybind: 'Ctrl+l' },
  { actionId: 'exit', label: 'Exit', category: 'Utility', keybind: 'Escape' },

  // Hotkeys
  ...Array.from({ length: 18 }).map((_, index) => ({
    actionId: `hotkey-${index + 1}`,
    label: `Hotkey ${index + 1}`,
    category: 'Hotkeys',
    keybind:
      index < 9 ? `${index + 1}` : index === 9 ? '0' : `Shift+${index - 9}`,
  })),

  // Time Controls
  {
    actionId: 'pause-time',
    label: 'Pause Time',
    category: 'Time Controls',
    keybind: 'Space',
  },
  {
    actionId: 'sacrifice-ap',
    label: 'Sacrifice AP',
    category: 'Time Controls',
    keybind: 'x',
  },
  {
    actionId: 'send-command',
    label: 'Send Command',
    category: 'Time Controls',
    keybind: 'Enter',
  },
];

// Define the default entities
export const defaultEntities: TimedEntity[] = [
  {
    id: 'goblin-01',
    name: 'Goblin',
    color: '#EF4444',
    ap: 0,
    maxAp: 3,
    segmentTime: 7000,
    slowBar: 0.8,
  },
  {
    id: 'wolf-01',
    name: 'Wolf',
    color: '#F59E0B',
    ap: 0,
    maxAp: 4,
    segmentTime: 6000,
    fastBar: 1.2,
  },
  {
    id: 'merchant-01',
    name: 'Merchant',
    color: '#10B981',
    ap: 0,
    maxAp: 2,
    segmentTime: 8000,
  },
  {
    id: 'guard-01',
    name: 'Guard',
    color: '#3B82F6',
    ap: 0,
    maxAp: 3,
    segmentTime: 6500,
  },
  {
    id: 'rat-01',
    name: 'Giant Rat',
    color: '#6B7280',
    ap: 0,
    maxAp: 2,
    segmentTime: 5000,
    fastBar: 1.3,
  },
];

// Define the default party members
export const defaultPartyMembers: TimedEntity[] = [
  {
    id: 'companion-01',
    name: 'Companion',
    color: '#3B82F6',
    ap: 0,
    maxAp: 4,
    segmentTime: 5500,
  },
  {
    id: 'healer-01',
    name: 'Healer',
    color: '#10B981',
    ap: 0,
    maxAp: 3,
    segmentTime: 6000,
    fastBar: 1.1,
  },
  {
    id: 'tank-01',
    name: 'Tank',
    color: '#F59E0B',
    ap: 0,
    maxAp: 4,
    segmentTime: 7000,
    slowBar: 0.9,
  },
];
