'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Star, User, Check } from 'lucide-react';
import { useBooking } from '@/providers/booking-provider';
import { BookingLayout } from '@/components/booking/BookingLayout';
import { formatPrice } from '@/lib/pricing';

interface Cleaner {
  id: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  } | null;
  bio: string;
  hourly_rate: number;
  rating: number;
  total_jobs: number;
  is_available: boolean;
  created_at: string;
}

export default function CleanerPage() {
  const router = useRouter();
  const { bookingState, updateBookingState } = useBooking();
  const [selectedCleaner, setSelectedCleaner] = useState<Cleaner | null>(
    bookingState.cleaner ? {
      id: bookingState.cleaner.id,
      profiles: bookingState.cleaner.profiles,
      bio: '',
      hourly_rate: 0,
      rating: 0,
      total_jobs: 0,
      is_available: true,
      created_at: ''
    } as Cleaner : null
  );

  const { data: cleaners, isLoading, error } = useQuery({
    queryKey: ['cleaners', bookingState.suburb?.region.id],
    queryFn: async () => {
      const url = bookingState.suburb?.region.id 
        ? `/api/cleaners?region_id=${bookingState.suburb.region.id}`
        : '/api/cleaners';
      console.log('Fetching cleaners from URL:', url);
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch cleaners');
      const data = await response.json();
      console.log('Fetched cleaners:', data);
      return data as Promise<Cleaner[]>;
    },
    enabled: true, // Always fetch cleaners, even without region
  });

  console.log('Cleaners state:', { cleaners, isLoading, error });

  const handleCleanerSelect = (cleaner: Cleaner) => {
    setSelectedCleaner(cleaner);
    updateBookingState({
      cleaner: {
        id: cleaner.id,
        profiles: cleaner.profiles,
      },
    });
  };

  const handleContinue = () => {
    if (!selectedCleaner) {
      return;
    }
    router.push('/booking/review');
  };

  const handleGoBack = () => {
    router.back();
  };

  const getInitials = (firstName: string | null | undefined, lastName: string | null | undefined) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return `${first}${last}`.toUpperCase();
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  if (isLoading) {
    return (
      <BookingLayout currentStep={5}>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading available cleaners...</div>
        </div>
      </BookingLayout>
    );
  }

  if (error) {
    return (
      <BookingLayout currentStep={5}>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Error loading cleaners: {error.message}</div>
        </div>
      </BookingLayout>
    );
  }

  if (!cleaners || cleaners.length === 0) {
    return (
      <BookingLayout currentStep={5}>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">No cleaners available at the moment.</div>
        </div>
      </BookingLayout>
    );
  }

  return (
    <BookingLayout currentStep={5}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="mb-4 p-0 h-auto font-normal"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold mb-2">Choose Your Cleaner</h1>
          <p className="text-muted-foreground">
            Select a professional cleaner for your service
          </p>
        </div>

        {/* Cleaners List */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Available Cleaners</h2>
          <div className="grid gap-4">
            {cleaners?.map((cleaner) => {
              const isSelected = selectedCleaner?.id === cleaner.id;
              const fullName = `${cleaner.profiles?.first_name || ''} ${cleaner.profiles?.last_name || ''}`.trim();

              return (
                <Card 
                  key={cleaner.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleCleanerSelect(cleaner)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={cleaner.profiles?.avatar_url || undefined} />
                        <AvatarFallback className="text-lg">
                          {getInitials(cleaner.profiles?.first_name, cleaner.profiles?.last_name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{fullName}</h3>
                            {isSelected && <Check className="h-4 w-4 text-primary" />}
                          </div>
                          <Badge variant="secondary">
                            {formatPrice(cleaner.hourly_rate)}/hour
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground mb-3">
                          {cleaner.bio}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            {renderStars(cleaner.rating)}
                            <span className="ml-1 font-medium">{cleaner.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{cleaner.total_jobs} jobs completed</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Selected Cleaner Summary */}
        {selectedCleaner && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Selected Cleaner</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedCleaner.profiles?.avatar_url || undefined} />
                    <AvatarFallback>
                      {getInitials(selectedCleaner.profiles?.first_name, selectedCleaner.profiles?.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {`${selectedCleaner.profiles?.first_name || ''} ${selectedCleaner.profiles?.last_name || ''}`.trim()}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        {renderStars(selectedCleaner.rating)}
                        <span>{selectedCleaner.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{selectedCleaner.total_jobs} jobs completed</span>
                      <span>•</span>
                      <span>{formatPrice(selectedCleaner.hourly_rate)}/hour</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleGoBack}>
            Back
          </Button>
          <Button 
            onClick={handleContinue}
            disabled={!selectedCleaner}
          >
            Continue to Review
          </Button>
        </div>
      </div>
    </BookingLayout>
  );
}
