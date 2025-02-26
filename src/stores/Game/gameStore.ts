import { create } from 'zustand';

type ViewState = 'auth' | 'character' | 'game';

interface Character {
  id: string;
  name: string;
  // Add other character properties as needed
}

interface GameState {
  viewState: ViewState;
  isConnected: boolean;
  character: Character | null;
  setViewState: (state: ViewState) => void;
  setConnected: (connected: boolean) => void;
  setCharacter: (character: Character | null) => void;
}

export const useGameStore = create<GameState>((set) => ({
  viewState: 'auth',
  isConnected: false,
  character: null,
  setViewState: (viewState) => set({ viewState }),
  setConnected: (isConnected) => set({ isConnected }),
  setCharacter: (character) => set({ character }),
}));
