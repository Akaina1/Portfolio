import { useAchievementStore } from "@/stores/Achievement/useAchievementStore";

export interface PlatePuzzle {
  id: string;
  solution: string[];
  squareColors: string[];
  reward: {
    type: 'text' | 'route' | 'achievement';
    content: string;
  };
}

export const platePuzzles: Record<string, PlatePuzzle> = {
  puzzle1: {
    id: 'puzzle1',
    solution: ['red,blue,green', 'blue,green,red'], // Multiple valid solutions
    squareColors: [
      '#FF0000', // red
      '#0000FF', // blue
      '#00FF00', // green
      '#FF00FF', // purple
      '#FFFF00', // yellow
      '#00FFFF', // cyan
      '#FF8000', // orange
      '#8000FF', // violet
      '#FF0080', // pink
    ],
    reward: {
      type: 'achievement',
      content: 'secret-code-1', // Achievement ID from useAchievementStore
    },
  },
  // Add more puzzles as needed
};

// Helper function to handle puzzle rewards
export const handlePuzzleReward = (puzzle: PlatePuzzle) => {
  const { type, content } = puzzle.reward;

  switch (type) {
    case 'achievement':
      // Import and use achievement store
      const { unlockAchievement } = useAchievementStore.getState();
      unlockAchievement(content);
      break;

    case 'route':
      // Handle routing (to be implemented)
      break;

    case 'text':
      // Handle text display (to be implemented)
      break;

    default:
      console.warn(`Unknown reward type: ${type}`);
  }
};
