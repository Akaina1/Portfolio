import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define types for party members and entities
interface TimedEntity {
  id: string;
  name: string;
  color: string;
  ap: number;
  maxAp: number;
  segmentTime: number;
  slowBar?: number;
  fastBar?: number;
}

interface Keybind {
  actionId: string;
  label: string;
  category: string;
  keybind: string;
}

// Define the default keybinds
const defaultKeybinds: Keybind[] = [
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
const defaultEntities: TimedEntity[] = [
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
const defaultPartyMembers: TimedEntity[] = [
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

// Define a type for action data
interface ActionData {
  [key: string]: string | number | boolean | object;
}

// Define the store interface
interface GameInterfaceStore {
  // Player state
  playerAP: number;
  maxPlayerAP: number;

  // Time control
  isPlayerTimePaused: boolean;
  isEntityTimeStopped: boolean;
  isPartyTimeStopped: boolean;

  // Entities and party members
  entities: TimedEntity[];
  partyMembers: TimedEntity[];

  // Sacrifice AP
  sacrificeAmount: number;

  // Gift AP
  giftAmounts: Record<string, number>;

  // Settings
  showKeybindLabels: boolean;
  keybinds: Keybind[];
  isSettingsOpen: boolean;

  // Add keybinds disable state
  keybindsDisabled: boolean;

  // Command console
  command: string;

  // Actions
  gainPlayerAP: () => void;
  spendPlayerAP: (amount?: number) => boolean;
  togglePlayerTimePause: () => void;
  toggleEntityTimeStop: () => void;
  togglePartyTimeStop: () => void;
  setCommand: (command: string) => void;
  handleCommandSubmit: () => boolean;
  setSacrificeAmount: (amount: number) => void;
  handleSacrificeAP: () => void;
  setGiftAmount: (memberId: string, amount: number) => void;
  giveAPToPartyMember: (memberId: string) => void;
  gainEntityAP: (entityId: string) => void;
  gainPartyMemberAP: (memberId: string) => void;
  toggleKeybindLabels: () => void;
  changeKeybind: (actionId: string, newKeybind: string) => void;
  toggleSettingsModal: () => void;
  resetStore: () => void;
  executeAction: (actionType: string, actionData?: ActionData) => boolean;

  // Add keybind disable/enable actions
  disableKeybinds: () => void;
  enableKeybinds: () => void;
}

// Create the store
export const useGameInterfaceStore = create<GameInterfaceStore>()(
  persist(
    (set, get) => ({
      // Initial state
      playerAP: 0,
      maxPlayerAP: 5,
      isPlayerTimePaused: false,
      isEntityTimeStopped: false,
      isPartyTimeStopped: false,
      entities: defaultEntities,
      partyMembers: defaultPartyMembers,
      sacrificeAmount: 1,
      giftAmounts: {
        'companion-01': 1,
        'healer-01': 1,
        'tank-01': 1,
      },
      showKeybindLabels: true,
      keybinds: defaultKeybinds,
      isSettingsOpen: false,
      command: '',
      // Add initial state for keybindsDisabled
      keybindsDisabled: false,

      // Actions
      gainPlayerAP: () => {
        set((state) => ({
          playerAP: Math.min(state.playerAP + 1, state.maxPlayerAP),
        }));
        console.log('Player gained an action point!');
      },

      spendPlayerAP: (amount = 1) => {
        const { playerAP } = get();
        if (playerAP >= amount) {
          set((state) => ({
            playerAP: state.playerAP - amount,
          }));
          console.log(`Player spent ${amount} action point(s)!`);
          return true;
        }
        console.log('Not enough AP!');
        return false;
      },

      togglePlayerTimePause: () => {
        set((state) => {
          const newState = !state.isPlayerTimePaused;
          console.log(`Player time ${newState ? 'paused' : 'resumed'}`);
          return { isPlayerTimePaused: newState };
        });
      },

      toggleEntityTimeStop: () => {
        set((state) => ({
          isEntityTimeStopped: !state.isEntityTimeStopped,
        }));
      },

      togglePartyTimeStop: () => {
        set((state) => ({
          isPartyTimeStopped: !state.isPartyTimeStopped,
        }));
      },

      setCommand: (command) => {
        set({ command });
      },

      handleCommandSubmit: () => {
        const { command } = get();

        // Process the command without requiring AP
        console.log('Command submitted:', command);

        // Only clear the command after processing
        set({ command: '' });

        // Return true to indicate successful submission
        return true;
      },

      setSacrificeAmount: (amount) => {
        set({ sacrificeAmount: amount });
      },

      handleSacrificeAP: () => {
        const { sacrificeAmount, playerAP, spendPlayerAP } = get();
        const amount = Math.min(Math.max(1, sacrificeAmount), playerAP);

        // Sacrifice AP multiple times
        for (let i = 0; i < amount; i++) {
          spendPlayerAP(1);
        }

        console.log(`Sacrificed ${amount} action points`);
        set({ sacrificeAmount: 1 });
      },

      setGiftAmount: (memberId, amount) => {
        set((state) => ({
          giftAmounts: {
            ...state.giftAmounts,
            [memberId]: amount,
          },
        }));
      },

      giveAPToPartyMember: (memberId) => {
        const { giftAmounts, playerAP, spendPlayerAP, partyMembers } = get();
        const member = partyMembers.find((m) => m.id === memberId);

        if (!member) return;

        // Calculate how much AP can actually be given
        const amount = Math.min(
          giftAmounts[memberId] || 1, // Requested amount
          playerAP, // Limited by player's current AP
          member.maxAp - member.ap // Limited by recipient's max capacity
        );

        if (amount <= 0) {
          console.log(
            'Cannot give AP: either player has no AP or recipient is at max'
          );
          return;
        }

        // Spend player's AP multiple times
        let success = true;
        for (let i = 0; i < amount; i++) {
          if (!spendPlayerAP(1)) {
            success = false;
            break;
          }
        }

        if (success) {
          // Update the party member's AP
          set((state) => ({
            partyMembers: state.partyMembers.map((m) => {
              if (m.id === memberId) {
                return {
                  ...m,
                  ap: Math.min(m.ap + amount, m.maxAp),
                };
              }
              return m;
            }),
          }));

          console.log(`Gave ${amount} AP to ${member.name}`);
        }
      },

      gainEntityAP: (entityId) => {
        set((state) => ({
          entities: state.entities.map((entity) => {
            if (entity.id === entityId) {
              return {
                ...entity,
                ap: Math.min(entity.ap + 1, entity.maxAp),
              };
            }
            return entity;
          }),
        }));
      },

      gainPartyMemberAP: (memberId) => {
        set((state) => ({
          partyMembers: state.partyMembers.map((member) => {
            if (member.id === memberId) {
              return {
                ...member,
                ap: Math.min(member.ap + 1, member.maxAp),
              };
            }
            return member;
          }),
        }));
      },

      toggleKeybindLabels: () => {
        set((state) => {
          const newValue = !state.showKeybindLabels;
          console.log(`Keybind labels ${newValue ? 'shown' : 'hidden'}`);
          return { showKeybindLabels: newValue };
        });
      },

      changeKeybind: (actionId, newKeybind) => {
        set((state) => ({
          keybinds: state.keybinds.map((kb) =>
            kb.actionId === actionId ? { ...kb, keybind: newKeybind } : kb
          ),
        }));
        console.log(`Changed keybind for ${actionId} to ${newKeybind}`);
      },

      toggleSettingsModal: () => {
        set((state) => ({
          isSettingsOpen: !state.isSettingsOpen,
        }));
      },

      resetStore: () => {
        set({
          playerAP: 0,
          isPlayerTimePaused: false,
          isEntityTimeStopped: false,
          isPartyTimeStopped: false,
          entities: defaultEntities,
          partyMembers: defaultPartyMembers,
          sacrificeAmount: 1,
          giftAmounts: {
            'companion-01': 1,
            'healer-01': 1,
            'tank-01': 1,
          },
          command: '',
        });
      },

      executeAction: (actionType: string, actionData?: ActionData) => {
        const { spendPlayerAP } = get();

        // Check if player has enough AP for this action
        if (spendPlayerAP(1)) {
          console.log(`Executed action: ${actionType}`, actionData);
          return true;
        }

        console.log(`Cannot execute action ${actionType}: Not enough AP`);
        return false;
      },

      // Add new actions for keybind control
      disableKeybinds: () => {
        set({ keybindsDisabled: true });
        console.log('Keybinds disabled');
      },

      enableKeybinds: () => {
        set({ keybindsDisabled: false });
        console.log('Keybinds enabled');
      },
    }),
    {
      name: 'game-interface-storage',
      partialize: (state) => ({
        // Only persist these values
        showKeybindLabels: state.showKeybindLabels,
        keybinds: state.keybinds,
      }),
    }
  )
);
