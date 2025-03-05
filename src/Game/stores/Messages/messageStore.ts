import { create } from 'zustand';
import { GameMessage } from '@/Game/types/GameMessage.types';
import { messages as sampleMessages } from '@/Game/data/MainDisplay.data';

// Declare the window extension properly
declare global {
  interface Window {
    __messageSimulatorId: number | undefined;
  }
}

interface MessageState {
  messages: GameMessage[];
  addMessage: (message: GameMessage) => void;
  clearMessages: () => void;
  simulateMessages: () => void;
  stopSimulation: () => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],

  addMessage: (message: GameMessage) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  clearMessages: () => {
    set({ messages: [] });
  },

  // Simulate incoming messages
  simulateMessages: () => {
    let index = 0;
    const intervalId = setInterval(() => {
      if (index < sampleMessages.length) {
        // Create a new message with current timestamp
        const newMessage = {
          ...sampleMessages[index],
          id: `${Date.now()}-${index}`, // Ensure unique IDs
          timestamp: new Date(), // Update timestamp to now
        };

        get().addMessage(newMessage);
        index++;
      } else {
        // Reset index to create continuous loop
        index = 0;
      }
    }, 3000); // Send a new message every 3 seconds

    // Store the interval ID in the window object so we can clear it later
    window.__messageSimulatorId = intervalId as unknown as number;
  },

  stopSimulation: () => {
    if (window.__messageSimulatorId) {
      clearInterval(window.__messageSimulatorId);
      window.__messageSimulatorId = undefined;
    }
  },
}));
