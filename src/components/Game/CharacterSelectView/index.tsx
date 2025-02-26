import React from 'react';
import { useGameStore } from '../../../stores/Game/gameStore';
import { AnimatedDivider } from '@/components/AnimatedDivider';

const CharacterSelectView: React.FC = () => {
  const setViewState = useGameStore((state) => state.setViewState);
  const setCharacter = useGameStore((state) => state.setCharacter);

  // Temporary function to simulate character selection
  const handleSelectCharacter = () => {
    setCharacter({
      id: '1',
      name: 'Adventurer',
    });
    setViewState('game');
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-4 text-center text-4xl font-bold">
        Select Your Character
      </h1>
      <AnimatedDivider className="mb-8" />

      <div className="rounded-xl bg-white/50 p-6 shadow-lg dark:bg-white/5">
        <div className="mb-6 text-center">
          <p className="text-lg">You currently have 1 character available.</p>
        </div>

        <div className="flex justify-center">
          <div
            className="flex h-64 w-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-purple-600 bg-gradient-to-b from-purple-100 to-purple-300 p-4 transition-all hover:scale-105 dark:from-purple-900 dark:to-purple-700"
            onClick={handleSelectCharacter}
          >
            <div className="mb-4 h-24 w-24 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            <h3 className="text-xl font-bold">Adventurer</h3>
            <p className="text-sm">Level 1</p>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSelectCharacter}
            className="rounded-lg bg-purple-600 px-6 py-2 font-bold text-white hover:bg-purple-700"
          >
            Enter Game World
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterSelectView;
