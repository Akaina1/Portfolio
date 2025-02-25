'use client';

import React, { useState, useEffect } from 'react';
import { AnimatedDivider } from '@/components/AnimatedDivider';

/**
 * Game Page Component
 *
 * This is a blank template page for the /game route to test routing functionality.
 * It provides a simple layout with a title and placeholder content.
 */
const GamePage: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Simulate loading effect
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div
      className={`container mx-auto px-4 py-12 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
    >
      <h1 className="mb-4 text-center text-4xl font-bold">Game Page</h1>

      <AnimatedDivider className="mb-8" />

      <div className="rounded-xl bg-white/50 p-6 shadow-lg dark:bg-white/5">
        <p className="mb-4 text-center text-lg">
          This is a placeholder page for the game route.
        </p>

        <div className="flex justify-center">
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-gradient-to-tr from-purple-600 to-purple-200">
            <span className="font-bold text-white">Game Content</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
