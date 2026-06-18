import React, { useState, useEffect } from 'react';
import api from '../../lib/api'; // FIXED: Switched to shared API client with interceptor
import Head from 'next/head';
import PartnerLayout from '../../components/Layout';
import { Download } from 'lucide-react';

export default function ReportsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
        try {
            // FIXED: Point to the real backend reporting endpoint from spaces/urls.py
            const res = await api.get('/api/partner/reports/');
            setLogs(res.data || []);
        } catch (err) { 
            console.error("Reports Fetch Error:", err.response?.data || err.message); 
        } finally {
            setLoading(false);
        }
    };
    fetchLogs();
  }, []);

  return (
    <PartnerLayout>
      <Head><title>Financial Reports | Partner Portal</title></Head>

      <div className="flex justify-between items-end mb-8">
        <div>
            <h1 className="text-2xl font-bold text-[var(--text-main)] mb-2">Revenue Logs</h1>
            <p className="text-[var(--text-muted)] font-mono text-xs">TRANSACTION HISTORY</p>
        </div>
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] overflow-hidden rounded-sm shadow-sm">
        <table className="w-full text-left">
            <thead className="bg-[var(--bg-input)] text-[var(--text-muted)] font-mono text-[10px] uppercase tracking-wider">
                <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">User</th>
                    <th className="p-4 text-right">Revenue</th>
                </tr>
            </thead>
            <tbody className="font-mono text-xs">
                {logs.length === 0 ? (
                    <tr>
                        <td colSpan="3" className="p-8 text-center text-[var(--text-muted)]">
                            {loading ? 'RETRIEVING_LEDGER...' : 'NO REVENUE DATA'}
                        </td>
                    </tr>
                ) : logs.map((tx, i) => (
                    <tr key={tx.id || i} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-input)]">
                        <td className="p-4 text-[var(--text-muted)]">
                            {tx.timestamp ? new Date(tx.timestamp).toLocaleDateString() : 'N/A'}
                        </td>
                        {/* FIXED: Supports both flat strings and nested object username contracts */}
                        <td className="p-4 text-[var(--text-main)] font-bold">
                            {typeof tx.user === 'object' ? (tx.user?.username || tx.user?.email) : (tx.user || 'Anonymous')}
                        </td>
                        <td className="p-4 text-right text-green-500">₦2,500</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </PartnerLayout>
  );
}
