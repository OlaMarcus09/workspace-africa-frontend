import React, { useState } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import { ShieldCheck, ArrowRight, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Priority: Vercel Backend (matches your Neon SQL reset)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://workspace-africa-backend.vercel.app';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Authenticate with Email
      const response = await axios.post(`${API_URL}/api/auth/token/`, { 
        email: email.toLowerCase().trim(), 
        password 
      });
      const { access, refresh } = response.data;

      // 2. Fetch profile to verify role
      const profileRes = await axios.get(`${API_URL}/api/users/me/`, {
        headers: { Authorization: `Bearer ${access}` }
      });

      const userData = profileRes.data;

      // 3. Security: Prevent non-partners from entering the portal
      if (userData.user_type !== 'PARTNER' && userData.user_type !== 'ADMIN') {
         throw new Error("UNAUTHORIZED_ROLE");
      }

      // 4. Persistence
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('userRole', userData.user_type);

      // 5. Smart Redirect
      // If it's a partner, send them to the scan page
      Router.push('/partner/scan');

    } catch (err) {
      console.error("Auth Failure:", err.response?.data || err.message);
      if (err.message === "UNAUTHORIZED_ROLE") {
          setError('ACCESS_DENIED: PARTNER_ACCOUNT_REQUIRED');
      } else if (err.response?.status === 401) {
          setError('CREDENTIALS_INVALID: CHECK_PASSKEY');
      } else {
          setError(`SYSTEM_ERROR: ${err.response?.data?.detail || 'TRY_AGAIN'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--bg-main)]">
      <Head><title>Partner Gateway | Workspace OS</title></Head>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 mb-4 border border-blue-500/20">
                <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-main)] uppercase tracking-wider font-mono">Partner Portal</h1>

            <p className="text-[var(--text-muted)] font-mono text-xs mt-2">SECURE INFRASTRUCTURE ACCESS</p><div className="text-center mt-2"><a href="/signup" className="text-[10px] text-[var(--color-primary)] hover:underline">REGISTER NEW NODE</a></div>
            <p className="text-[var(--text-muted)] font-mono text-xs mt-2 tracking-tighter">SECURE INFRASTRUCTURE ACCESS</p>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-8 rounded-sm shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">Admin ID</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@space.com"
                        className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] p-3 text-sm font-mono text-[var(--text-main)]"
                        required
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">Passkey</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] p-3 text-sm font-mono text-[var(--text-main)]"
                        required
                    />
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] font-mono flex items-center">
                        <Lock className="w-3 h-3 mr-2" /> {error}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center disabled:opacity-50"
                >
                    {loading ? 'VERIFYING...' : 'INITIATE_SESSION'}
                    {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
}