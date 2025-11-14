import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Building, CreditCard, TrendingUp, Shield } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, description, trend }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">
        {description}
        {trend && <span className={trend > 0 ? 'text-green-600' : 'text-red-600'}> {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%</span>}
      </p>
    </CardContent>
  </Card>
);

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          Router.push('/');
          return;
        }

        // Simulate super admin data
        setStats({
          totalUsers: 1247,
          activeSpaces: 23,
          monthlyRevenue: 1250000,
          totalCheckins: 8456,
        });

        setRecentActivity([
          { id: 1, action: 'New Partner Registration', user: 'Tech Hub Lagos', time: '2 hours ago' },
          { id: 2, action: 'Team Plan Upgrade', user: 'Acme Corporation', time: '5 hours ago' },
          { id: 3, action: 'Space Added', user: 'Creative Space Abuja', time: '1 day ago' },
          { id: 4, action: 'Payment Processed', user: '₦45,000 - Team Pro', time: '1 day ago' },
        ]);

      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.clear();
          Router.push('/');
        }
      }
    };

    fetchData();
  }, []);

  if (!stats) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Super Admin Dashboard</h1>
        </div>
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <Head>
        <title>Super Admin Dashboard | Workspace Africa</title>
      </Head>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Shield className="w-8 h-8" />
            Super Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Platform overview and system management
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          description="All platform users"
          trend={12}
          icon={Users}
        />
        <StatCard
          title="Active Spaces"
          value={stats.activeSpaces}
          description="Partner spaces"
          trend={5}
          icon={Building}
        />
        <StatCard
          title="Monthly Revenue"
          value={`₦${(stats.monthlyRevenue / 1000).toFixed(0)}K`}
          description="Current month"
          trend={18}
          icon={CreditCard}
        />
        <StatCard
          title="Total Check-ins"
          value={stats.totalCheckins.toLocaleString()}
          description="All-time check-ins"
          trend={8}
          icon={TrendingUp}
        />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid gap-8 mt-8 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.user}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full text-left p-3 border rounded-lg hover:bg-accent transition-colors">
              Manage Partner Spaces
            </button>
            <button className="w-full text-left p-3 border rounded-lg hover:bg-accent transition-colors">
              View System Reports
            </button>
            <button className="w-full text-left p-3 border rounded-lg hover:bg-accent transition-colors">
              User Management
            </button>
            <button className="w-full text-left p-3 border rounded-lg hover:bg-accent transition-colors">
              Platform Settings
            </button>
            <button className="w-full text-left p-3 border rounded-lg hover:bg-accent transition-colors">
              Billing Overview
            </button>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="font-medium">API Server</p>
              <p className="text-sm text-muted-foreground">Operational</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="font-medium">Database</p>
              <p className="text-sm text-muted-foreground">Healthy</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="font-medium">Payments</p>
              <p className="text-sm text-muted-foreground">Processing</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
