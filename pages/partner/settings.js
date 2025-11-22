import React from 'react';
import Head from 'next/head';
import PartnerLayout from '../../components/Layout';
import { Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <PartnerLayout>
      <Head><title>System Config | Partner Portal</title></Head>

      <div className="max-w-3xl">
        <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Node Configuration</h1>
            <p className="text-[var(--text-muted)] font-mono text-xs">MANAGE SPACE DETAILS & PREFERENCES</p>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-8 rounded-sm shadow-sm space-y-6">
            
            {/* Section 1 */}
            <div>
                <h3 className="text-sm font-bold font-mono uppercase mb-4 text-[var(--color-primary)]">General Info</h3>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">Space Name</label>
                        <input type="text" defaultValue="Seb's Hub" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">Location ID</label>
                        <input type="text" defaultValue="LOC_IB_001" disabled className="opacity-50 cursor-not-allowed" />
                    </div>
                </div>
            </div>

            {/* Section 2 */}
            <div>
                <h3 className="text-sm font-bold font-mono uppercase mb-4 text-[var(--color-primary)] mt-6">Operational Params</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">Opening Hours</label>
                        <div className="flex gap-4">
                            <input type="time" defaultValue="08:00" />
                            <span className="self-center text-[var(--text-muted)]">-</span>
                            <input type="time" defaultValue="20:00" />
                        </div>
                    </div>
                    <div>
                         <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">Capacity Limit</label>
                         <input type="number" defaultValue="50" className="max-w-[100px]" />
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-[var(--border-color)]">
                <button className="flex items-center px-6 py-3 bg-[var(--color-primary)] text-white font-mono text-xs font-bold uppercase hover:opacity-90 transition-opacity">
                    <Save className="w-4 h-4 mr-2" /> SAVE_CONFIG
                </button>
            </div>

        </div>
      </div>
    </PartnerLayout>
  );
}
