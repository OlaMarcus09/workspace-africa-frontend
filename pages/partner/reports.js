import React from 'react';
import Head from 'next/head';
import PartnerLayout from '../../components/Layout';
import { Download, Calendar } from 'lucide-react';

export default function ReportsPage() {
  const transactions = [
      { id: 'TX-001', date: '2025-11-21', user: 'Tola A.', type: 'CHECK_IN', amount: '₦1,500' },
      { id: 'TX-002', date: '2025-11-21', user: 'David K.', type: 'CHECK_IN', amount: '₦1,500' },
      { id: 'TX-003', date: '2025-11-20', user: 'Sarah J.', type: 'MEETING_ROOM', amount: '₦5,000' },
      { id: 'TX-004', date: '2025-11-20', user: 'Mike B.', type: 'CHECK_IN', amount: '₦1,500' },
      { id: 'TX-005', date: '2025-11-19', user: 'Lisa M.', type: 'CHECK_IN', amount: '₦1,500' },
  ];

  return (
    <PartnerLayout>
      <Head><title>Financial Reports | Partner Portal</title></Head>

      <div className="flex justify-between items-end mb-8">
        <div>
            <h1 className="text-2xl font-bold mb-2">Revenue Logs</h1>
            <p className="text-[var(--text-muted)] font-mono text-xs">TRANSACTION HISTORY & PAYOUTS</p>
        </div>
        <button className="flex items-center px-4 py-2 border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-input)] text-xs font-mono transition-colors">
            <Download className="w-4 h-4 mr-2" /> EXPORT_CSV
        </button>
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] overflow-hidden rounded-sm shadow-sm">
        <table className="w-full text-left">
            <thead className="bg-[var(--bg-input)] text-[var(--text-muted)] font-mono text-[10px] uppercase tracking-wider">
                <tr>
                    <th className="p-4">Transaction ID</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">User</th>
                    <th className="p-4">Service Type</th>
                    <th className="p-4 text-right">Revenue</th>
                </tr>
            </thead>
            <tbody className="font-mono text-xs">
                {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-input)] transition-colors">
                        <td className="p-4 font-bold">{tx.id}</td>
                        <td className="p-4 text-[var(--text-muted)]">{tx.date}</td>
                        <td className="p-4">{tx.user}</td>
                        <td className="p-4">
                            <span className="px-2 py-1 border border-[var(--border-color)] rounded-sm text-[10px] bg-[var(--bg-main)]">
                                {tx.type}
                            </span>
                        </td>
                        <td className="p-4 text-right font-bold text-green-500">{tx.amount}</td>
                    </tr>
                ))}
            </tbody>
            <tfoot className="bg-[var(--bg-input)] font-mono text-xs font-bold">
                <tr>
                    <td colSpan="4" className="p-4 text-right text-[var(--text-muted)]">TOTAL ESTIMATED REVENUE</td>
                    <td className="p-4 text-right text-[var(--text-main)]">₦11,000</td>
                </tr>
            </tfoot>
        </table>
      </div>
    </PartnerLayout>
  );
}
