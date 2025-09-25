'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Plus, Minus, Check } from 'lucide-react';
import { useBooking } from '@/providers/booking-provider';
import { BookingLayout } from '@/components/booking/BookingLayout';
import { formatPrice } from '@/lib/pricing';

interface ServiceExtra {
  id: string;
  name: string;
  description: string;
  price: number;
  is_active: boolean;
  created_at: string;
}

export default function ExtrasPage() {
  const router = useRouter();
  const { bookingState, addExtra, removeExtra, updateExtraQuantity } = useBooking();

  const { data: extras, isLoading } = useQuery({
    queryKey: ['extras'],
    queryFn: async () => {
      const response = await fetch('/api/extras');
      if (!response.ok) throw new Error('Failed to fetch extras');
      return response.json() as Promise<ServiceExtra[]>;
    },
  });

  const handleExtraToggle = (extra: ServiceExtra) => {
    const existingExtra = bookingState.selectedExtras.find(e => e.id === extra.id);
    if (existingExtra) {
      removeExtra(extra.id);
    } else {
      addExtra({
        id: extra.id,
        name: extra.name,
        price: extra.price,
      });
    }
  };

  const handleQuantityChange = (extraId: string, quantity: number) => {
    updateExtraQuantity(extraId, quantity);
  };

  const handleContinue = () => {
    router.push('/booking/schedule');
  };

  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <BookingLayout currentStep={3}>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading extras...</div>
        </div>
      </BookingLayout>
    );
  }

  return (
    <BookingLayout currentStep={3}>
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
          <h1 className="text-3xl font-bold mb-2">Add Extras</h1>
          <p className="text-muted-foreground">
            Enhance your cleaning service with additional services
          </p>
        </div>

        {/* Extras Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Available Extras</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {extras?.map((extra) => {
              const selectedExtra = bookingState.selectedExtras.find(e => e.id === extra.id);
              const isSelected = !!selectedExtra;
              const quantity = selectedExtra?.quantity || 0;

              return (
                <Card 
                  key={extra.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleExtraToggle(extra)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {extra.name}
                        {isSelected && <Check className="h-4 w-4 text-primary" />}
                      </div>
                      <Badge variant="secondary">
                        {formatPrice(extra.price)}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {extra.description}
                    </p>
                    
                    {isSelected && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(extra.id, quantity - 1);
                          }}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium min-w-[2rem] text-center">
                          {quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(extra.id, quantity + 1);
                          }}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Selected Extras Summary */}
        {bookingState.selectedExtras.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Selected Extras</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {bookingState.selectedExtras.map((extra) => (
                    <div key={extra.id} className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{extra.name}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          (×{extra.quantity})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {formatPrice(extra.price * extra.quantity)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExtra(extra.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total Extras</span>
                    <span>{formatPrice(bookingState.pricing.extrasPrice)}</span>
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
          <Button onClick={handleContinue}>
            Continue to Schedule
          </Button>
        </div>
      </div>
    </BookingLayout>
  );
}
