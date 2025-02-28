'use client';

import { useState } from 'react';
//import { useRouter } from 'next/navigation';

export default function TestLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  //const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

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

      setSuccess(true);
      console.log('Login successful:', data);

      // Optional: Redirect after successful login
      // router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const response = await fetch('/api/players/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Logout failed');
      }

      setSuccess(false);
      setEmail('');
      setPassword('');
      console.log('Logout successful');
    } catch (err) {
      setError(err.message || 'Logout failed');
      console.error('Logout error:', err);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md">
        <h1 className="text-center text-2xl font-bold">Player Login Test</h1>

        {error && (
          <div className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="relative rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
            Login successful! Check console for details.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className={`w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              loading || success ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {success && (
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className={`mt-4 w-full rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
              loggingOut ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        )}

        <div className="mt-4 text-sm text-gray-500">
          <p>Note: This page is for testing player login only.</p>
          <p>Create a player in Payload CMS admin first.</p>
        </div>
      </div>
    </div>
  );
}
