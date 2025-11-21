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

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate login delay for UI feel
      // const response = await axios.post(`${API_URL}/api/auth/token/`, { email, password });
      
      // MOCK REDIRECT (Remove in Prod)
      setTimeout(() => {
         localStorage.setItem('accessToken', 'mock_token');
         Router.push('/dashboard');
      }, 1500);

    } catch (err) {
      setError('CREDENTIALS_INVALID');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <Head><title>Partner Gateway | Workspace OS</title></Head>

      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background"></div>

      <div className="w-full max-w-md relative z-10">
        
        <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4 border border-primary/20">
                <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Partner Portal</h1>
            <p className="text-slate-500 font-mono text-xs mt-2">SECURE INFRASTRUCTURE ACCESS</p>
        </div>

        <div className="bg-surface/50 backdrop-blur-md border border-white/10 p-8 relative">
            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-t-primary border-l-[20px] border-l-transparent"></div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase mb-2">Admin ID</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@space.com"
                        className="bg-[#050505] focus:bg-surface"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase mb-2">Passkey</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="bg-[#050505] focus:bg-surface"
                    />
                </div>

                {error && (
                    <div className="p-3 bg-red-900/20 border border-red-500/30 text-red-400 text-xs font-mono flex items-center">
                        <Lock className="w-3 h-3 mr-2" /> {error}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 bg-primary hover:bg-orange-600 text-white font-mono text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center group"
                >
                    {loading ? 'VERIFYING...' : 'INITIATE_SESSION'}
                    {!loading && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
                </button>
            </form>
        </div>

        <div className="mt-6 text-center">
             <div className="text-[10px] font-mono text-slate-600">
                SYSTEM_V2.0.4 | ENCRYPTED CONNECTION
             </div>
        </div>
      </div>
    </div>
  );
}
