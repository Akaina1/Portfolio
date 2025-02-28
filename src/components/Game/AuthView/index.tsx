import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../../stores/Game/gameStore';
import { AnimatedDivider } from '@/components/AnimatedDivider';
import { useGameInterfaceStore } from '@/stores/Game/gameInterfaceStore';
import { usePlayerStore } from '@/stores/Player/playerStore';

const AuthView: React.FC = () => {
  const setViewState = useGameStore((state) => state.setViewState);
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Player store actions
  const setToken = usePlayerStore((state) => state.setToken);
  const setPlayer = usePlayerStore((state) => state.setPlayer);
  const setPlayerError = usePlayerStore((state) => state.setError);

  // Disable all keybinds when AuthView is shown
  const disableKeybinds = useGameInterfaceStore(
    (state) => state.disableKeybinds
  );
  const enableKeybinds = useGameInterfaceStore((state) => state.enableKeybinds);

  // Disable keybinds on mount, enable on unmount
  useEffect(() => {
    // Disable keybinds when auth view is shown
    disableKeybinds();

    // Re-enable keybinds when auth view is unmounted
    return () => {
      enableKeybinds();
    };
  }, [disableKeybinds, enableKeybinds]);

  // Handle login with Payload CMS
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPlayerError(null);

    try {
      const response = await fetch('/api/players/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      console.log('Login successful:', data);

      // Extract token from response
      let token: string | null = null;

      if (data.token) {
        token = data.token;
      } else if (data.user?.token) {
        token = data.user.token;
      } else if (data.accessToken) {
        token = data.accessToken;
      } else {
        const authHeader = response.headers.get('Authorization');
        if (authHeader?.startsWith('Bearer ')) {
          token = authHeader.substring(7);
        }
      }

      // Extract user ID
      const userId = data.user?.id || data.id || '';

      if (token) {
        console.log('Token found and stored');
        setToken(token);

        // Store player data - make sure we have both ID and email
        setPlayer({
          id: userId,
          email: data.user?.email || data.email || email,
          username: data.user?.username || data.username || email.split('@')[0],
        });

        // Transition to game view on successful login
        setViewState('game');
      } else {
        console.error('No token found in response:', data);
        throw new Error('No authentication token received');
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);
      setPlayerError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Placeholder signup handler (to be implemented later)
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just log a message and transition as if signup was successful
    console.log('Signup functionality to be implemented');
    setViewState('game');
  };

  return (
    <div className="auth-form-container mx-auto max-w-4xl">
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

        {/* Error message display */}
        {error && (
          <div className="col-span-2 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {/* Sign Up Form (placeholder) */}
        {activeTab === 'signup' && (
          <div className="col-span-2">
            <form onSubmit={handleSignup} className="space-y-4">
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

        {/* Login Form (with real authentication) */}
        {activeTab === 'login' && (
          <div className="col-span-2">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-lg bg-purple-600 py-2 font-bold text-white hover:bg-purple-700 ${
                  loading ? 'cursor-not-allowed opacity-50' : ''
                }`}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthView;
