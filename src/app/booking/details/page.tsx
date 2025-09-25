'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useBooking } from '@/providers/booking-provider';
import { generateServiceSlug } from '@/lib/pricing';

export default function DetailsRedirectPage() {
  const { bookingState } = useBooking();
  const router = useRouter();

  useEffect(() => {
    if (bookingState.service) {
      // Redirect to service-specific details page
      const serviceSlug = generateServiceSlug(bookingState.service.name);
      router.replace(`/booking/service/${serviceSlug}/details`);
    } else {
      // If no service selected, redirect to service selection
      router.replace('/booking/service');
    }
  }, [bookingState.service, router]);

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-lg">Redirecting...</div>
    </div>
  );
}
