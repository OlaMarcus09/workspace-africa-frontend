import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import PartnerLayout from '../components/Layout';
import { Users, CheckCircle, DollarSign, Activity, ArrowUpRight } from 'lucide-react';

// Metric Card
const MetricBlock = ({ label, value, sub, icon: Icon, trend }) => (
  <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 relative overflow-hidden group hover:border-[var(--color-primary)] transition-colors">
    <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-[var(--bg-input)] rounded-sm text-[var(--color-primary)]">
            <Icon className="w-5 h-5" />
        </div>
        {trend && (
            <div className="flex items-center text-green-500 text-[10px] font-mono">
                <ArrowUpRight className="w-3 h-3 mr-1" /> {trend}
            </div>
        )}
    </div>
    <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-1">{label}</div>
    <div className="text-3xl font-mono font-bold text-[var(--text-main)] mb-1">{value}</div>
    <div className="text-xs text-[var(--text-muted)] font-mono">{sub}</div>
  </div>
);

export default function PartnerDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
      today: 0,
      month: 0,
      revenue: 0,
      health: '100%' // Default to healthy
  });
  const [checkIns, setCheckIns] = useState([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://workspace-africa-backend.onrender.com';

  useEffect(() => {
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) { Router.push('/'); return; }

            // 1. Fetch Check-ins from Real API
            // We fetch all checkins and filter/calculate on client side for now
            // (In a larger app, the backend should provide a summary endpoint)
            const response = await axios.get(`${API_URL}/api/spaces/check-ins/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Process Real Data
            const realData = response.data || [];
            setCheckIns(realData);

            // Calculate basic stats
            const today = new Date().toDateString();
            const todayCount = realData.filter(c => new Date(c.timestamp).toDateString() === today).length;
            const monthCount = realData.length; // Assuming API returns recent history
            // Estimate revenue (This should ideally come from backend model)
            const estRevenue = monthCount * 2500; // Using average payout rate

            setStats({
                today: todayCount,
                month: monthCount,
                revenue: estRevenue,
                health: 'ONLINE'
            });

        } catch (err) {
            console.error("Dashboard Sync Error:", err);
            // No fake data fallback. If it fails, it shows 0.
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, []);

  return (
    <PartnerLayout>
      <Head><title>Command Center | Partner Portal</title></Head>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-main)] mb-2">Infrastructure Overview</h1>
        <p className="text-[var(--text-muted)] font-mono text-xs">REAL-TIME METRICS</p>
      </div>

      {/* --- METRICS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricBlock label="Today's Traffic" value={stats.today} sub="VISITORS ON SITE" icon={Users} />
        <MetricBlock label="Total Check-ins" value={stats.month} sub="THIS MONTH" icon={CheckCircle} />
        <MetricBlock label="Est. Revenue" value={`₦${stats.revenue.toLocaleString()}`} sub="PENDING PAYOUT" icon={DollarSign} />
        <MetricBlock label="System Health" value={stats.health} sub="OPERATIONAL" icon={Activity} />
      </div>

      {/* --- LIVE FEED --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Check-ins Table */}
          <div className="lg:col-span-2 bg-[var(--bg-surface)] border border-[var(--border-color)]">
             <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center">
                <h3 className="text-xs font-mono text-[var(--text-main)] uppercase font-bold">Live Access Logs</h3>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
             </div>
             <div className="p-0 overflow-x-auto">
                {checkIns.length === 0 ? (
                    <div className="p-12 text-center text-[var(--text-muted)] font-mono text-xs">
                        NO_DATA_STREAM_DETECTED
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-mono text-[var(--text-muted)] border-b border-[var(--border-color)] uppercase bg-[var(--bg-input)]">
                                <th className="p-4 font-normal">User</th>
                                <th className="p-4 font-normal">Timestamp</th>
                                <th className="p-4 font-normal">Status</th>
                            </tr>
                        </thead>
                        <tbody className="font-mono text-xs">
                            {checkIns.slice(0, 5).map((log) => (
                                <tr key={log.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-input)] transition-colors">
                                    <td className="p-4 text-[var(--text-main)] font-bold">{log.user?.email || 'Unknown'}</td>
                                    <td className="p-4 text-[var(--text-muted)]">{new Date(log.timestamp).toLocaleString()}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded-sm text-[10px] bg-green-500/10 text-green-600">
                                            VERIFIED
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
             </div>
          </div>

          {/* Quick Controls */}
          <div className="space-y-4">
             <div className="bg-[var(--bg-input)] border border-[var(--border-color)] p-6">
                <h3 className="text-xs font-mono text-[var(--text-main)] uppercase font-bold mb-4">Quick Commands</h3>
                <button onClick={() => Router.push('/partner/scan')} className="w-full py-3 bg-[var(--color-primary)] text-white font-mono text-xs font-bold mb-3 hover:opacity-90 transition-colors uppercase">
                    Launch Scanner
                </button>
             </div>
          </div>

      </div>
    </PartnerLayout>
  );
}
