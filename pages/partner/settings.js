import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import PartnerLayout from '../../components/Layout';
import { Save } from 'lucide-react';

export default function SettingsPage() {
  const [space, setSpace] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
        const token = localStorage.getItem('accessToken');
        // Fetch 'me' which should contain managed_space info
        const res = await axios.get(`${API_URL}/api/users/me/`, {
             headers: { Authorization: `Bearer ${token}` }
        });
        // Assuming backend structure returning managed_space details
        if (res.data.managed_space_details) {
            setSpace(res.data.managed_space_details);
        } else {
            setSpace({ name: res.data.username, address: "Update Address..." });
        }
    };
    fetchData();
  }, []);

  return (
    <PartnerLayout>
      <Head><title>System Config | Partner Portal</title></Head>

      <div className="max-w-3xl">
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-[var(--text-main)] mb-2">Node Configuration</h1>
            <p className="text-[var(--text-muted)] font-mono text-xs">MANAGE SPACE DETAILS</p>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-8 rounded-sm shadow-sm space-y-6">
            <div>
                <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">Space Name</label>
                <input type="text" value={space?.name || ''} readOnly className="opacity-70 cursor-not-allowed bg-[var(--bg-input)]" />
            </div>
            
            <div>
                <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">Address</label>
                <input type="text" value={space?.address || ''} readOnly className="opacity-70 cursor-not-allowed bg-[var(--bg-input)]" />
            </div>

            <div className="pt-6 border-t border-[var(--border-color)]">
                <p className="text-xs text-[var(--text-muted)]">To update critical details, please contact Workspace Africa Admin.</p>
            </div>
        </div>
      </div>
    </PartnerLayout>
  );
}
