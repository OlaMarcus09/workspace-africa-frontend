import React, { useState } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let access = null;

    try {
      // Step 1: Call the /token/ endpoint (Login)
      const response = await axios.post(`${API_URL}/api/auth/token/`, {
        email,
        password,
      });
      
      access = response.data.access; // Get the token
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', response.data.refresh);

    } catch (err) {
      // This block catches "Invalid email or password"
      console.error("Login error:", err);
      setLoading(false);
      setError('Invalid email or password. Please try again.');
      return; // Stop here
    }

    try {
      // Step 2: Check if the user is a Partner
      // We use the 'access' token we just got
      const profileResponse = await axios.get(`${API_URL}/api/users/me/`, {
        headers: { Authorization: `Bearer ${access}` }
      });

      if (profileResponse.data.user_type === 'PARTNER') {
        Router.push('/dashboard');
      } else {
        localStorage.clear();
        setError('You have a valid account, but you are not a Partner.');
      }
    } catch (err) {
      // This block catches "Cold Start" or "Profile" errors
      console.error("Profile check error:", err);
      setError('Could not verify your profile. The server may be waking up. Please try again in 30 seconds.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Head>
        <title>Partner Portal | Workspace Africa</title>
      </Head>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <img 
            src="https://res.cloudinary.com/dmqjicpcc/image/upload/v1760286253/WorkSpaceAfrica_bgyjhe.png" 
            alt="Workspace Africa Logo"
            className="w-20 h-20 mx-auto"
          />
          <CardTitle className="text-2xl pt-4">Partner Portal</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="ola@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            {error && (
              <p className="text-xs text-center text-red-600">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
