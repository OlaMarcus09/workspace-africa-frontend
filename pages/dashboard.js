import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import PartnerLayout from '../components/Layout';
import { Users, CheckCircle, DollarSign, Activity, ArrowUpRight } from 'lucide-react';

// Metric Card Component
const MetricBlock = ({ label, value, sub, icon: Icon, trend }) => (
  <div className="bg-surface border border-white/10 p-6 relative overflow-hidden group hover:border-primary/50 transition-colors">
    <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-white/5 rounded-sm text-primary">
            <Icon className="w-5 h-5" />
        </div>
        {trend && (
            <div className="flex items-center text-green-500 text-[10px] font-mono">
                <ArrowUpRight className="w-3 h-3 mr-1" /> {trend}
            </div>
        )}
    </div>
    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">{label}</div>
    <div className="text-3xl font-mono font-bold text-white mb-1">{value}</div>
    <div className="text-xs text-slate-600 font-mono">{sub}</div>
  </div>
);

export default function PartnerDashboard() {
  const [loading, setLoading] = useState(true);
  const [checkIns, setCheckIns] = useState([]);

  useEffect(() => {
    // Demo Data Simulation
    setTimeout(() => {
        setCheckIns([
            { id: 1, user: "Tola A.", time: "10:42 AM", status: "ACTIVE" },
            { id: 2, user: "David K.", time: "09:15 AM", status: "ACTIVE" },
            { id: 3, user: "Sarah J.", time: "08:30 AM", status: "COMPLETED" },
        ]);
        setLoading(false);
    }, 1000);
  }, []);

  return (
    <PartnerLayout>
      <Head><title>Command Center | Partner Portal</title></Head>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Infrastructure Overview</h1>
        <p className="text-slate-500 font-mono text-xs">REAL-TIME METRICS FOR [SEB'S HUB]</p>
      </div>

      {/* --- METRICS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricBlock label="Today's Traffic" value="24" sub="VISITORS ON SITE" icon={Users} trend="+12%" />
        <MetricBlock label="Total Check-ins" value="1,204" sub="THIS MONTH" icon={CheckCircle} trend="+5%" />
        <MetricBlock label="Est. Revenue" value="₦450k" sub="PENDING PAYOUT" icon={DollarSign} trend="+8%" />
        <MetricBlock label="System Health" value="98%" sub="OPERATIONAL" icon={Activity} />
      </div>

      {/* --- LIVE FEED --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Check-ins Table */}
          <div className="lg:col-span-2 bg-surface border border-white/10">
             <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-xs font-mono text-white uppercase font-bold">Live Access Logs</h3>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
             </div>
             <div className="p-0">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] font-mono text-slate-500 border-b border-white/5 uppercase">
                            <th className="p-4 font-normal">User_ID</th>
                            <th className="p-4 font-normal">Timestamp</th>
                            <th className="p-4 font-normal">Status</th>
                        </tr>
                    </thead>
                    <tbody className="font-mono text-xs">
                        {checkIns.map((log) => (
                            <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="p-4 text-white font-bold">{log.user}</td>
                                <td className="p-4 text-slate-400">{log.time}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-sm text-[10px] ${log.status === 'ACTIVE' ? 'bg-green-900/20 text-green-400' : 'bg-slate-800 text-slate-400'}`}>
                                        {log.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
          </div>

          {/* Quick Controls */}
          <div className="space-y-4">
             <div className="bg-[#050505] border border-white/10 p-6">
                <h3 className="text-xs font-mono text-white uppercase font-bold mb-4">Quick Commands</h3>
                <button onClick={() => Router.push('/partner/scan')} className="w-full py-3 bg-primary text-white font-mono text-xs font-bold mb-3 hover:bg-orange-600 transition-colors uppercase">
                    Launch Scanner
                </button>
                <button className="w-full py-3 bg-transparent border border-slate-700 text-slate-300 font-mono text-xs hover:border-white hover:text-white transition-colors uppercase">
                    Generate Report
                </button>
             </div>

             <div className="bg-blue-900/10 border border-blue-500/20 p-6">
                <h3 className="text-xs font-mono text-blue-400 uppercase font-bold mb-2">Maintenance Alert</h3>
                <p className="text-[10px] text-blue-200/70 mb-4">Scheduled downtime for server maintenance on Nov 25, 03:00 AM.</p>
                <span className="text-[10px] font-mono text-blue-500 underline cursor-pointer">VIEW_DETAILS</span>
             </div>
          </div>

      </div>
    </PartnerLayout>
  );
}
