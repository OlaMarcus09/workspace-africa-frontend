import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import PartnerLayout from '../../components/PartnerLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Settings, Building, DollarSign, Phone, Mail, User, Shield, HelpCircle, LogOut } from 'lucide-react';

export default function PartnerSettings() {
  const [user, setUser] = useState(null);
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('space');

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) { Router.push('/login'); return; }
        
        const userRes = await axios.get(`${API_URL}/api/users/me/`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        
        setUser(userRes.data);
        
        // For now, we'll create mock space data since we don't have a space details endpoint
        if (userRes.data.managed_space) {
          setSpace({
            name: userRes.data.managed_space.name || 'Your Space',
            address: 'No 32, Awolowo Avenue, Bodija, Ibadan',
            amenities: ['Wi-Fi', 'AC', 'Meeting Rooms', 'Coffee', 'Printing'],
            payout_rate: '₦1,500',
            capacity: 50,
            access_tier: 'PREMIUM'
          });
        }
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

  const MenuItem = ({ icon, title, description, action, color = "gray" }) => (
    <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-900/50 hover:bg-gray-800/50 transition-all duration-300 cursor-pointer group">
      <div className={`w-10 h-10 bg-${color}-500/20 rounded-lg flex items-center justify-center text-${color}-400 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-white text-sm">{title}</h3>
        <p className="text-gray-400 text-xs">{description}</p>
      </div>
    </div>
  );

  const handleLogout = () => {
    localStorage.clear();
    Router.push('/login');
  };

  if (loading) {
    return (
      <PartnerLayout activePage="settings" user={user}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading settings...</p>
          </div>
        </div>
      </PartnerLayout>
    );
  }

  return (
    <PartnerLayout activePage="settings" user={user}>
      <Head>
        <title>Settings | Workspace Africa</title>
      </Head>

      {/* --- Header --- */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400 text-sm">Manage your space and account settings</p>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-900/50 rounded-lg p-1 mt-4">
          {[
            { id: 'space', label: 'Space Info' },
            { id: 'account', label: 'Account' },
            { id: 'support', label: 'Support' }
          ].map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 ${
                activeTab === tab.id 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* --- Space Info Tab --- */}
      {activeTab === 'space' && space && (
        <div className="space-y-6">
          {/* Space Details */}
          <Card className="border-0 bg-gradient-to-br from-gray-900 to-black border border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center">
                <Building className="w-5 h-5 mr-2 text-blue-400" />
                Space Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm">Space Name</label>
                  <Input 
                    value={space.name} 
                    className="bg-gray-800 border-gray-700 text-white mt-1"
                    readOnly
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Address</label>
                  <Input 
                    value={space.address} 
                    className="bg-gray-800 border-gray-700 text-white mt-1"
                    readOnly
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Access Tier</label>
                  <div className="mt-1">
                    <Badge className={`${space.access_tier === 'PREMIUM' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'}`}>
                      {space.access_tier === 'PREMIUM' ? '⭐ Premium' : '✨ Standard'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payout Information */}
          <Card className="border-0 bg-gradient-to-br from-gray-900 to-black border border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                Payout Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Payout Rate</span>
                  <span className="text-white font-semibold">{space.payout_rate} per check-in</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Payout Schedule</span>
                  <span className="text-white">Monthly</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Next Payout</span>
                  <span className="text-white">Dec 5, 2024</span>
                </div>
              </div>
              <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white">
                Update Bank Details
              </Button>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card className="border-0 bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">Amenities</CardTitle>
              <CardDescription className="text-gray-400">
                Features available at your space
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {space.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 rounded bg-gray-800/50">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-white text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* --- Account Tab --- */}
      {activeTab === 'account' && (
        <div className="space-y-4">
          <MenuItem
            icon={<User className="w-5 h-5" />}
            title="Personal Information"
            description="Update your profile details"
            color="blue"
          />
          <MenuItem
            icon={<Shield className="w-5 h-5" />}
            title="Security & Privacy"
            description="Manage password and security settings"
            color="purple"
          />
          <MenuItem
            icon={<Settings className="w-5 h-5" />}
            title="Preferences"
            description="Customize your partner experience"
            color="green"
          />
          <MenuItem
            icon={<Phone className="w-5 h-5" />}
            title="Contact Information"
            description="Update phone and contact details"
            color="yellow"
          />
        </div>
      )}

      {/* --- Support Tab --- */}
      {activeTab === 'support' && (
        <div className="space-y-4">
          <MenuItem
            icon={<HelpCircle className="w-5 h-5" />}
            title="Help & Support"
            description="Get help and contact support"
            color="blue"
          />
          <MenuItem
            icon={<Mail className="w-5 h-5" />}
            title="Contact Support"
            description="Reach out to our team"
            color="purple"
          />
          <Card className="border-0 bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <h4 className="font-semibold text-white text-sm mb-2">Partner Resources</h4>
              <ul className="text-gray-400 text-xs space-y-1">
                <li>• Partner Guidelines</li>
                <li>• Payment Schedule</li>
                <li>• Space Requirements</li>
                <li>• Marketing Materials</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {/* --- Logout Button --- */}
      <div className="mt-8 pt-6 border-t border-gray-800">
        <Button 
          variant="outline" 
          className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </div>
    </PartnerLayout>
  );
}
