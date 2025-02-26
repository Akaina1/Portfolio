import React, { useState } from 'react';
import { useGameStore } from '../../../stores/Game/gameStore';
import { AnimatedDivider } from '@/components/AnimatedDivider';

const AuthView: React.FC = () => {
  const setViewState = useGameStore((state) => state.setViewState);
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup');

  // Temporary function to simulate successful auth
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setViewState('character');
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-4 text-center text-4xl font-bold">
        Welcome to the Game
      </h1>
      <AnimatedDivider className="mb-8" />

      <div className="grid grid-cols-2 gap-8 rounded-xl bg-white/50 p-6 shadow-lg dark:bg-white/5">
        {/* Tab headers */}
        <div className="col-span-2 flex">
          <button
            className={`flex-1 rounded-t-lg border-b-2 py-2 ${
              activeTab === 'signup'
                ? 'border-purple-600 font-bold text-purple-600'
                : 'border-gray-300 text-gray-500'
            }`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
          <button
            className={`flex-1 rounded-t-lg border-b-2 py-2 ${
              activeTab === 'login'
                ? 'border-purple-600 font-bold text-purple-600'
                : 'border-gray-300 text-gray-500'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
        </div>

        {/* Sign Up Form */}
        {activeTab === 'signup' && (
          <div className="col-span-2">
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Username
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800"
                  placeholder="Choose a username"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800"
                  placeholder="Create a password"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-purple-600 py-2 font-bold text-white hover:bg-purple-700"
              >
                Sign Up
              </button>
            </form>
          </div>
        )}

        {/* Login Form */}
        {activeTab === 'login' && (
          <div className="col-span-2">
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800"
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-purple-600 py-2 font-bold text-white hover:bg-purple-700"
              >
                Login
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthView;
