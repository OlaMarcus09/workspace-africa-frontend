import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import PartnerLayout from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, BarChart, CircleDollarSign, CalendarCheck, Building } from 'lucide-react';

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
  const [user, setUser] = useState(null);
  const [space, setSpace] = useState(null);
  const [checkIns, setCheckIns] = useState([]);
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
        
        // Get user profile
        const userResponse = await axios.get(`${API_URL}/api/users/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setUser(userResponse.data);

        // If user has a managed space, get space details
        if (userResponse.data.managed_space) {
          try {
            const spaceResponse = await axios.get(`${API_URL}/api/spaces/${userResponse.data.managed_space}/`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setSpace(spaceResponse.data);
          } catch (spaceError) {
            console.log('Space details not available');
          }
        }

        // Try to get recent check-ins for this space
        try {
          const checkInsResponse = await axios.get(`${API_URL}/api/check-ins/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          // Filter check-ins for this partner's space
          const spaceCheckIns = checkInsResponse.data.filter(
            checkIn => checkIn.space === userResponse.data.managed_space
          );
          setCheckIns(spaceCheckIns);
        } catch (checkInError) {
          console.log('Check-ins endpoint not available');
        }

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

  // Calculate stats from available data
  const todayCheckIns = checkIns.filter(checkIn => {
    const today = new Date().toDateString();
    const checkInDate = new Date(checkIn.timestamp).toDateString();
    return today === checkInDate;
  }).length;

  const monthlyCheckIns = checkIns.filter(checkIn => {
    const thisMonth = new Date().getMonth();
    const checkInMonth = new Date(checkIn.timestamp).getMonth();
    return thisMonth === checkInMonth;
  }).length;

  const estimatedPayout = monthlyCheckIns * (space?.payout_per_checkin_ngn || 1500);

  return (
    <PartnerLayout activePage="dashboard">
      <Head>
        <title>Dashboard | Partner Portal</title>
      </Head>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome, {user?.username || 'Partner'}
          </h1>
          {space && (
            <p className="text-muted-foreground mt-2 flex items-center gap-2">
              <Building className="w-4 h-4" />
              Managing: {space.name}
            </p>
          )}
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
      
      {loading ? (
        <p className="mt-4 text-muted-foreground">Loading dashboard data...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8">
          <StatCard
            title="Today's Check-Ins"
            value={todayCheckIns}
            description="Members checked in today"
            icon={Users}
          />
          <StatCard
            title="Monthly Check-Ins"
            value={monthlyCheckIns}
            description="Total check-ins this month"
            icon={CalendarCheck}
          />
          <StatCard
            title="Est. Monthly Payout"
            value={`₦${estimatedPayout.toLocaleString()}`}
            description={`Based on ₦${(space?.payout_per_checkin_ngn || 1500).toLocaleString()} / check-in`}
            icon={CircleDollarSign}
          />
          <StatCard
            title="Space Status"
            value="Active"
            description="Your space is live and accepting members"
            icon={BarChart}
          />
        </div>
      )}

      {/* Recent Activity */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Check-Ins</CardTitle>
        </CardHeader>
        <CardContent>
          {checkIns.length > 0 ? (
            <div className="space-y-3">
              {checkIns.slice(0, 5).map((checkIn) => (
                <div key={checkIn.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{checkIn.user?.username || 'Member'}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(checkIn.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-sm text-green-600 font-medium">Checked In</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No recent check-ins. Check-ins will appear here when members visit your space.
            </p>
          )}
        </CardContent>
      </Card>
    </PartnerLayout>
  );
}
