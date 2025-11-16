import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import PartnerLayout from '../../components/PartnerLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { QrCode, Key, CheckCircle, XCircle, User, Clock, Sparkles, Camera } from 'lucide-react';

export default function PartnerScan() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('manual');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) { Router.push('/login'); return; }
        
        const userRes = await axios.get(`${API_URL}/api/users/me/`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        
        setUser(userRes.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.clear();
          Router.push('/login');
        }
      }
    };
    fetchUser();
  }, []);

  const handleValidate = async () => {
    if (!code || code.length !== 6) {
      setValidationResult({
        status: 'error',
        message: 'Please enter a valid 6-digit code'
      });
      return;
    }

    setLoading(true);
    setValidationResult(null);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(`${API_URL}/api/check-in/validate/`, {
        code: code,
        space_id: user.managed_space.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setValidationResult({
        status: 'success',
        data: response.data
      });
      setCode(''); // Clear input after successful validation
    } catch (error) {
      setValidationResult({
        status: 'error',
        message: error.response?.data?.error || 'Validation failed'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScanAnother = () => {
    setValidationResult(null);
    setCode('');
  };

  return (
    <PartnerLayout activePage="scan" user={user}>
      <Head>
        <title>Scan Member | Workspace Africa</title>
      </Head>

      {/* --- Header --- */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Validate Member</h1>
        <p className="text-gray-400 text-sm">Scan or enter member check-in codes</p>
      </div>

      {/* --- Tab Navigation --- */}
      <div className="flex space-x-1 bg-gray-900/50 rounded-lg p-1 mb-6">
        <Button
          variant={activeTab === 'camera' ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab('camera')}
          className={`flex-1 ${activeTab === 'camera' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          <Camera className="w-4 h-4 mr-2" />
          Camera Scan
        </Button>
        <Button
          variant={activeTab === 'manual' ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab('manual')}
          className={`flex-1 ${activeTab === 'manual' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          <Key className="w-4 h-4 mr-2" />
          Manual Entry
        </Button>
      </div>

      {/* --- Camera Scan Tab --- */}
      {activeTab === 'camera' && (
        <Card className="border-0 bg-gradient-to-br from-gray-900 to-black border border-gray-800 mb-6">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-purple-500/20 rounded-full flex items-center justify-center">
              <Camera className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="font-bold text-white text-lg mb-2">Camera Scanner</h3>
            <p className="text-gray-400 text-sm mb-6">
              Point your camera at the member's QR code to validate
            </p>
            <Button 
              variant="outline" 
              className="border-purple-500 text-purple-300 hover:bg-purple-500/10"
              onClick={() => setActiveTab('manual')}
            >
              <Key className="w-4 h-4 mr-2" />
              Use Manual Entry Instead
            </Button>
            <p className="text-gray-500 text-xs mt-4">
              QR scanner coming in next update
            </p>
          </CardContent>
        </Card>
      )}

      {/* --- Manual Entry Tab --- */}
      {activeTab === 'manual' && !validationResult && (
        <Card className="border-0 bg-gradient-to-br from-gray-900 to-black border border-gray-800 mb-6">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center">
              <Key className="w-5 h-5 mr-2 text-blue-400" />
              Enter Check-in Code
            </CardTitle>
            <CardDescription className="text-gray-400">
              Ask the member for their 6-digit check-in code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-2xl font-mono h-16 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                  maxLength={6}
                />
              </div>
              
              <Button 
                onClick={handleValidate}
                disabled={loading || code.length !== 6}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-lg"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Validate Code
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- Validation Result --- */}
      {validationResult && (
        <Card className={`border-0 ${
          validationResult.status === 'success' 
            ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30' 
            : 'bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/30'
        }`}>
          <CardContent className="p-6 text-center">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              validationResult.status === 'success' 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {validationResult.status === 'success' ? (
                <CheckCircle className="w-8 h-8" />
              ) : (
                <XCircle className="w-8 h-8" />
              )}
            </div>
            
            <h3 className={`font-bold text-lg mb-2 ${
              validationResult.status === 'success' ? 'text-green-300' : 'text-red-300'
            }`}>
              {validationResult.status === 'success' ? 'VALID CHECK-IN' : 'INVALID CODE'}
            </h3>
            
            {validationResult.status === 'success' ? (
              <div className="space-y-3">
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <User className="w-5 h-5 text-green-400" />
                    <span className="text-white font-semibold">
                      {validationResult.data.user.username}
                    </span>
                  </div>
                  <div className="text-green-300 text-sm">
                    ✓ Successfully checked in
                  </div>
                </div>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  Active Member
                </Badge>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-red-300 text-sm">
                  {validationResult.message}
                </p>
                <div className="flex items-center justify-center text-red-400 text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  Please ask member to generate a new code
                </div>
              </div>
            )}
            
            <Button 
              onClick={handleScanAnother}
              className={`w-full mt-4 ${
                validationResult.status === 'success' 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              <QrCode className="w-4 h-4 mr-2" />
              Scan Another Code
            </Button>
          </CardContent>
        </Card>
      )}

      {/* --- Quick Tips --- */}
      <Card className="border-0 bg-gray-900/50 border-gray-800 mt-6">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-white text-sm mb-2">Quick Tips</h4>
              <ul className="text-gray-400 text-xs space-y-1">
                <li>• Codes expire after 5 minutes</li>
                <li>• Each code can only be used once</li>
                <li>• Members must have active subscription</li>
                <li>• Premium spaces require premium plans</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </PartnerLayout>
  );
}
