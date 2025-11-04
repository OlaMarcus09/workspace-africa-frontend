import React from 'react';
import Router from 'next/router';
import Link from 'next/link';
// We'll import icons later
// import { QrCodeIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function PartnerLayout({ children, activePage }) {

  const handleLogout = () => {
    localStorage.clear();
    Router.push('/login');
  };

  const NavLink = ({ href, children, isActive }) => (
    <Link href={href} legacyBehavior>
      <a
        className={`
          flex items-center px-4 py-3 text-sm font-medium
          ${
            isActive
              ? 'bg-teal-700 text-white'
              : 'text-neutral-300 hover:bg-neutral-700 hover:text-white'
          }
        `}
      >
        {/* <Icon className="w-6 h-6 mr-3" /> */}
        {children}
      </a>
    </Link>
  );

  return (
    <div className="flex h-screen bg-neutral-100">
      {/* --- Sidebar (Raptor-style) --- */}
      <div className="flex flex-col w-64 bg-neutral-800">
        <div className="flex items-center justify-center h-20 shadow-md">
          {/* We'll add our logo here */}
          <h1 className="text-2xl font-bold text-white">Partner Portal</h1>
        </div>
        
        <nav className="flex-1 mt-5">
          <NavLink href="/dashboard" isActive={activePage === 'dashboard'}>
            Dashboard
          </NavLink>
          <NavLink href="/scanner" isActive={activePage === 'scanner'}>
            Scan Member
          </NavLink>
        </nav>

        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 text-sm font-medium text-left text-neutral-300 hover:bg-neutral-700 hover:text-white"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
