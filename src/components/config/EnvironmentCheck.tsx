'use client';

import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { validateConfig } from '@/lib/client-env';

interface EnvironmentCheckProps {
  children: React.ReactNode;
}

export function EnvironmentCheck({ children }: EnvironmentCheckProps) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    try {
      const validation = validateConfig();
      setIsValid(validation.isValid);
      setErrors(validation.errors);
    } catch (error) {
      console.warn('Environment validation failed:', error);
      // In development, allow the app to continue with warnings
      setIsValid(true);
      setErrors([error instanceof Error ? error.message : 'Unknown validation error']);
    }
  }, []);

  // If validation is still loading
  if (isValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Validating configuration...</p>
        </div>
      </div>
    );
  }

  // If validation failed, show warning but allow app to continue
  if (!isValid) {
    return (
      <>
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">Configuration Warning</p>
                <p className="text-sm">Some environment variables may be missing or invalid:</p>
                <ul className="list-disc list-inside text-xs space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setShowDetails(!showDetails)}
                  className="mt-2"
                >
                  {showDetails ? 'Hide' : 'Show'} Details
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
        
        {showDetails && (
          <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <XCircle className="h-5 w-5" />
                  Configuration Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Required Environment Variables:</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000`}
                    </pre>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDetails(false)}
                  >
                    Close
                  </Button>
                  <Button onClick={() => window.location.reload()}>
                    Retry
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {children}
      </>
    );
  }

  // If validation passed, render children
  return <>{children}</>;
}
