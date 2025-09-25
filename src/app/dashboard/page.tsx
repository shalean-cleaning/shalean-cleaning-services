'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, MapPin, User, LogOut, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice } from '@/lib/pricing';

interface Booking {
  id: string;
  service_name: string;
  scheduled_date: string;
  scheduled_time: string;
  address: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  total_amount: number;
  cleaner_name?: string;
}

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    // Mock bookings data for demonstration
    const mockBookings: Booking[] = [
      {
        id: '1',
        service_name: 'Deep Cleaning',
        scheduled_date: '2024-01-15',
        scheduled_time: '09:00',
        address: '123 Main Street, Johannesburg',
        status: 'confirmed',
        total_amount: 850,
        cleaner_name: 'Sarah Johnson',
      },
      {
        id: '2',
        service_name: 'Regular Cleaning',
        scheduled_date: '2024-01-20',
        scheduled_time: '10:00',
        address: '456 Oak Avenue, Cape Town',
        status: 'pending',
        total_amount: 450,
      },
    ];

    setTimeout(() => {
      setBookings(mockBookings);
      setIsLoading(false);
    }, 1000);
  }, [user, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleNewBooking = () => {
    router.push('/booking/service');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.firstName || user.email}!
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your cleaning bookings and account
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleNewBooking} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Booking
            </Button>
            <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
              <p className="text-xs text-muted-foreground">
                All time bookings
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Scheduled bookings
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPrice(bookings.reduce((sum, booking) => sum + booking.total_amount, 0))}
              </div>
              <p className="text-xs text-muted-foreground">
                All time spending
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-600 mb-4">Get started by creating your first cleaning booking</p>
                <Button onClick={handleNewBooking}>
                  Create Booking
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{booking.service_name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(booking.scheduled_date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {booking.scheduled_time}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {booking.address}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                        <div className="text-lg font-semibold mt-2">
                          {formatPrice(booking.total_amount)}
                        </div>
                      </div>
                    </div>
                    
                    {booking.cleaner_name && (
                      <>
                        <Separator className="my-3" />
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Assigned cleaner:</span>
                          <span className="font-medium">{booking.cleaner_name}</span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
