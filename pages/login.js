import React, { useState } from 'react';
import axios from 'axios';
import Router from 'next/router';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get the API URL from our environment variable
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Step 1: Call the /token/ endpoint (Login)
      const response = await axios.post(`${API_URL}/api/auth/token/`, {
        email,
        password,
      });
      
      const { access, refresh } = response.data;
      
      // Step 2: Store tokens in local storage
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      // Step 3: Check if the user is a Partner
      // We must get the user's profile to check their 'user_type'
      const profileResponse = await axios.get(`${API_URL}/api/users/me/`, {
        headers: { Authorization: `Bearer ${access}` }
      });

      if (profileResponse.data.user_type === 'PARTNER') {
        // Success! Send them to the scanner dashboard
        Router.push('/dashboard');
      } else {
        // Not a partner, log them out
        localStorage.clear();
        setError('You do not have a Partner account.');
      }

    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // This is the clean, minimalist "Raptor" style layout
    <div className="flex items-center justify-center min-h-screen bg-neutral-50">
      <div className="w-full max-w-sm p-8 bg-white shadow-lg rounded-2xl">
        
        {/* We'll add our logo here later */}
        <h1 className="text-3xl font-bold text-center text-neutral-800">
          Partner Portal
        </h1>
        <p className="mt-2 text-sm text-center text-neutral-500">
          Sign in to your Workspace Africa account
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-neutral-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 mt-1 text-neutral-800 bg-neutral-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-neutral-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 mt-1 text-neutral-800 bg-neutral-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {error && (
            <p className="text-xs text-center text-red-600">{error}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              // This uses our "Deep Teal" color!
              className="w-full px-4 py-3 font-bold text-white transition-all bg-teal-600 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
