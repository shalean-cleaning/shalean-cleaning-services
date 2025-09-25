'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronUp, Calendar, MapPin, User, Home } from 'lucide-react';
import { formatPrice, type PricingBreakdown, type Service } from '@/lib/pricing';
import type { AuthUser } from '@/lib/auth';

interface BookingSummary {
  service?: Service;
  bedrooms: number;
  bathrooms: number;
  address?: string;
  suburb?: {
    name: string;
    region: {
      name: string;
    };
  };
  scheduledDate?: Date;
  scheduledTime?: string;
  selectedExtras: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  cleaner?: {
    id: string;
    profiles: {
      first_name: string | null;
      last_name: string | null;
    } | null;
  };
  pricing: PricingBreakdown;
}

interface StickySummaryProps {
  bookingSummary: BookingSummary;
  currentStep: number;
  user?: AuthUser | null;
}

export function StickySummary({ bookingSummary, currentStep, user }: StickySummaryProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Only show on steps 1-5 (before payment)
  if (currentStep > 5) {
    return null;
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="sticky top-20 z-40 w-full max-w-md mx-auto mb-6">
      <Card className="shadow-lg border-2 border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Booking Summary</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="md:hidden"
            >
              {isCollapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>

        {!isCollapsed && (
          <CardContent className="space-y-4">
            {/* Service Selection */}
            {bookingSummary.service && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-primary" />
                  <span className="font-medium">Service</span>
                </div>
                <div className="pl-6">
                  <p className="font-semibold">{bookingSummary.service.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Duration: {formatDuration(bookingSummary.service.duration_minutes)}
                  </p>
                </div>
              </div>
            )}

            {/* Property Details */}
            {(bookingSummary.bedrooms > 0 || bookingSummary.bathrooms > 0) && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-primary" />
                  <span className="font-medium">Property</span>
                </div>
                <div className="pl-6 flex gap-4">
                  <Badge variant="secondary">
                    {bookingSummary.bedrooms} bedroom{bookingSummary.bedrooms !== 1 ? 's' : ''}
                  </Badge>
                  <Badge variant="secondary">
                    {bookingSummary.bathrooms} bathroom{bookingSummary.bathrooms !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </div>
            )}

            {/* Location */}
            {bookingSummary.address && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-medium">Location</span>
                </div>
                <div className="pl-6">
                  <p className="text-sm">{bookingSummary.address}</p>
                  {bookingSummary.suburb && (
                    <p className="text-sm text-muted-foreground">
                      {bookingSummary.suburb.name}, {bookingSummary.suburb.region.name}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Date & Time */}
            {bookingSummary.scheduledDate && bookingSummary.scheduledTime && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="font-medium">Schedule</span>
                </div>
                <div className="pl-6">
                  <p className="text-sm">{formatDate(bookingSummary.scheduledDate)}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatTime(bookingSummary.scheduledTime)}
                  </p>
                </div>
              </div>
            )}

            {/* Cleaner */}
            {bookingSummary.cleaner && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-medium">Cleaner</span>
                </div>
                <div className="pl-6">
                  <p className="text-sm">
                    {bookingSummary.cleaner.profiles?.first_name} {bookingSummary.cleaner.profiles?.last_name}
                  </p>
                </div>
              </div>
            )}

            {/* Extras */}
            {bookingSummary.selectedExtras.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Extras</span>
                </div>
                <div className="pl-6 space-y-1">
                  {bookingSummary.selectedExtras.map((extra) => (
                    <div key={extra.id} className="flex justify-between text-sm">
                      <span>{extra.name} (×{extra.quantity})</span>
                      <span>{formatPrice(extra.price * extra.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Pricing Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Base service</span>
                <span>{formatPrice(bookingSummary.pricing.basePrice)}</span>
              </div>
              
              {bookingSummary.pricing.bedroomPrice > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Bedrooms ({bookingSummary.bedrooms})</span>
                  <span>{formatPrice(bookingSummary.pricing.bedroomPrice)}</span>
                </div>
              )}
              
              {bookingSummary.pricing.bathroomPrice > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Bathrooms ({bookingSummary.bathrooms})</span>
                  <span>{formatPrice(bookingSummary.pricing.bathroomPrice)}</span>
                </div>
              )}
              
              {bookingSummary.pricing.extrasPrice > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Extras</span>
                  <span>{formatPrice(bookingSummary.pricing.extrasPrice)}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(bookingSummary.pricing.subtotal)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Service fee (10%)</span>
                <span>{formatPrice(bookingSummary.pricing.serviceFee)}</span>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(bookingSummary.pricing.total)}</span>
              </div>
            </div>

            {/* User Info */}
            {user && (
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  Booking for: {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
