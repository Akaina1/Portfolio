// Define types for party members and entities
export interface TimedEntity {
  id: string;
  name: string;
  color: string;
  ap: number;
  maxAp: number;
  segmentTime: number;
  slowBar?: number;
  fastBar?: number;
}

export interface Keybind {
  actionId: string;
  label: string;
  category: string;
  keybind: string;
}

// Define a type for action data
export interface ActionData {
  [key: string]: string | number | boolean | object;
}

// Define the store interface
export interface GameInterfaceStore {
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
