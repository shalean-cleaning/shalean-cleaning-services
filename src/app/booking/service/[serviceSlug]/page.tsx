'use client';

import { BookingLayout } from '@/components/booking/BookingLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBooking } from '@/providers/booking-provider';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { generateServiceSlug } from '@/lib/pricing';
import { generateMetadata, generateStaticParams } from './metadata';
import { use } from 'react';

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

interface ServicePageProps {
  params: Promise<{
    serviceSlug: string;
  }>;
}

export default function ServicePage({ params }: ServicePageProps) {
  const { bookingState, updateBookingState } = useBooking();
  const router = useRouter();
  const resolvedParams = use(params);

  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await fetch('/api/services');
      if (!response.ok) throw new Error('Failed to fetch services');
      return response.json() as Promise<Service[]>;
    },
  });

  // Find the service that matches the slug
  const currentService = services?.find(service => 
    generateServiceSlug(service.name) === resolvedParams.serviceSlug
  );

  const handleServiceSelect = (service: Service) => {
    updateBookingState({ service });
    // Redirect to details page with service in URL
    const serviceSlug = generateServiceSlug(service.name);
    router.push(`/booking/service/${serviceSlug}/details`);
  };

  const handleBackToServices = () => {
    router.push('/booking/service');
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

  if (!currentService) {
    return (
      <BookingLayout currentStep={1}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The service you're looking for doesn't exist.
            </p>
            <Button onClick={handleBackToServices} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Button>
          </div>
        </div>
      </BookingLayout>
    );
  }

  return (
    <BookingLayout currentStep={1}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={handleBackToServices}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Services
          </Button>
          <h1 className="text-3xl font-bold mb-2">{currentService.name}</h1>
          <p className="text-muted-foreground">
            {currentService.description}
          </p>
        </div>

        {/* Service Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Service Details
              <Badge variant="secondary">
                R{currentService.base_price.toLocaleString()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Duration</p>
                <p className="text-lg">
                  {Math.floor(currentService.duration_minutes / 60)}h {currentService.duration_minutes % 60}m
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Base Price</p>
                <p className="text-lg font-semibold">R{currentService.base_price.toLocaleString()}</p>
              </div>
              {currentService.per_bedroom_price && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Per Bedroom</p>
                  <p className="text-lg">+R{currentService.per_bedroom_price.toLocaleString()}</p>
                </div>
              )}
              {currentService.per_bathroom_price && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Per Bathroom</p>
                  <p className="text-lg">+R{currentService.per_bathroom_price.toLocaleString()}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

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
                      R{service.base_price.toLocaleString()}
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
                      <p>Per bedroom: +R{service.per_bedroom_price.toLocaleString()}</p>
                    )}
                    {service.per_bathroom_price && (
                      <p>Per bathroom: +R{service.per_bathroom_price.toLocaleString()}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Navigation */}
        {bookingState.service && (
          <div className="flex justify-end">
            <Button 
              size="lg" 
              className="gap-2"
              onClick={() => {
                const serviceSlug = generateServiceSlug(bookingState.service!.name);
                router.push(`/booking/service/${serviceSlug}/details`);
              }}
            >
              Continue to Details
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </BookingLayout>
  );
}
