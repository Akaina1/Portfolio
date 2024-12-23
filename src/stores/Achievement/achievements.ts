export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon?: string;
  unlockedAt?: string;
  secret?: boolean;
};

export type AchievementStore = {
  achievements: Record<string, Achievement>;
  unlockedAchievements: Set<string>;
  unlockAchievement: (id: string) => void;
  hasAchievement: (id: string) => boolean;
  initializeFromStorage: () => void;
};
