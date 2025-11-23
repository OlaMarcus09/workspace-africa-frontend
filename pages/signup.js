import React, { useState } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import { ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import ThemeToggle from '../components/ThemeToggle';

export default function PartnerSignupPage() {
  const [spaceName, setSpaceName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post(API_URL + '/api/users/register/', {
        email,
        username: spaceName, // Using space name as username for simplicity
        password,
        password2: password,
        user_type: 'PARTNER'
      });

      const response = await axios.post(API_URL + '/api/auth/token/', {
        email,
        password,
      });

      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      
      Router.push('/dashboard');

    } catch (err) {
      console.error(err);
      if (err.response?.data?.email) {
        setError('NODE_ALREADY_REGISTERED');
      } else {
        setError('REGISTRATION_FAILED');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[var(--bg-main)] transition-colors duration-300">
      <Head><title>New Partner | Workspace OS</title></Head>

      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] mb-4 border border-[var(--color-primary)]/20">
                <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-main)] uppercase tracking-wider font-mono">Register Node</h1>
            <p className="text-[var(--text-muted)] font-mono text-xs mt-2">INFRASTRUCTURE PARTNER PROGRAM</p>
        </div>

        <div className="bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border-color)] p-8 relative rounded-sm shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">Space Name</label>
                    <input 
                        type="text" 
                        value={spaceName}
                        onChange={(e) => setSpaceName(e.target.value)}
                        placeholder="e.g. The Hub"
                        className="bg-[var(--bg-input)] border-[var(--border-color)] text-[var(--text-main)] placeholder:text-[var(--text-muted)]/50"
                        required
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">Admin Email</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="partner@workspace.africa"
                        className="bg-[var(--bg-input)] border-[var(--border-color)] text-[var(--text-main)] placeholder:text-[var(--text-muted)]/50"
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
                        className="bg-[var(--bg-input)] border-[var(--border-color)] text-[var(--text-main)] placeholder:text-[var(--text-muted)]/50"
                        required
                    />
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-mono flex items-center">
                        <AlertCircle className="w-3 h-3 mr-2" /> {error}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 bg-[var(--color-primary)] hover:opacity-90 text-white font-mono text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center group shadow-lg shadow-[var(--color-primary)]/20"
                >
                    {loading ? 'INITIALIZING...' : 'JOIN_NETWORK'}
                    {!loading && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
                </button>
            </form>

            <div className="mt-6 text-center text-[10px] font-mono text-[var(--text-muted)]">
                Already a partner? <Link href="/" className="text-[var(--color-primary)] hover:underline">ACCESS_PORTAL</Link>
            </div>
        </div>
      </div>
    </div>
  );
}
