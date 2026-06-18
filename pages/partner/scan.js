import React, { useState } from 'react';
import api from '../../lib/api'; // Switched to the shared API client
import Head from 'next/head';
import PartnerLayout from '../../components/Layout';
import { ScanLine, Camera, CheckCircle, XCircle, Keyboard } from 'lucide-react';

export default function ScannerPage() {
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [result, setResult] = useState(null);

  const verifyToken = async (code) => {
    setScanning(true);
    setResult(null); // Clear previous result before new attempt
    
    try {
        // FIXED: Point to the singular backend path to resolve the 404 contract bug.
        // Also removed manual header injection since lib/api.js interceptor handles it now.
        const response = await api.post('/api/check-in/validate/', { 
            code: code 
        });

        // Backend contract fields match response perfectly: user_name, plan_name, remaining_days
        setResult({ 
            status: 'success', 
            user: response.data.user_name, 
            plan: response.data.plan_name, 
            checkins_left: response.data.remaining_days, 
            code_used: code 
        });
    } catch (err) {
        console.error("Scanner Error:", err.response?.data || err.message);
        setResult({ 
            status: 'error', 
            error_msg: err.response?.data?.error || err.response?.data?.detail || 'INVALID OR EXPIRED TOKEN'
        });
    } finally {
        setScanning(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if(manualCode) verifyToken(manualCode);
  };

  return (
    <PartnerLayout>
      <Head><title>Access Scanner | Partner Portal</title></Head>

      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
            <h1 className="text-2xl font-bold text-[var(--text-main)] mb-2">Entry Validator</h1>
            <p className="text-[var(--text-muted)] font-mono text-xs">SCAN USER TOKEN OR ENTER ID MANUALLY</p>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-8 rounded-sm shadow-sm">
            
            {/* OPTION 1: CAMERA UI */}
            <div className="aspect-video bg-black relative overflow-hidden border-2 border-[var(--border-color)] mb-6 flex items-center justify-center group">
                <div className="text-center">
                    <Camera className="w-12 h-12 text-slate-700 mx-auto mb-2" />
                    <p className="text-slate-700 font-mono text-xs tracking-widest">INFRASTRUCTURE READY</p>
                </div>
                {/* Visual Scanning Effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/20 animate-scan"></div>
                
                {/* Corners */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-blue-600"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-blue-600"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-blue-600"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-blue-600"></div>
            </div>

            {/* OPTION 2: MANUAL ENTRY */}
            <div>
                <div className="flex items-center mb-4 text-[var(--text-muted)]">
                    <Keyboard className="w-4 h-4 mr-2" />
                    <span className="text-xs font-mono uppercase tracking-tighter">Enter 6-Digit Partner Token</span>
                </div>
                <form onSubmit={handleManualSubmit} className="flex gap-4">
                    <input 
                        type="text" 
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                        placeholder="e.g. 849201"
                        className="flex-1 uppercase font-mono tracking-[0.3em] text-center text-lg bg-[var(--bg-input)] border-[var(--border-color)] text-[var(--text-main)] focus:border-blue-500 transition-colors"
                        required
                    />
                    <button 
                        type="submit"
                        disabled={!manualCode || scanning}
                        className="px-8 bg-blue-600 text-white font-mono text-xs uppercase font-bold hover:bg-blue-500 transition-all disabled:opacity-50"
                    >
                        {scanning ? 'VERIFYING...' : 'EXECUTE'}
                    </button>
                </form>
            </div>

            {/* RESULT DISPLAY */}
            {result && (
                <div className={`mt-8 p-6 border animate-in slide-in-from-top-4 duration-300 ${result.status === 'success' ? 'bg-green-500/5 border-green-500/30' : 'bg-red-500/5 border-red-500/30'}`}>
                    <div className="flex items-center mb-6">
                        <div className={`p-2 rounded-full mr-4 ${result.status === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {result.status === 'success' ? <CheckCircle className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                        </div>
                        <div>
                            <div className={`font-mono font-bold text-xl tracking-wider ${result.status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                {result.status === 'success' ? 'ACCESS_GRANTED' : 'ACCESS_DENIED'}
                            </div>
                            <div className="text-[10px] font-mono text-slate-500 uppercase">{result.error_msg || 'AUTHENTICATION_SUCCESSFUL'}</div>
                        </div>
                    </div>
                    
                    {result.status === 'success' && (
                        <div className="grid grid-cols-3 gap-6 border-t border-slate-800 pt-6">
                            <div>
                                <div className="text-[9px] font-mono text-slate-500 uppercase mb-1">Nomad</div>
                                <div className="font-mono text-sm text-white truncate">{result.user}</div>
                            </div>
                            <div>
                                <div className="text-[9px] font-mono text-slate-500 uppercase mb-1">Tier</div>
                                <div className="font-mono text-sm text-blue-500 font-bold uppercase">{result.plan}</div>
                            </div>
                            <div>
                                <div className="text-[9px] font-mono text-slate-500 uppercase mb-1">Balance</div>
                                <div className="font-mono text-sm text-white">{result.checkins_left} DAYS</div>
                            </div>
                        </div>
                    )}
                </div>
            )}

        </div>
      </div>
    </PartnerLayout>
  );
}
