import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, ScanLine, FileBarChart, Settings, LogOut, Building2 } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const SidebarItem = ({ href, icon: Icon, label, isActive }) => (
  <Link href={href} legacyBehavior>
    <a className={`flex items-center px-4 py-3 mb-1 transition-colors border-r-2 ${isActive ? 'bg-[var(--bg-input)] border-[var(--color-primary)] text-[var(--text-main)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-input)]'}`}>
      <Icon className="w-4 h-4 mr-3" />
      <span className="font-mono text-xs uppercase tracking-wider">{label}</span>
    </a>
  </Link>
);

export default function PartnerLayout({ children }) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans transition-colors duration-300">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-[var(--bg-surface)] border-r border-[var(--border-color)] flex-shrink-0 fixed inset-y-0 left-0 z-50 transition-colors duration-300 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-[var(--border-color)] flex-shrink-0">
            <div className="w-8 h-8 bg-[var(--color-primary)]/10 flex items-center justify-center rounded-sm border border-[var(--color-primary)]/20 mr-3">
                <Building2 className="w-4 h-4 text-[var(--color-primary)]" />
            </div>
            <div>
                <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Portal</div>
                <div className="font-bold font-mono text-sm tracking-tight">PARTNER_OS</div>
            </div>
        </div>

        <nav className="mt-8 flex-1 overflow-y-auto">
            <div className="px-6 mb-2 text-[10px] font-mono text-[var(--text-muted)] uppercase">Main Menu</div>
            <SidebarItem href="/dashboard" icon={LayoutDashboard} label="Overview" isActive={router.pathname === '/dashboard'} />
            <SidebarItem href="/partner/scan" icon={ScanLine} label="Scanner" isActive={router.pathname === '/partner/scan'} />
            <SidebarItem href="/partner/reports" icon={FileBarChart} label="Reports" isActive={router.pathname === '/partner/reports'} />
            <SidebarItem href="/partner/settings" icon={Settings} label="Config" isActive={router.pathname === '/partner/settings'} />
        </nav>

        <div className="p-4 border-t border-[var(--border-color)] space-y-3 flex-shrink-0 bg-[var(--bg-surface)]">
            
            {/* THEME TOGGLE COMPONENT */}
            <div className="flex items-center justify-between px-2 text-[10px] font-mono text-[var(--text-muted)] uppercase">
                <span>Theme</span>
                <ThemeToggle className="w-full ml-2" />
            </div>

            <button 
                onClick={() => { localStorage.clear(); router.push('/'); }}
                className="flex items-center w-full px-4 py-2 text-xs font-mono text-red-400 hover:bg-red-500/10 transition-colors rounded-sm border border-transparent hover:border-red-500/20"
            >
                <LogOut className="w-4 h-4 mr-3" />
                DISCONNECT
            </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 ml-64 transition-all duration-300">
        <header className="h-16 border-b border-[var(--border-color)] bg-[var(--bg-main)]/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between transition-colors duration-300">
            <div className="text-[10px] font-mono text-[var(--text-muted)]">
                STATUS: <span className="text-green-500">ONLINE</span> • LOC: IBADAN_HQ
            </div>
            <div className="flex items-center space-x-4">
                <div className="text-right">
                    <div className="font-mono text-xs text-[var(--text-main)]">Olawale Marcus</div>
                    <div className="text-[10px] text-[var(--color-primary)]">ADMIN_LEVEL_1</div>
                </div>
                <div className="w-8 h-8 bg-[var(--bg-surface)] rounded-sm border border-[var(--border-color)] flex items-center justify-center font-mono text-xs text-[var(--text-muted)]">OM</div>
            </div>
        </header>
        
        <div className="p-8">
            {children}
        </div>
      </main>
    </div>
  );
}
