import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import PartnerLayout from '../../components/PartnerLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, TrendingUp, DollarSign, Zap, Sparkles, ArrowRight, QrCode, BarChart3 } from 'lucide-react';

export default function PartnerDashboard() {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Get dynamic greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) { 
          Router.push('/login'); 
          return; 
        }

        const [userRes, dashboardRes] = await Promise.all([
          axios.get(`${API_URL}/api/users/me/`, { 
            headers: { Authorization: `Bearer ${token}` } 
          }),
          axios.get(`${API_URL}/api/partner/dashboard/`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setUser(userRes.data);
        setDashboardData(dashboardRes.data);
      } catch (err) {
        console.error('Error fetching partner data:', err);
        if (err.response && err.response.status === 401) {
          localStorage.clear();
          Router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const StatCard = ({ title, value, subtitle, icon, color = "purple", trend }) => (
    <Card className="border-0 bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-purple-500/30 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className={`w-12 h-12 bg-${color}-500/20 rounded-xl flex items-center justify-center text-${color}-400`}>
            {icon}
          </div>
          {trend && (
            <Badge className={`${trend > 0 ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'} text-xs`}>
              {trend > 0 ? '+' : ''}{trend}%
            </Badge>
          )}
        </div>
        <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
        <p className="text-gray-400 text-sm">{title}</p>
        {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );

  const QuickAction = ({ icon, title, description, action, color = "blue" }) => (
    <Card 
      className="border-0 bg-gray-900/50 hover:bg-gray-800/50 transition-all duration-300 group cursor-pointer active:scale-95"
      onClick={() => Router.push(action)}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className={`w-10 h-10 bg-${color}-500/20 rounded-lg flex items-center justify-center text-${color}-400 group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white text-sm mb-1">{title}</h3>
            <p className="text-gray-400 text-xs">{description}</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <PartnerLayout activePage="dashboard" user={null}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading dashboard...</p>
          </div>
        </div>
      </PartnerLayout>
    );
  }

  return (
    <PartnerLayout activePage="dashboard" user={user}>
      <Head>
        <title>Partner Dashboard | Workspace Africa</title>
      </Head>

      {/* --- Header --- */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {getGreeting()}, {user?.username || 'Partner'}! 👋
            </h1>
            <p className="text-gray-400 text-sm mt-1">Manage your workspace and track activity</p>
          </div>
        </div>
      </div>

      {/* --- Quick Stats --- */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          title="Active Now"
          value={dashboardData?.current_members_checked_in || 0}
          subtitle="Currently checked in"
          icon={<Users className="w-6 h-6" />}
          color="purple"
        />
        <StatCard
          title="Monthly Check-ins"
          value={dashboardData?.monthly_checkins || 0}
          subtitle="This month"
          icon={<Calendar className="w-6 h-6" />}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          title="Payout Rate"
          value={`₦${dashboardData?.payout_per_checkin_ngn || 0}`}
          subtitle="Per check-in"
          icon={<DollarSign className="w-6 h-6" />}
          color="green"
        />
        <StatCard
          title="Monthly Payout"
          value={`₦${dashboardData?.monthly_payout_ngn || 0}`}
          subtitle="Estimated"
          icon={<TrendingUp className="w-6 h-6" />}
          color="yellow"
        />
      </div>

      {/* --- Quick Actions --- */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Quick Actions</h2>
          <Sparkles className="w-4 h-4 text-purple-400" />
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          <QuickAction
            icon={<QrCode className="w-5 h-5" />}
            title="Scan Member"
            description="Validate check-in codes"
            action="/partner/scan"
            color="purple"
          />
          <QuickAction
            icon={<BarChart3 className="w-5 h-5" />}
            title="View Reports"
            description="Check-in history & analytics"
            action="/partner/reports"
            color="blue"
          />
          <QuickAction
            icon={<Users className="w-5 h-5" />}
            title="Space Settings"
            description="Manage your workspace"
            action="/partner/settings"
            color="green"
          />
        </div>
      </div>

      {/* --- Recent Activity --- */}
      <Card className="border-0 bg-gradient-to-br from-gray-900 to-black border border-gray-800">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-400" />
            Recent Activity
          </CardTitle>
          <CardDescription className="text-gray-400">
            Latest check-ins at your space
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dashboardData?.monthly_checkins > 0 ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 mx-auto mb-2 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <p className="text-gray-400 text-sm">
                  {dashboardData.monthly_checkins} check-ins this month
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 border-purple-500 text-purple-300 hover:bg-purple-500/10"
                  onClick={() => Router.push('/partner/reports')}
                >
                  View Full Report
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto mb-3 bg-gray-800 rounded-full flex items-center justify-center">
                  <QrCode className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="font-bold text-white text-sm mb-1">No Activity Yet</h3>
                <p className="text-gray-400 text-xs mb-4">
                  Start scanning member codes to see activity here
                </p>
                <Button 
                  onClick={() => Router.push('/partner/scan')}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-sm"
                >
                  Scan First Member
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </PartnerLayout>
  );
}
