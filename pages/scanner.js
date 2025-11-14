import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import PartnerLayout from '../components/Layout';
// --- NEW IMPORT ---
import { QrReader } from 'react-qr-reader';

// Import our shadcn components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ScannerPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [spaceId, setSpaceId] = useState(null);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  // 1. Get the Partner's info (we need their space ID)
  useEffect(() => {
    const fetchPartnerInfo = async () => {
      try {
        if (!token) Router.push('/');
        
        const response = await axios.get(`${API_URL}/api/users/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.data.user_type !== 'PARTNER' || !response.data.managed_space) {
          alert('Error: You are not assigned to a space.');
          Router.push('/');
        } else {
          setSpaceId(response.data.managed_space);
        }
      } catch (err) {
        Router.push('/');
      }
    };
    fetchPartnerInfo();
  }, [API_URL, token]);

  // 2. Main validation function (used by both scanner and form)
  const validateCode = async (scannedCode) => {
    setLoading(true);
    setValidationResult(null);

    try {
      const response = await axios.post(`${API_URL}/api/check-in/validate/`, 
        { code: scannedCode, space_id: spaceId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setValidationResult({ status: 'VALID', user: response.data.user });
      setCode(''); // Clear the input

    } catch (err) {
      setValidationResult({
        status: 'INVALID',
        message: err.response?.data?.error || 'Validation failed.'
      });
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle manual form submission
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (code.length === 6) {
      validateCode(code);
    }
  };

  // 4. Handle QR scan result
  const handleScanResult = (result, error) => {
    if (!!result) {
      const scannedCode = result?.getText();
      if (scannedCode && !loading) {
        setCode(scannedCode);
        validateCode(scannedCode);
      }
    }
    if (!!error) {
      // console.info(error);
    }
  };

  return (
    <PartnerLayout activePage="scanner">
      <Head>
        <title>Scan Member | Partner Portal</title>
      </Head>
      
      <div className="flex justify-center">
        <div className="w-full max-w-xl">

          {/* --- Validation Result Banner --- */}
          {validationResult && (
            <Card className={`mb-6 ${
              validationResult.status === 'VALID' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  {validationResult.status === 'VALID' ? (
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  ) : (
                    <AlertCircle className="w-10 h-10 text-red-600" />
                  )}
                  <div>
                    <CardTitle className={
                      validationResult.status === 'VALID' 
                        ? 'text-green-800' 
                        : 'text-red-800'
                    }>
                      {validationResult.status === 'VALID' ? 'VALIDATED' : 'INVALID'}
                    </CardTitle>
                    <CardDescription className={
                      validationResult.status === 'VALID' 
                        ? 'text-green-700' 
                        : 'text-red-700'
                    }>
                      {validationResult.status === 'VALID' ? 'Welcome this member!' : validationResult.message}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              {validationResult.status === 'VALID' && (
                <CardContent className="flex items-center space-x-4 pt-4 border-t border-green-200">
                  <Avatar>
                    <AvatarImage src={validationResult.user.photo_url} />
                    <AvatarFallback>
                      {validationResult.user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-green-900">{validationResult.user.username}</p>
                    <p className="text-sm text-green-700">
                      Plan: {validationResult.user.subscription?.plan?.name || 'N/A'}
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* --- The Scanner Component --- */}
          <Card>
            <CardHeader>
              <CardTitle>Validate Member Check-In</CardTitle>
            </CardHeader>
            <CardContent>
              {/* --- NEW LIVE CAMERA SCANNER --- */}
              <div className="w-full h-64 bg-muted rounded-lg overflow-hidden flex items-center justify-center mb-6">
                <QrReader
                  onResult={handleScanResult}
                  constraints={{ facingMode: 'environment' }}
                  containerStyle={{ width: '100%', height: '100%' }}
                  videoContainerStyle={{ width: '100%', height: '100%', paddingTop: '0' }}
                  videoStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              
              <p className="my-4 text-center text-muted-foreground">
                or enter the member's 6-digit code
              </p>
              
              <form onSubmit={handleManualSubmit}>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="code" className="text-center">Member Code</Label>
                  <Input
                    id="code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={6}
                    placeholder="123 456"
                    className="w-full text-3xl font-bold tracking-widest text-center h-14"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading || code.length < 6 || !spaceId}
                  className="w-full h-12 mt-6 text-lg"
                >
                  {loading ? 'Validating...' : 'Validate Code'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PartnerLayout>
  );
}
