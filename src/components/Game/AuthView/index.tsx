import React, { useState, useEffect } from 'react';
import { AnimatedDivider } from '@/components/AnimatedDivider';
import { useGameInterfaceStore } from '@/stores/Game/gameInterfaceStore';
import { usePlayerStore } from '@/stores/Player/playerStore';
import authService from '@/services/api/authService';
import { ApiRequestError } from '@/services/api/apiService';
import { useSocketStore } from '@/stores/Game/socketStore';

const AuthView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup');

  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Signup form state
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');

  // Player store actions
  const setPlayerError = usePlayerStore((state) => state.setError);
  const clearPlayerData = usePlayerStore((state) => state.clearPlayerData);

  // Disable all keybinds when AuthView is shown
  const disableKeybinds = useGameInterfaceStore(
    (state) => state.disableKeybinds
  );
  const enableKeybinds = useGameInterfaceStore((state) => state.enableKeybinds);

  // Socket store actions
  const { resetSocket, disconnect } = useSocketStore();

  // On component mount, ensure socket is disconnected and player data is cleaned
  useEffect(() => {
    console.log('AuthView mounted - ensuring clean socket state');

    // First disconnect any existing socket connection
    disconnect();

    // Then reset socket state to prevent auto-authentication
    resetSocket();

    // Also ensure any leftover token is cleared
    // This is critical to prevent auto-connection on page refresh
    if (!window.location.pathname.includes('game')) {
      clearPlayerData();
    }

    // Disable keybinds when AuthView is shown
    disableKeybinds();

    // Re-enable keybinds when auth view is unmounted
    return () => {
      enableKeybinds();
    };
  }, [
    disableKeybinds,
    enableKeybinds,
    disconnect,
    resetSocket,
    clearPlayerData,
  ]);

  // Handle login with our new auth service
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    setPlayerError(null);

    try {
      console.log('Attempting login with username:', loginUsername);

      // Use our auth service for login
      const loginResponse = await authService.login(
        loginUsername,
        loginPassword
      );

      console.log(
        'Login successful, token received:',
        !!loginResponse.access_token
      );
      console.log(
        'Player data received:',
        !!loginResponse.player,
        'with ID:',
        loginResponse.player?.id
      );

      // handlePostLogin is now called from within authService.login
      // No need to call it here
    } catch (err) {
      // Handle API errors with proper type checking
      if (err instanceof ApiRequestError) {
        setLoginError(err.message);
      } else if (err instanceof Error) {
        setLoginError(err.message);
      } else {
        setLoginError('An unknown error occurred');
      }

      setPlayerError(err instanceof Error ? err.message : 'Login failed');
      console.error('Login error:', err);
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle signup with our new auth service
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError('');
    setSignupSuccess('');

    try {
      // Use our auth service for registration
      await authService.register(signupUsername, signupEmail, signupPassword);

      // Show success message and switch to login tab
      setSignupSuccess('Account created successfully! Please log in.');
      setActiveTab('login');

      // Clear signup form
      setSignupUsername('');
      setSignupEmail('');
      setSignupPassword('');
    } catch (err) {
      // Handle API errors with proper type checking
      if (err instanceof ApiRequestError) {
        setSignupError(err.message);
      } else if (err instanceof Error) {
        setSignupError(err.message);
      } else {
        setSignupError('An unknown error occurred');
      }

      console.error('Signup error:', err);
    } finally {
      setSignupLoading(false);
    }
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

        {/* Sign Up Form */}
        {activeTab === 'signup' && (
          <div className="col-span-2">
            {signupError && (
              <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                {signupError}
              </div>
            )}

            {signupSuccess && (
              <div className="mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
                {signupSuccess}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Username
                </label>
                <input
                  type="text"
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800"
                  placeholder="Choose a username"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
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
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800"
                  placeholder="Create a password"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={signupLoading}
                className={`w-full rounded-lg bg-purple-600 py-2 font-bold text-white hover:bg-purple-700 ${
                  signupLoading ? 'cursor-not-allowed opacity-50' : ''
                }`}
              >
                {signupLoading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>
          </div>
        )}

        {/* Login Form */}
        {activeTab === 'login' && (
          <div className="col-span-2">
            {loginError && (
              <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Username
                </label>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800"
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loginLoading}
                className={`w-full rounded-lg bg-purple-600 py-2 font-bold text-white hover:bg-purple-700 ${
                  loginLoading ? 'cursor-not-allowed opacity-50' : ''
                }`}
              >
                {loginLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthView;
