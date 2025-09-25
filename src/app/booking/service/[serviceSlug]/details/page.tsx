'use client';

import { BookingLayout } from '@/components/booking/BookingLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBooking } from '@/providers/booking-provider';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, ChevronLeft, MapPin, Home, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { generateServiceSlug } from '@/lib/pricing';

interface Region {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
}

interface Suburb {
  id: string;
  name: string;
  region_id: string;
  is_active: boolean;
  regions: {
    id: string;
    name: string;
    description: string | null;
  };
}

export default function ServiceDetailsPage() {
  const { bookingState, updateBookingState } = useBooking();
  const router = useRouter();
  const [selectedRegionId, setSelectedRegionId] = useState<string>('');
  const [address, setAddress] = useState<string>(bookingState.address || '');

  // Fetch regions
  const { data: regions, isLoading: regionsLoading } = useQuery({
    queryKey: ['regions'],
    queryFn: async () => {
      const response = await fetch('/api/regions');
      if (!response.ok) throw new Error('Failed to fetch regions');
      return response.json() as Promise<Region[]>;
    },
  });

  // Fetch suburbs based on selected region
  const { data: suburbs, isLoading: suburbsLoading } = useQuery({
    queryKey: ['suburbs', selectedRegionId],
    queryFn: async () => {
      const url = selectedRegionId 
        ? `/api/suburbs?region_id=${selectedRegionId}`
        : '/api/suburbs';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch suburbs');
      return response.json() as Promise<Suburb[]>;
    },
    enabled: !!regions, // Only fetch when regions are loaded
  });

  const handleBedroomsChange = (bedrooms: number) => {
    updateBookingState({ bedrooms });
  };

  const handleBathroomsChange = (bathrooms: number) => {
    updateBookingState({ bathrooms });
  };

  const handleRegionChange = (regionId: string) => {
    setSelectedRegionId(regionId);
    // Clear suburb selection when region changes
    updateBookingState({ suburb: undefined });
  };

  const handleSuburbChange = (suburbId: string) => {
    const suburb = suburbs?.find(s => s.id === suburbId);
    if (suburb) {
      updateBookingState({ 
        suburb: {
          id: suburb.id,
          name: suburb.name,
          region: {
            id: suburb.regions.id,
            name: suburb.regions.name,
          }
        }
      });
    }
  };

  const handleAddressChange = (value: string) => {
    setAddress(value);
    updateBookingState({ address: value });
  };

  const handleBackToService = () => {
    if (bookingState.service) {
      const serviceSlug = generateServiceSlug(bookingState.service.name);
      router.push(`/booking/service/${serviceSlug}`);
    } else {
      router.push('/booking/service');
    }
  };

  const canProceed = bookingState.bedrooms > 0 && 
                   bookingState.bathrooms > 0 && 
                   bookingState.suburb && 
                   bookingState.address && 
                   bookingState.address.trim().length > 0;

  if (regionsLoading) {
    return (
      <BookingLayout currentStep={2}>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading regions...</div>
        </div>
      </BookingLayout>
    );
  }

  return (
    <BookingLayout currentStep={2}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={handleBackToService}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Service
          </Button>
          <h1 className="text-3xl font-bold mb-2">Property Details</h1>
          <p className="text-muted-foreground">
            Tell us about your property and location in South Africa
          </p>
        </div>

        {/* Property Rooms */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Home className="h-5 w-5" />
            Property Rooms
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Number of Bedrooms
                  </Label>
                  <div className="flex gap-2 flex-wrap">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <Button
                        key={num}
                        variant={bookingState.bedrooms === num ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleBedroomsChange(num)}
                        className="min-w-[3rem]"
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                  {bookingState.bedrooms > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Selected: {bookingState.bedrooms} bedroom{bookingState.bedrooms !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Number of Bathrooms
                  </Label>
                  <div className="flex gap-2 flex-wrap">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <Button
                        key={num}
                        variant={bookingState.bathrooms === num ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleBathroomsChange(num)}
                        className="min-w-[3rem]"
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                  {bookingState.bathrooms > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Selected: {bookingState.bathrooms} bathroom{bookingState.bathrooms !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Location Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6">
                {/* Region Selection */}
                <div>
                  <Label htmlFor="region" className="text-sm font-medium mb-3 block">
                    Select Province
                  </Label>
                  <Select value={selectedRegionId} onValueChange={handleRegionChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your province" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions?.map((region) => (
                        <SelectItem key={region.id} value={region.id}>
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedRegionId && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Selected: {regions?.find(r => r.id === selectedRegionId)?.name}
                    </p>
                  )}
                </div>

                {/* Suburb Selection */}
                <div>
                  <Label htmlFor="suburb" className="text-sm font-medium mb-3 block">
                    Select Suburb/Area
                  </Label>
                  <Select 
                    value={bookingState.suburb?.id || ''} 
                    onValueChange={handleSuburbChange}
                    disabled={!selectedRegionId || suburbsLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={suburbsLoading ? "Loading suburbs..." : "Choose your suburb/area"} />
                    </SelectTrigger>
                    <SelectContent>
                      {suburbs?.map((suburb) => (
                        <SelectItem key={suburb.id} value={suburb.id}>
                          {suburb.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {bookingState.suburb && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Selected: {bookingState.suburb.name}, {bookingState.suburb.region.name}
                    </p>
                  )}
                </div>

                {/* Address Input */}
                <div>
                  <Label htmlFor="address" className="text-sm font-medium mb-3 block">
                    Property Address
                  </Label>
                  <Input
                    id="address"
                    placeholder="Enter your full address"
                    value={address}
                    onChange={(e) => handleAddressChange(e.target.value)}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Please provide the complete address where the cleaning service will take place
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" size="lg" onClick={handleBackToService}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Service
          </Button>
          
          {canProceed && (
            <Button 
              size="lg" 
              className="gap-2"
              onClick={() => router.push('/booking/extras')}
            >
              Continue to Extras
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </BookingLayout>
  );
}
