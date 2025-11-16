import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import PartnerLayout from '../../components/PartnerLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar, Download, Filter, Search, Users, TrendingUp, BarChart3, Sparkles } from 'lucide-react';

export default function PartnerReports() {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) { Router.push('/login'); return; }
        
        const [userRes, reportsRes] = await Promise.all([
          axios.get(`${API_URL}/api/users/me/`, { 
            headers: { Authorization: `Bearer ${token}` } 
          }),
          axios.get(`${API_URL}/api/partner/reports/`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setUser(userRes.data);
        setReports(reportsRes.data);
      } catch (err) {
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

  const StatCard = ({ title, value, subtitle, icon, color = "purple" }) => (
    <Card className="border-0 bg-gradient-to-br from-gray-900 to-black border border-gray-800">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">{title}</p>
            <p className="text-white font-bold text-xl">{value}</p>
            {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
          </div>
          <div className={`w-10 h-10 bg-${color}-500/20 rounded-lg flex items-center justify-center text-${color}-400`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Calculate stats from reports
  const totalCheckins = reports.length;
  const uniqueMembers = new Set(reports.map(report => report.user)).size;
  const todayCheckins = reports.filter(report => {
    const reportDate = new Date(report.timestamp).toDateString();
    const today = new Date().toDateString();
    return reportDate === today;
  }).length;

  if (loading) {
    return (
      <PartnerLayout activePage="reports" user={user}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading reports...</p>
          </div>
        </div>
      </PartnerLayout>
    );
  }

  return (
    <PartnerLayout activePage="reports" user={user}>
      <Head>
        <title>Reports | Workspace Africa</title>
      </Head>

      {/* --- Header --- */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-white">Check-in Reports</h1>
            <p className="text-gray-400 text-sm mt-1">Track member activity and analytics</p>
          </div>
          <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Time Range Selector */}
        <div className="flex space-x-1 bg-gray-900/50 rounded-lg p-1 mb-4">
          {['today', 'week', 'month', 'quarter'].map(range => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeRange(range)}
              className={`flex-1 capitalize ${
                timeRange === range 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* --- Overview Stats --- */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard
          title="Total Check-ins"
          value={totalCheckins}
          subtitle="All time"
          icon={<BarChart3 className="w-5 h-5" />}
          color="purple"
        />
        <StatCard
          title="Unique Members"
          value={uniqueMembers}
          subtitle="Total visitors"
          icon={<Users className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          title="Today"
          value={todayCheckins}
          subtitle="Check-ins today"
          icon={<TrendingUp className="w-5 h-5" />}
          color="green"
        />
      </div>

      {/* --- Reports Table --- */}
      <Card className="border-0 bg-gradient-to-br from-gray-900 to-black border border-gray-800">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-400" />
              Recent Check-ins
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search..."
                  className="pl-10 h-8 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 text-sm"
                />
              </div>
              <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reports.length > 0 ? (
            <div className="space-y-3">
              {reports.slice(0, 10).map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-medium">
                        {typeof report.user === 'object' ? report.user.username : 'Member'}
                      </h4>
                      <p className="text-gray-400 text-xs">
                        {new Date(report.timestamp).toLocaleDateString()} • {new Date(report.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                    Checked In
                  </Badge>
                </div>
              ))}
              
              {reports.length > 10 && (
                <div className="text-center pt-2">
                  <Button variant="ghost" size="sm" className="text-purple-300 hover:text-purple-200 hover:bg-purple-500/10">
                    Load More
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-3 bg-gray-800 rounded-full flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="font-bold text-white text-sm mb-1">No Reports Yet</h3>
              <p className="text-gray-400 text-xs mb-4">
                Check-in reports will appear here once members start visiting
              </p>
              <Button 
                onClick={() => Router.push('/partner/scan')}
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm"
              >
                Start Scanning Members
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* --- Analytics Summary --- */}
      {reports.length > 0 && (
        <Card className="border-0 bg-gray-900/50 border-gray-800 mt-6">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Sparkles className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-white text-sm mb-2">Analytics Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-gray-400">Peak Hours</p>
                    <p className="text-white">9AM - 11AM</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Avg Daily</p>
                    <p className="text-white">{Math.round(totalCheckins / 30)} check-ins</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Member Retention</p>
                    <p className="text-white">85%</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Revenue</p>
                    <p className="text-white">₦{totalCheckins * 1500}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </PartnerLayout>
  );
}
