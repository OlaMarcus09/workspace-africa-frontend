import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import PartnerLayout from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, BarChart, CircleDollarSign, CalendarCheck } from 'lucide-react';

// Helper component for the stat cards
const StatCard = ({ title, value, icon: Icon, description }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default function PartnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          Router.push('/');
          return;
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${API_URL}/api/partner/dashboard/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setData(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.clear();
          Router.push('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <PartnerLayout activePage="dashboard">
      <Head>
        <title>Dashboard | Partner Portal</title>
      </Head>
      <h1 className="text-3xl font-bold text-foreground">
        Welcome, {data?.space_name || 'Partner'}
      </h1>
      
      {loading ? (
        <p className="mt-4 text-muted-foreground">Loading dashboard data...</p>
      ) : data ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8">
          <StatCard
            title="Today's Check-Ins"
            value={data.current_members_checked_in}
            description="Members currently at your space."
            icon={Users}
          />
          <StatCard
            title="Monthly Check-Ins"
            value={data.monthly_checkins}
            description="Total check-ins this month."
            icon={CalendarCheck}
          />
          <StatCard
            title="Est. Monthly Payout"
            value={`₦${Number(data.monthly_payout_ngn).toLocaleString()}`}
            description={`Based on ₦${Number(data.payout_per_checkin_ngn).toLocaleString()} / check-in`}
            icon={CircleDollarSign}
          />
          <StatCard
            title="Capacity (Placeholder)"
            value="75%"
            description="15 of 20 seats occupied."
            icon={BarChart}
          />
        </div>
      ) : (
        <p className="mt-4 text-red-500">Could not load dashboard data.</p>
      )}

      {/* Placeholder for charts */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Check-In Trends (Placeholder)</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">[Chart will go here]</p>
        </CardContent>
      </Card>
      
    </PartnerLayout>
  );
}
