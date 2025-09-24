'use client';

import { BookingLayout } from '@/components/booking/BookingLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBooking } from '@/providers/booking-provider';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Service {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  per_bedroom_price: number | null;
  per_bathroom_price: number | null;
  duration_minutes: number;
  category_id: string | null;
  is_active: boolean;
}

export default function ServiceSelectionPage() {
  const { bookingState, updateBookingState } = useBooking();

  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await fetch('/api/services');
      if (!response.ok) throw new Error('Failed to fetch services');
      return response.json() as Promise<Service[]>;
    },
  });

  const handleServiceSelect = (service: Service) => {
    updateBookingState({ service });
  };

  const handleBedroomsChange = (bedrooms: number) => {
    updateBookingState({ bedrooms });
  };

  const handleBathroomsChange = (bathrooms: number) => {
    updateBookingState({ bathrooms });
  };

  if (isLoading) {
    return (
      <BookingLayout currentStep={1}>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading services...</div>
        </div>
      </BookingLayout>
    );
  }

  return (
    <BookingLayout currentStep={1}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Choose Your Service</h1>
          <p className="text-muted-foreground">
            Select the cleaning service that best fits your needs
          </p>
        </div>

        {/* Service Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Available Services</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {services?.map((service) => (
              <Card 
                key={service.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  bookingState.service?.id === service.id 
                    ? 'ring-2 ring-primary' 
                    : ''
                }`}
                onClick={() => handleServiceSelect(service)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {service.name}
                    <Badge variant="secondary">
                      ${service.base_price}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {service.description}
                  </p>
                  <div className="text-sm space-y-1">
                    <p>Duration: {Math.floor(service.duration_minutes / 60)}h {service.duration_minutes % 60}m</p>
                    {service.per_bedroom_price && (
                      <p>Per bedroom: +${service.per_bedroom_price}</p>
                    )}
                    {service.per_bathroom_price && (
                      <p>Per bathroom: +${service.per_bathroom_price}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Property Details */}
        {bookingState.service && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Property Details</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Number of Bedrooms
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <Button
                          key={num}
                          variant={bookingState.bedrooms === num ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleBedroomsChange(num)}
                        >
                          {num}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Number of Bathrooms
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <Button
                          key={num}
                          variant={bookingState.bathrooms === num ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleBathroomsChange(num)}
                        >
                          {num}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation */}
        {bookingState.service && bookingState.bedrooms > 0 && bookingState.bathrooms > 0 && (
          <div className="flex justify-end">
            <Link href="http://localhost:3001/booking/service">
              <Button size="lg" className="gap-2">
                Continue to Details
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </BookingLayout>
  );
}
