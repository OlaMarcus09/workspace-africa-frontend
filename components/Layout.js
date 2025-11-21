import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, ScanLine, FileBarChart, Settings, LogOut, Building2 } from 'lucide-react';

const SidebarItem = ({ href, icon: Icon, label, isActive }) => (
  <Link href={href} legacyBehavior>
    <a className={`flex items-center px-4 py-3 mb-1 transition-colors border-r-2 ${isActive ? 'bg-white/5 border-primary text-white' : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
      <Icon className="w-4 h-4 mr-3" />
      <span className="font-mono text-xs uppercase tracking-wider">{label}</span>
    </a>
  </Link>
);

export default function PartnerLayout({ children }) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-background text-slate-300 font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-surface border-r border-white/10 flex-shrink-0 fixed inset-y-0 left-0 z-50">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
            <div className="w-8 h-8 bg-primary/10 flex items-center justify-center rounded-sm border border-primary/20 mr-3">
                <Building2 className="w-4 h-4 text-primary" />
            </div>
            <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">Portal</div>
                <div className="text-white font-bold font-mono text-sm">PARTNER_OS</div>
            </div>
        </div>

        <nav className="mt-8">
            <div className="px-6 mb-2 text-[10px] font-mono text-slate-600 uppercase">Main Menu</div>
            <SidebarItem href="/dashboard" icon={LayoutDashboard} label="Overview" isActive={router.pathname === '/dashboard'} />
            <SidebarItem href="/partner/scan" icon={ScanLine} label="Scanner" isActive={router.pathname === '/partner/scan'} />
            <SidebarItem href="/partner/reports" icon={FileBarChart} label="Reports" isActive={router.pathname === '/partner/reports'} />
            <SidebarItem href="/partner/settings" icon={Settings} label="Config" isActive={router.pathname === '/partner/settings'} />
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
            <button 
                onClick={() => { localStorage.clear(); router.push('/'); }}
                className="flex items-center w-full px-4 py-2 text-xs font-mono text-red-400 hover:bg-red-900/10 transition-colors"
            >
                <LogOut className="w-4 h-4 mr-3" />
                DISCONNECT
            </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 ml-64">
        <header className="h-16 border-b border-white/10 bg-background/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
            <div className="text-[10px] font-mono text-slate-500">
                STATUS: <span className="text-green-500">ONLINE</span> • LOC: IBADAN_HQ
            </div>
            <div className="flex items-center space-x-4">
                <div className="text-right">
                    <div className="text-white font-mono text-xs">Olawale Marcus</div>
                    <div className="text-[10px] text-primary">ADMIN_LEVEL_1</div>
                </div>
                <div className="w-8 h-8 bg-slate-800 rounded-sm border border-white/10"></div>
            </div>
        </header>
        
        <div className="p-8">
            {children}
        </div>
      </main>
    </div>
  );
}
