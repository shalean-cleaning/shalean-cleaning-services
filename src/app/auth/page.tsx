'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useBooking } from '@/providers/booking-provider';
import { generateServiceSlug } from '@/lib/pricing';

export default function AuthPage() {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const { bookingState } = useBooking();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted, isSignUp:', isSignUp);
    console.log('Form data:', formData);
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        console.log('Attempting to sign up...');
        const user = await signUp(formData.email, formData.password, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        });
        console.log('Sign up successful, user:', user);
        // After successful sign up and user is returned, redirect appropriately
        if (user) {
          console.log('Redirecting after sign up...');
          // If there's a booking in progress, redirect to the service-specific review page
          if (bookingState.service && bookingState.scheduledDate && bookingState.scheduledTime && bookingState.address) {
            const serviceSlug = generateServiceSlug(bookingState.service.name);
            router.push(`/booking/service/${serviceSlug}/review`);
          } else {
            // Otherwise, redirect to booking service to start the booking flow
            router.push('/booking/service');
          }
        } else {
          console.error('No user returned from sign up');
          setError('Account creation failed. Please try again.');
        }
      } else {
        console.log('Attempting to sign in...');
        const user = await signIn(formData.email, formData.password);
        console.log('Sign in successful, user:', user);
        // After successful sign in and user is returned, redirect appropriately
        if (user) {
          console.log('Redirecting after sign in...');
          // If there's a booking in progress, redirect to the service-specific review page
          if (bookingState.service && bookingState.scheduledDate && bookingState.scheduledTime && bookingState.address) {
            const serviceSlug = generateServiceSlug(bookingState.service.name);
            router.push(`/booking/service/${serviceSlug}/review`);
          } else {
            // Otherwise, redirect to booking service to start the booking flow
            router.push('/booking/service');
          }
        } else {
          console.error('No user returned from sign in');
          setError('Sign in failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="sm" onClick={handleGoBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="text-2xl font-bold text-primary">Shalean</div>
              <div className="w-10"></div> {/* Spacer for centering */}
            </div>
            <CardTitle>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
            <CardDescription>
              {isSignUp 
                ? 'Sign up to complete your booking and manage your services'
                : 'Sign in to continue with your booking'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert className="mb-4" variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" onInvalid={(e) => console.log('Form invalid:', e)}>
              {isSignUp && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="pl-10"
                          required={isSignUp}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="pl-10"
                          required={isSignUp}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+27 82 123 4567"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pl-10"
                        required={isSignUp}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
                onClick={(e) => {
                  console.log('Button clicked, loading:', loading, 'isSignUp:', isSignUp);
                  console.log('Form data:', formData);
                  console.log('Event:', e);
                }}
              >
                {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </Button>
            </form>

            <div className="mt-6">
              <Separator className="mb-6" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                </p>
                <Button
                  variant="link"
                  onClick={() => {
                    console.log('Switching to:', !isSignUp ? 'Sign Up' : 'Sign In');
                    setIsSignUp(!isSignUp);
                    setError(null);
                    setFormData({
                      email: '',
                      password: '',
                      firstName: '',
                      lastName: '',
                      phone: '',
                    });
                  }}
                  className="mt-2"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </Button>
              </div>
            </div>

            {!isSignUp && (
              <div className="mt-4 text-center">
                <Button variant="link" size="sm" className="text-sm">
                  Forgot your password?
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
