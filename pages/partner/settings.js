import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import PartnerLayout from '../../components/Layout'; // Adjusted path based on your snippet
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, CreditCard, User, MapPin } from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) { Router.push('/'); return; }

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        
        const userResponse = await axios.get(`${API_URL}/api/users/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setUser(userResponse.data);
        setFormData({
          email: userResponse.data.email || '',
          phone: userResponse.data.phone || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });

        // Set space data if it exists in the user profile payload
        if (userResponse.data.managed_space_details) {
            setSpace(userResponse.data.managed_space_details);
        } else {
            setSpace({ name: userResponse.data.username, address: "Update Address..." });
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

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      await axios.patch(`${API_URL}/api/users/me/`, {
        email: formData.email,
        phone: formData.phone
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Profile updated successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update profile');
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

      await axios.post(`${API_URL}/api/users/change-password/`, {
        old_password: formData.currentPassword,
        new_password: formData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Password changed successfully!');
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to change password');
    }
  };

  if (loading) {
    return (
      <PartnerLayout activePage="config">
        <Head><title>Settings | Partner Portal</title></Head>
        <p className="text-[var(--text-muted)] p-8 font-mono text-xs">SYNCING NODE DATA...</p>
      </PartnerLayout>
    );
  }

  return (
    <PartnerLayout activePage="config">
      <Head>
        <title>Settings | Partner Portal</title>
      </Head>
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-main)] mb-2">System Configuration</h1>
        <p className="text-[var(--text-muted)] font-mono text-xs">MANAGE PROFILE AND NODE DETAILS</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-2">
            <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3 text-sm font-mono transition-colors ${
                activeTab === 'profile'
                ? 'bg-[var(--bg-input)] text-[var(--text-main)] border-l-2 border-[var(--primary)]'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)]'
            }`}
            >
            <User className="w-4 h-4 inline mr-3" /> Profile
            </button>

            <button
            onClick={() => setActiveTab('space')}
            className={`w-full text-left px-4 py-3 text-sm font-mono transition-colors ${
                activeTab === 'space'
                ? 'bg-[var(--bg-input)] text-[var(--text-main)] border-l-2 border-[var(--primary)]'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)]'
            }`}
            >
            <MapPin className="w-4 h-4 inline mr-3" /> Node Config
            </button>
            
            <button
            onClick={() => setActiveTab('security')}
            className={`w-full text-left px-4 py-3 text-sm font-mono transition-colors ${
                activeTab === 'security'
                ? 'bg-[var(--bg-input)] text-[var(--text-main)] border-l-2 border-[var(--primary)]'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)]'
            }`}
            >
            <Shield className="w-4 h-4 inline mr-3" /> Security
            </button>
            
            <button
            onClick={() => setActiveTab('payout')}
            className={`w-full text-left px-4 py-3 text-sm font-mono transition-colors ${
                activeTab === 'payout'
                ? 'bg-[var(--bg-input)] text-[var(--text-main)] border-l-2 border-[var(--primary)]'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)]'
            }`}
            >
            <CreditCard className="w-4 h-4 inline mr-3" /> Payouts
            </button>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-8 rounded-sm shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-[var(--text-main)] border-b border-[var(--border-color)] pb-4">Manager Profile</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-main)] px-4 py-2 text-sm focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+234 XXX XXX XXXX"
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-main)] px-4 py-2 text-sm focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
              </div>
              <Button onClick={handleSaveProfile} className="bg-[var(--primary)] text-white hover:bg-blue-700">
                Update Profile
              </Button>
            </div>
          )}

          {/* SPACE CONFIGURATION TAB (From your code!) */}
          {activeTab === 'space' && (
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-8 rounded-sm shadow-sm space-y-6">
               <h2 className="text-lg font-bold text-[var(--text-main)] border-b border-[var(--border-color)] pb-4">Infrastructure Details</h2>
                <div>
                    <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">Space Name</label>
                    <input type="text" value={space?.name || ''} readOnly className="w-full px-4 py-2 text-sm opacity-70 cursor-not-allowed bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-main)]" />
                </div>
                
                <div>
                    <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">Address</label>
                    <input type="text" value={space?.address || ''} readOnly className="w-full px-4 py-2 text-sm opacity-70 cursor-not-allowed bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-main)]" />
                </div>

                <div className="pt-6 mt-6 border-t border-[var(--border-color)]">
                    <p className="text-xs text-[var(--text-muted)] font-mono">To update critical infrastructure details, please contact Workspace Africa Admin.</p>
                </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-8 rounded-sm shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-[var(--text-main)] border-b border-[var(--border-color)] pb-4">Access Credentials</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">Current Password</label>
                  <input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-main)] px-4 py-2 text-sm focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">New Password</label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-main)] px-4 py-2 text-sm focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-main)] px-4 py-2 text-sm focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
                <Button onClick={handleChangePassword} className="bg-[var(--primary)] text-white hover:bg-blue-700 w-full mt-4">
                  Rotate Password
                </Button>
              </div>
            </div>
          )}

          {/* PAYOUT TAB */}
          {activeTab === 'payout' && (
             <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-8 rounded-sm shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-[var(--text-main)] border-b border-[var(--border-color)] pb-4">Settlement Information</h2>
                
                <div className="p-4 border border-[var(--border-color)] bg-[var(--bg-input)] rounded-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-[var(--text-main)]">Bank Transfer</p>
                      <p className="text-sm font-mono text-[var(--text-muted)] mt-1">Acct: ••••1234 | GTBank</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 text-sm font-mono mt-6">
                  <div className="flex justify-between border-b border-[var(--border-color)] pb-2">
                    <span className="text-[var(--text-muted)] uppercase text-[10px]">Settlement Cycle</span>
                    <span className="text-[var(--text-main)]">Monthly</span>
                  </div>
                  <div className="flex justify-between border-b border-[var(--border-color)] pb-2">
                    <span className="text-[var(--text-muted)] uppercase text-[10px]">Processing Fee</span>
                    <span className="text-[var(--text-main)]">0.00 NGN</span>
                  </div>
                </div>
                
                <p className="text-xs text-[var(--text-muted)] mt-4 font-mono">
                  Contact Workspace Africa Admin to update your settlement account details.
                </p>
            </div>
          )}

        </div>
      </div>
    </PartnerLayout>
  );
}