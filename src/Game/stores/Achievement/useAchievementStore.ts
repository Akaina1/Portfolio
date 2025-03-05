import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Achievement,
  AchievementStore,
} from '../../types/Achievement.types';

// Define your achievements here
const ACHIEVEMENTS: Record<string, Achievement> = {
  'secret-hello': {
    id: 'secret-hello',
    title: 'First Steps',
    description: 'Found your first hidden secret code',
    secret: true,
  },
  'secret-dev-mode': {
    id: 'secret-dev-mode',
    title: 'Developer Insight',
    description: 'Discovered the hidden developer mode',
    secret: true,
  },
  'secret-nerd-mode': {
    id: 'secret-nerd-mode',
    title: 'Nerd Mode',
    description: 'You are a nerd!',
    secret: true,
  },
  'secret-alphabet': {
    id: 'secret-alphabet',
    title: 'Alphabet Unlocked',
    description: 'You now have access to more letters!',
    secret: true,
  },
  'secret-puzzle-master': {
    id: 'secret-puzzle-master',
    title: 'Puzzle Master',
    description: 'You have a knack for finding hidden things',
    secret: true,
  },
  'secret-uwu': {
    id: 'secret-uwu',
    title: 'UwU Mode',
    description: 'UwU',
    secret: true,
  },
  'secret-kawaii': {
    id: 'secret-kawaii',
    title: 'Kawaii Mode',
    description: 'OMG SO KAWAII!',
    secret: true,
  },
  'secret-code-1': {
    id: 'secret-code-1',
    title: 'Code Breaker',
    description: 'Found your first secret code',
    secret: true,
  },
  // Add more achievements as needed
};

export const useAchievementStore = create<AchievementStore>()(
  persist(
    (set, get) => ({
      achievements: ACHIEVEMENTS,
      unlockedAchievements: new Set<string>(),

      unlockAchievement: (id: string) => {
        const { unlockedAchievements, achievements } = get();

        // Check if achievement exists and isn't already unlocked
        if (!achievements[id] || unlockedAchievements.has(id)) {
          return;
        }

        const newUnlocked = new Set(unlockedAchievements);
        newUnlocked.add(id);

        set({
          unlockedAchievements: newUnlocked,
        });

        // Show achievement notification
        // You can implement this later with a toast or custom UI
        console.log(`Achievement Unlocked: ${achievements[id].title}`);
      },

      hasAchievement: (id: string) => {
        return get().unlockedAchievements.has(id);
      },

      initializeFromStorage: () => {
        // This is handled by the persist middleware
      },
    }),
    {
      name: 'achievements-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const parsed = JSON.parse(str);
          return {
            ...parsed,
            state: {
              ...parsed.state,
              unlockedAchievements: new Set(parsed.state.unlockedAchievements),
            },
          };
        },
        setItem: (name, value) => {
          const serialized = {
            ...value,
            state: {
              ...value.state,
              unlockedAchievements: Array.from(
                value.state.unlockedAchievements
              ),
            },
          };
          localStorage.setItem(name, JSON.stringify(serialized));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
