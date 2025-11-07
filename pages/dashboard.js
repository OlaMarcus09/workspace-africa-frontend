import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import PartnerLayout from '../components/Layout';
// Import our shadcn Card components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Re-styled StatCard using shadcn
const StatCard = ({ title, value, loading }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      {loading ? (
        <div className="w-3/4 h-8 mt-1 bg-muted animate-pulse rounded-lg" />
      ) : (
        <p className="text-4xl font-bold text-foreground">{value}</p>
      )}
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) { Router.push('/'); return; }

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${API_URL}/api/partner/dashboard/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setStats(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.clear();
          Router.push('/');
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
      <Head>
        <title>Dashboard | Partner Portal</title>
      </Head>
      <h1 className="text-3xl font-bold text-foreground">
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
        <p className="mt-4 text-sm text-destructive">{error}</p>
      )}

    </PartnerLayout>
  );
}
