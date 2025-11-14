import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import PartnerLayout from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Shield, CreditCard, User } from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    checkinNotifications: true,
    weeklyReports: false,
    payoutAlerts: true
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) { Router.push('/'); return; }

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        
        const userResponse = await axios.get(`${API_URL}/api/users/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setUser(userResponse.data);
        setFormData({
          email: userResponse.data.email,
          phone: userResponse.data.phone || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });

      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.clear();
          Router.push('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      // In real app: await axios.patch(`${API_URL}/api/users/me/`, formData)
      console.log('Updating profile:', formData);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      // In real app: await axios.post(`${API_URL}/api/auth/password/change/`, formData)
      console.log('Changing password');
      alert('Password changed successfully!');
      
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      alert('Failed to change password');
    }
  };

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (loading) {
    return (
      <PartnerLayout activePage="settings">
        <Head>
          <title>Settings | Partner Portal</title>
        </Head>
        <p className="text-muted-foreground">Loading settings...</p>
      </PartnerLayout>
    );
  }

  return (
    <PartnerLayout activePage="settings">
      <Head>
        <title>Settings | Partner Portal</title>
      </Head>
      
      <h1 className="text-3xl font-bold text-foreground">
        Settings
      </h1>

      <div className="grid gap-8 mt-8 lg:grid-cols-4">
        {/* Sidebar Navigation */}
        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <User className="w-4 h-4 inline mr-2" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'notifications'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <Bell className="w-4 h-4 inline mr-2" />
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'security'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <Shield className="w-4 h-4 inline mr-2" />
                Security
              </button>
              <button
                onClick={() => setActiveTab('payout')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'payout'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <CreditCard className="w-4 h-4 inline mr-2" />
                Payout Info
              </button>
            </nav>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+234 XXX XXX XXXX"
                    />
                  </div>
                </div>
                <Button onClick={handleSaveProfile}>
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailAlerts" className="text-base">Email Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive important updates via email</p>
                  </div>
                  <Switch
                    id="emailAlerts"
                    checked={notifications.emailAlerts}
                    onCheckedChange={() => handleNotificationToggle('emailAlerts')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="checkinNotifications" className="text-base">Check-in Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get notified when members check in</p>
                  </div>
                  <Switch
                    id="checkinNotifications"
                    checked={notifications.checkinNotifications}
                    onCheckedChange={() => handleNotificationToggle('checkinNotifications')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weeklyReports" className="text-base">Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive weekly performance reports</p>
                  </div>
                  <Switch
                    id="weeklyReports"
                    checked={notifications.weeklyReports}
                    onCheckedChange={() => handleNotificationToggle('weeklyReports')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="payoutAlerts" className="text-base">Payout Alerts</Label>
                    <p className="text-sm text-muted-foreground">Notifications about payments and payouts</p>
                  </div>
                  <Switch
                    id="payoutAlerts"
                    checked={notifications.payoutAlerts}
                    onCheckedChange={() => handleNotificationToggle('payoutAlerts')}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                </div>
                <Button onClick={handleChangePassword}>
                  Change Password
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Payout Information */}
          {activeTab === 'payout' && (
            <Card>
              <CardHeader>
                <CardTitle>Payout Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Bank Transfer</p>
                      <p className="text-sm text-muted-foreground">Account ending with ••••1234</p>
                      <p className="text-sm text-muted-foreground">Guaranty Trust Bank</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Update
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payout Schedule:</span>
                    <span>5th of each month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next Payout:</span>
                    <span>December 5, 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Minimum Payout:</span>
                    <span>₦5,000</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Contact support to update your bank account information or for any payout-related questions.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PartnerLayout>
  );
}
