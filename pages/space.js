import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import PartnerLayout from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building, MapPin, Wifi, Car, Coffee, Snowflake } from 'lucide-react';

export default function SpaceManagementPage() {
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchSpaceData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) { Router.push('/'); return; }

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        
        // Get user profile to get space ID
        const userResponse = await axios.get(`${API_URL}/api/users/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userResponse.data.managed_space) {
          // Simulate space data - in real app, fetch from /api/spaces/{id}/
          const mockSpace = {
            id: userResponse.data.managed_space,
            name: 'Tech Hub Lagos',
            address: '123 Innovation Drive, Victoria Island, Lagos',
            amenities: ['Wi-Fi', 'AC', 'Parking', 'Coffee', 'Printing'],
            payout_per_checkin_ngn: 1500,
            operating_hours: {
              weekday: '08:00-18:00',
              weekend: '09:00-14:00'
            },
            capacity: 50,
            access_tier: 'PREMIUM'
          };
          
          setSpace(mockSpace);
          setFormData(mockSpace);
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

    fetchSpaceData();
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      // In real app: await axios.patch(`${API_URL}/api/spaces/${space.id}/`, formData)
      console.log('Saving space data:', formData);
      
      setSpace(formData);
      setEditing(false);
      alert('Space information updated successfully!');
    } catch (error) {
      alert('Failed to update space information');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getAmenityIcon = (amenity) => {
    const icons = {
      'Wi-Fi': Wifi,
      'Parking': Car,
      'Coffee': Coffee,
      'AC': Snowflake
    };
    return icons[amenity] || Building;
  };

  if (loading) {
    return (
      <PartnerLayout activePage="space">
        <Head>
          <title>My Space | Partner Portal</title>
        </Head>
        <p className="text-muted-foreground">Loading space information...</p>
      </PartnerLayout>
    );
  }

  if (!space) {
    return (
      <PartnerLayout activePage="space">
        <Head>
          <title>My Space | Partner Portal</title>
        </Head>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center py-8">
              You are not currently managing any space.
            </p>
          </CardContent>
        </Card>
      </PartnerLayout>
    );
  }

  return (
    <PartnerLayout activePage="space">
      <Head>
        <title>My Space | Partner Portal</title>
      </Head>
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          My Space
        </h1>
        {!editing ? (
          <Button onClick={() => setEditing(true)}>
            Edit Space Info
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setEditing(false); setFormData(space); }}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-8 mt-8 lg:grid-cols-2">
        {/* Space Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Space Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Space Name</Label>
              <Input
                id="name"
                value={editing ? formData.name : space.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!editing}
              />
            </div>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={editing ? formData.address : space.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={!editing}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="payout">Payout per Check-in (₦)</Label>
                <Input
                  id="payout"
                  type="number"
                  value={editing ? formData.payout_per_checkin_ngn : space.payout_per_checkin_ngn}
                  onChange={(e) => handleInputChange('payout_per_checkin_ngn', parseInt(e.target.value))}
                  disabled={!editing}
                />
              </div>
              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={editing ? formData.capacity : space.capacity}
                  onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
                  disabled={!editing}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weekday">Weekday Hours</Label>
                <Input
                  id="weekday"
                  value={editing ? formData.operating_hours?.weekday : space.operating_hours?.weekday}
                  onChange={(e) => handleInputChange('operating_hours', { ...formData.operating_hours, weekday: e.target.value })}
                  disabled={!editing}
                  placeholder="08:00-18:00"
                />
              </div>
              <div>
                <Label htmlFor="weekend">Weekend Hours</Label>
                <Input
                  id="weekend"
                  value={editing ? formData.operating_hours?.weekend : space.operating_hours?.weekend}
                  onChange={(e) => handleInputChange('operating_hours', { ...formData.operating_hours, weekend: e.target.value })}
                  disabled={!editing}
                  placeholder="09:00-14:00"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amenities & Status */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {space.amenities.map((amenity) => {
                  const IconComponent = getAmenityIcon(amenity);
                  return (
                    <div key={amenity} className="flex items-center gap-2 p-2 border rounded-lg">
                      <IconComponent className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Contact support to modify amenities list.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Space Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Access Tier:</span>
                <span className={`font-medium ${
                  space.access_tier === 'PREMIUM' ? 'text-purple-600' : 'text-blue-600'
                }`}>
                  {space.access_tier}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payout Schedule:</span>
                <span className="font-medium">5th of each month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Payout:</span>
                <span className="font-medium">Nov 5, 2025</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PartnerLayout>
  );
}
