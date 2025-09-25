'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { ArrowLeft, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useBooking } from '@/providers/booking-provider';
import { BookingLayout } from '@/components/booking/BookingLayout';
import { format } from 'date-fns';

// Available time slots
const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00'
];

export default function SchedulePage() {
  const router = useRouter();
  const { bookingState, updateBookingState } = useBooking();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    bookingState.scheduledDate
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    bookingState.scheduledTime || ''
  );

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    updateBookingState({ scheduledDate: date });
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    updateBookingState({ scheduledTime: time });
  };

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) {
      return;
    }
    router.push('/booking/cleaner');
  };

  const handleGoBack = () => {
    router.back();
  };

  const isDateDisabled = (date: Date) => {
    // Disable past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const getMinDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // Allow booking up to 30 days in advance
    return maxDate;
  };

  return (
    <BookingLayout currentStep={4}>
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
          <h1 className="text-3xl font-bold mb-2">Schedule Your Service</h1>
          <p className="text-muted-foreground">
            Choose the date and time that works best for you
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Date Selection */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Select Date
            </h2>
            <Card>
              <CardContent className="pt-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={isDateDisabled}
                  fromDate={getMinDate()}
                  toDate={getMaxDate()}
                  className="rounded-md border"
                />
                {selectedDate && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium">
                      Selected: {format(selectedDate, 'EEEE, MMMM do, yyyy')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Time Selection */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Select Time
            </h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Label htmlFor="time-slot" className="text-sm font-medium">
                    Available Time Slots
                  </Label>
                  <Select value={selectedTime} onValueChange={handleTimeSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time} - {getEndTime(time)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedTime && (
                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <p className="text-sm font-medium">
                        Selected: {selectedTime} - {getEndTime(selectedTime)}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Service Duration Info */}
        {bookingState.service && (
          <div className="mt-8">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Service Duration</h3>
                <p className="text-sm text-muted-foreground">
                  {bookingState.service.name} typically takes{' '}
                  {Math.floor(bookingState.service.duration_minutes / 60)} hours{' '}
                  {bookingState.service.duration_minutes % 60 > 0 && 
                    `${bookingState.service.duration_minutes % 60} minutes`
                  } to complete.
                </p>
                {bookingState.selectedExtras.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Additional time may be required for selected extras.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={handleGoBack}>
            Back
          </Button>
          <Button 
            onClick={handleContinue}
            disabled={!selectedDate || !selectedTime}
          >
            Continue to Cleaner Selection
          </Button>
        </div>
      </div>
    </BookingLayout>
  );
}

function getEndTime(startTime: string): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const endHours = hours + 2; // Assuming 2-hour service duration
  return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
