import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import PartnerLayout from '../../components/Layout';
import { Download } from 'lucide-react';

export default function ReportsPage() {
  const [logs, setLogs] = useState([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchLogs = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await axios.get(`${API_URL}/api/spaces/check-ins/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(res.data || []);
        } catch (err) { console.error(err); }
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
                    <tr><td colSpan="3" className="p-8 text-center text-[var(--text-muted)]">NO REVENUE DATA</td></tr>
                ) : logs.map((tx, i) => (
                    <tr key={i} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-input)]">
                        <td className="p-4 text-[var(--text-muted)]">{new Date(tx.timestamp).toLocaleDateString()}</td>
                        <td className="p-4 text-[var(--text-main)] font-bold">{tx.user}</td>
                        <td className="p-4 text-right text-green-500">₦2,500</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </PartnerLayout>
  );
}
