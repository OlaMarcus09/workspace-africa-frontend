import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import PartnerLayout from '../components/Layout';

// A "Raptor-style" card component
const StatCard = ({ title, value, loading }) => (
  <div className="p-6 bg-white shadow-lg rounded-2xl">
    <h3 className="text-sm font-medium text-neutral-500">{title}</h3>
    {loading ? (
      <div className="w-3/4 h-8 mt-2 bg-neutral-200 animate-pulse rounded-lg" />
    ) : (
      <p className="mt-1 text-4xl font-bold text-neutral-800">{value}</p>
    )}
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          Router.push('/login');
          return;
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${API_URL}/api/partner/dashboard/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setStats(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          // Token is expired or invalid
          localStorage.clear();
          Router.push('/login');
        } else {
          setError('Could not load dashboard data.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <PartnerLayout activePage="dashboard">
      <h1 className="text-3xl font-bold text-neutral-800">
        Welcome, {stats?.space_name || 'Partner'}
      </h1>

      <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-3">
        <StatCard
          title="Current Members Checked-In"
          value={stats?.current_members_checked_in}
          loading={loading}
        />
        <StatCard
          title="Total Monthly Check-ins"
          value={stats?.monthly_checkins}
          loading={loading}
        />
        <StatCard
          title="Estimated Monthly Payout"
          value={stats ? `₦${Number(stats.monthly_payout_ngn).toLocaleString()}` : 0}
          loading={loading}
        />
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600">{error}</p>
      )}

    </PartnerLayout>
  );
}
