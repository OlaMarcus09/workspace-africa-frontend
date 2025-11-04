import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import PartnerLayout from '../components/Layout';

export default function ScannerPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  
  // We need to fetch the partner's managed_space ID
  const [spaceId, setSpaceId] = useState(null);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // 1. Get the Partner's info (we need their space ID)
  useEffect(() => {
    const fetchPartnerInfo = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) Router.push('/login');
        
        const response = await axios.get(`${API_URL}/api/users/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.data.user_type !== 'PARTNER' || !response.data.managed_space) {
          alert('Error: You are not assigned to a space.');
          Router.push('/login');
        } else {
          setSpaceId(response.data.managed_space);
        }
      } catch (err) {
        Router.push('/login');
      }
    };
    fetchPartnerInfo();
  }, []);

  // 2. Handle the validation logic
  const handleValidate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setValidationResult(null);

    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await axios.post(`${API_URL}/api/check-in/validate/`, 
        {
          code: code,
          space_id: spaceId
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // SUCCESS!
      setValidationResult({
        status: 'VALID',
        user: response.data.user
      });
      setCode(''); // Clear the input

    } catch (err) {
      // FAILURE!
      setValidationResult({
        status: 'INVALID',
        message: err.response?.data?.error || 'Validation failed.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PartnerLayout activePage="scanner">
      <div className="flex justify-center">
        <div className="w-full max-w-xl">

          {/* --- The Validation Result Banner --- */}
          {validationResult && (
            <div className={`p-6 rounded-2xl shadow-lg mb-6 ${
              validationResult.status === 'VALID' 
                ? 'bg-green-100' 
                : 'bg-red-100'
            }`}>
              {validationResult.status === 'VALID' ? (
                <div>
                  <h2 className="text-2xl font-bold text-green-800">VALIDATED (✓)</h2>
                  <p className="mt-2 text-lg text-green-700">
                    Welcome, <span className="font-bold">{validationResult.user.username}</span>
                  </p>
                  <p className="text-sm text-green-600">
                    Plan: {validationResult.user.subscription?.plan?.name || 'N/A'}
                  </p>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-red-800">INVALID (X)</h2>
                  <p className="mt-2 text-lg text-red-700">
                    {validationResult.message}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* --- The Scanner Component --- */}
          <div className="p-8 bg-white shadow-lg rounded-2xl">
            {/* We'll add the QR Camera component here */}
            <div className="w-full h-64 bg-neutral-800 rounded-lg flex items-center justify-center">
              <p className="text-neutral-500">(Camera Scanner Placeholder)</p>
            </div>
            
            <p className="my-6 text-center text-neutral-500">
              or enter the member's 6-digit code
            </p>
            
            <form onSubmit={handleValidate}>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                placeholder="123456"
                className="w-full px-4 py-4 text-3xl font-bold tracking-widest text-center text-neutral-800 bg-neutral-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="submit"
                disabled={loading || !code || !spaceId}
                className="w-full px-4 py-4 mt-6 text-lg font-bold text-white transition-all bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-50"
              >
                {loading ? 'Validating...' : 'Validate Code'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
}
