'use client';

import { useBooking } from '@/providers/booking-provider';
import { useAuth } from '@/hooks/useAuth';
import { StickySummary } from '@/components/booking/StickySummary';

interface BookingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
}

export function BookingLayout({ children, currentStep }: BookingLayoutProps) {
  const { bookingState } = useBooking();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {children}
          </div>
          
          {/* Sticky Summary Sidebar */}
          <div className="lg:w-80">
            <StickySummary 
              bookingSummary={bookingState}
              currentStep={currentStep}
              user={user}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
