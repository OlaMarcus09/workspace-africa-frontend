import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import PartnerLayout from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Download, Filter, Search } from 'lucide-react';

export default function ReportsPage() {
  const [checkIns, setCheckIns] = useState([]);
  const [filteredCheckIns, setFilteredCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) { Router.push('/'); return; }

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        
        // Get user profile to get space ID
        const userResponse = await axios.get(`${API_URL}/api/users/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Simulate check-in data - in real app, fetch from /api/partner/reports/
        const mockCheckIns = [
          { id: 1, user: { username: 'John Doe', email: 'john@example.com' }, timestamp: '2025-11-13T10:30:00Z', plan: 'Flex Pro' },
          { id: 2, user: { username: 'Jane Smith', email: 'jane@example.com' }, timestamp: '2025-11-13T14:15:00Z', plan: 'Flex Basic' },
          { id: 3, user: { username: 'Mike Johnson', email: 'mike@example.com' }, timestamp: '2025-11-12T09:45:00Z', plan: 'Flex Pro' },
          { id: 4, user: { username: 'Sarah Wilson', email: 'sarah@example.com' }, timestamp: '2025-11-12T16:20:00Z', plan: 'Flex Unlimited' },
          { id: 5, user: { username: 'David Brown', email: 'david@example.com' }, timestamp: '2025-11-11T11:00:00Z', plan: 'Flex Pro' },
        ];

        setCheckIns(mockCheckIns);
        setFilteredCheckIns(mockCheckIns);

      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.clear();
          Router.push('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    // Filter check-ins based on search term
    const filtered = checkIns.filter(checkIn => 
      checkIn.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checkIn.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCheckIns(filtered);
  }, [searchTerm, checkIns]);

  const handleExport = () => {
    // Simple CSV export
    const headers = ['Date', 'Time', 'Member', 'Email', 'Plan'];
    const csvData = filteredCheckIns.map(checkIn => [
      new Date(checkIn.timestamp).toLocaleDateString(),
      new Date(checkIn.timestamp).toLocaleTimeString(),
      checkIn.user.username,
      checkIn.user.email,
      checkIn.plan
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `checkin-reports-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const getPlanBadgeColor = (plan) => {
    const colors = {
      'Flex Basic': 'bg-blue-100 text-blue-800',
      'Flex Pro': 'bg-purple-100 text-purple-800',
      'Flex Unlimited': 'bg-green-100 text-green-800'
    };
    return colors[plan] || 'bg-gray-100 text-gray-800';
  };

  return (
    <PartnerLayout activePage="reports">
      <Head>
        <title>Reports | Partner Portal</title>
      </Head>
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          Check-In Reports
        </h1>
        <Button onClick={handleExport} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4 mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Check-Ins</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredCheckIns.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {checkIns.filter(c => new Date(c.timestamp).getMonth() === new Date().getMonth()).length}
            </div>
            <p className="text-xs text-muted-foreground">Current month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {checkIns.filter(c => new Date(c.timestamp).toDateString() === new Date().toDateString()).length}
            </div>
            <p className="text-xs text-muted-foreground">Today's check-ins</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Members</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(checkIns.map(c => c.user.email)).size}
            </div>
            <p className="text-xs text-muted-foreground">Distinct members</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Check-In Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by member name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-32"
              />
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-32"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan="5" className="text-center py-8">
                    Loading reports...
                  </TableCell>
                </TableRow>
              ) : filteredCheckIns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="5" className="text-center py-8 text-muted-foreground">
                    No check-ins found for the selected criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCheckIns.map((checkIn) => (
                  <TableRow key={checkIn.id}>
                    <TableCell className="font-medium">
                      {formatDate(checkIn.timestamp)}
                    </TableCell>
                    <TableCell>{checkIn.user.username}</TableCell>
                    <TableCell>{checkIn.user.email}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPlanBadgeColor(checkIn.plan)}`}>
                        {checkIn.plan}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Validated
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PartnerLayout>
  );
}
