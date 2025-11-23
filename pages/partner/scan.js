import React, { useState } from 'react';
import Head from 'next/head';
import PartnerLayout from '../../components/Layout';
import { ScanLine, Camera, CheckCircle, XCircle, Keyboard } from 'lucide-react';

export default function ScannerPage() {
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [result, setResult] = useState(null);

  // Simulated Verification Logic
  const verifyToken = (code) => {
    // Simulate API latency
    setTimeout(() => {
        setScanning(false);
        setResult({ 
            status: 'success', 
            user: 'Tola Adebayo', 
            plan: 'FLEX_PRO', 
            checkins_left: 12, 
            code_used: code || 'QR_SCAN' 
        });
    }, 1500);
  };

  const handleScan = () => {
    setScanning(true);
    verifyToken();
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    setScanning(true);
    verifyToken(manualCode);
  };

  return (
    <PartnerLayout>
      <Head><title>Access Scanner | Partner Portal</title></Head>

      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Entry Validator</h1>
            <p className="text-[var(--text-muted)] font-mono text-xs">SCAN USER TOKEN OR ENTER ID MANUALLY</p>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-8 rounded-sm shadow-sm">
            
            {/* OPTION 1: CAMERA */}
            <div className="aspect-video bg-black relative overflow-hidden border-2 border-[var(--border-color)] mb-6 flex items-center justify-center group">
                {scanning && !manualCode ? (
                    <>
                        <div className="absolute inset-0 bg-[var(--color-primary)]/10 animate-pulse"></div>
                        <div className="absolute top-0 w-full h-1 bg-[var(--color-primary)] shadow-[0_0_15px_var(--color-primary)] animate-[scan_2s_infinite]"></div>
                        <div className="text-[var(--color-primary)] font-mono text-xs">SEARCHING_PATTERN...</div>
                    </>
                ) : (
                    <div className="text-center">
                        <Camera className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-2" />
                        <p className="text-[var(--text-muted)] font-mono text-xs">CAMERA STANDBY</p>
                    </div>
                )}
                
                {/* Viewport Corners */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[var(--color-primary)]"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[var(--color-primary)]"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[var(--color-primary)]"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[var(--color-primary)]"></div>
            </div>

            {/* CONTROLS - SCAN */}
            <div className="flex space-x-4 mb-8 border-b border-[var(--border-color)] pb-8">
                <button 
                    onClick={handleScan}
                    disabled={scanning}
                    className="flex-1 py-4 bg-[var(--color-primary)] text-white font-mono text-xs font-bold uppercase hover:opacity-90 transition-opacity"
                >
                    {scanning && !manualCode ? 'PROCESSING...' : 'ACTIVATE_SCANNER'}
                </button>
                <button 
                    onClick={() => { setResult(null); setManualCode(''); }}
                    className="px-6 border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-input)]"
                >
                    RESET
                </button>
            </div>

            {/* OPTION 2: MANUAL ENTRY */}
            <div>
                <div className="flex items-center mb-4 text-[var(--text-muted)]">
                    <Keyboard className="w-4 h-4 mr-2" />
                    <span className="text-xs font-mono uppercase">Or Enter Code Manually</span>
                </div>
                <form onSubmit={handleManualSubmit} className="flex gap-4">
                    <input 
                        type="text" 
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                        placeholder="e.g. NOMAD-884"
                        className="flex-1 uppercase font-mono tracking-widest text-center text-lg bg-[var(--bg-input)] border-[var(--border-color)] focus:border-[var(--color-primary)]"
                    />
                    <button 
                        type="submit"
                        disabled={!manualCode || scanning}
                        className="px-6 bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--color-main)] font-mono text-xs uppercase font-bold"
                    >
                        VERIFY
                    </button>
                </form>
            </div>

            {/* RESULT DISPLAY */}
            {result && (
                <div className="mt-8 p-4 bg-[var(--bg-input)] border border-[var(--border-color)] animate-fade-in">
                    <div className="flex items-center mb-4">
                        {result.status === 'success' ? <CheckCircle className="text-green-500 w-6 h-6 mr-3" /> : <XCircle className="text-red-500 w-6 h-6 mr-3" />}
                        <div>
                            <div className="font-bold text-lg">{result.status === 'success' ? 'ACCESS GRANTED' : 'ACCESS DENIED'}</div>
                            <div className="text-xs font-mono text-[var(--text-muted)]">{new Date().toLocaleTimeString()}</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 border-t border-[var(--border-color)] pt-4">
                        <div>
                            <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">NOMAD</div>
                            <div className="font-bold">{result.user}</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">PROTOCOL</div>
                            <div className="font-bold text-[var(--color-primary)]">{result.plan}</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">SOURCE</div>
                            <div className="font-bold">{result.code_used}</div>
                        </div>
                    </div>
                </div>
            )}

        </div>
      </div>
    </PartnerLayout>
  );
}
