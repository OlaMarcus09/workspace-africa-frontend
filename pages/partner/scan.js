import React, { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import PartnerLayout from '../../components/Layout';
import { ScanLine, Camera, CheckCircle, XCircle, Keyboard } from 'lucide-react';

export default function ScannerPage() {
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [result, setResult] = useState(null);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://workspace-africa-backend.onrender.com';

  const verifyToken = async (code) => {
    setScanning(true);
    try {
        const token = localStorage.getItem('accessToken');
        // REAL API CALL
        const response = await axios.post(`${API_URL}/api/check-ins/validate/`, 
            { code: code },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        setResult({ 
            status: 'success', 
            user: response.data.user_name, 
            plan: response.data.plan_name, 
            checkins_left: response.data.remaining_days, 
            code_used: code 
        });
    } catch (err) {
        console.error(err);
        setResult({ 
            status: 'error', 
            error_msg: err.response?.data?.detail || 'INVALID OR EXPIRED TOKEN'
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
            
            {/* OPTION 1: CAMERA (Visual Only for MVP) */}
            <div className="aspect-video bg-black relative overflow-hidden border-2 border-[var(--border-color)] mb-6 flex items-center justify-center group">
                <div className="text-center">
                    <Camera className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-2" />
                    <p className="text-[var(--text-muted)] font-mono text-xs">CAMERA STANDBY (USE MANUAL ENTRY)</p>
                </div>
                {/* Corners */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[var(--color-primary)]"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[var(--color-primary)]"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[var(--color-primary)]"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[var(--color-primary)]"></div>
            </div>

            {/* OPTION 2: MANUAL ENTRY */}
            <div>
                <div className="flex items-center mb-4 text-[var(--text-muted)]">
                    <Keyboard className="w-4 h-4 mr-2" />
                    <span className="text-xs font-mono uppercase">Enter 6-Digit Token</span>
                </div>
                <form onSubmit={handleManualSubmit} className="flex gap-4">
                    <input 
                        type="text" 
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                        placeholder="e.g. 849201"
                        className="flex-1 uppercase font-mono tracking-widest text-center text-lg bg-[var(--bg-input)] border-[var(--border-color)] text-[var(--text-main)] focus:border-[var(--color-primary)]"
                    />
                    <button 
                        type="submit"
                        disabled={!manualCode || scanning}
                        className="px-6 bg-[var(--color-primary)] text-white border border-[var(--color-primary)] font-mono text-xs uppercase font-bold hover:opacity-90"
                    >
                        {scanning ? 'VERIFYING...' : 'VERIFY'}
                    </button>
                </form>
            </div>

            {/* RESULT DISPLAY */}
            {result && (
                <div className={`mt-8 p-4 border animate-fade-in ${result.status === 'success' ? 'bg-green-500/10 border-green-500/50' : 'bg-red-500/10 border-red-500/50'}`}>
                    <div className="flex items-center mb-4">
                        {result.status === 'success' ? <CheckCircle className="text-green-500 w-6 h-6 mr-3" /> : <XCircle className="text-red-500 w-6 h-6 mr-3" />}
                        <div>
                            <div className="font-bold text-lg text-[var(--text-main)]">{result.status === 'success' ? 'ACCESS GRANTED' : 'ACCESS DENIED'}</div>
                            <div className="text-xs font-mono text-[var(--text-muted)]">{result.error_msg || 'VALID_TOKEN'}</div>
                        </div>
                    </div>
                    {result.status === 'success' && (
                        <div className="grid grid-cols-3 gap-4 border-t border-[var(--border-color)] pt-4">
                            <div><div className="text-[10px] text-[var(--text-muted)]">NOMAD</div><div className="font-bold text-[var(--text-main)]">{result.user}</div></div>
                            <div><div className="text-[10px] text-[var(--text-muted)]">PLAN</div><div className="font-bold text-[var(--color-primary)]">{result.plan}</div></div>
                            <div><div className="text-[10px] text-[var(--text-muted)]">LEFT</div><div className="font-bold text-[var(--text-main)]">{result.checkins_left}</div></div>
                        </div>
                    )}
                </div>
            )}

        </div>
      </div>
    </PartnerLayout>
  );
}
