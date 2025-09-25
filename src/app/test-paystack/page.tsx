'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PaystackClient } from '@/lib/paystack-client';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function TestPaystackPage() {
  const [envStatus, setEnvStatus] = useState<{
    publicKey: string | null;
    secretKey: string | null;
    isValid: boolean;
    errors: string[];
  }>({
    publicKey: null,
    secretKey: null,
    isValid: false,
    errors: []
  });

  const [clientStatus, setClientStatus] = useState<{
    initialized: boolean;
    error: string | null;
  }>({
    initialized: false,
    error: null
  });

  useEffect(() => {
    // Check environment variables
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';
    const secretKey = process.env.PAYSTACK_SECRET_KEY || '';
    const errors: string[] = [];

    if (!publicKey) {
      errors.push('NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is not set');
    } else if (!publicKey.startsWith('pk_')) {
      errors.push('NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY format is invalid (should start with pk_)');
    }

    if (!secretKey) {
      errors.push('PAYSTACK_SECRET_KEY is not set');
    } else if (!secretKey.startsWith('sk_')) {
      errors.push('PAYSTACK_SECRET_KEY format is invalid (should start with sk_)');
    }

    setEnvStatus({
      publicKey: publicKey || null,
      secretKey: secretKey || null,
      isValid: errors.length === 0,
      errors
    });

    // Test PaystackClient initialization
    if (publicKey) {
      try {
        const client = new PaystackClient(publicKey);
        setClientStatus({
          initialized: true,
          error: null
        });
      } catch (error) {
        setClientStatus({
          initialized: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  }, []);

  const testPayment = async () => {
    if (!envStatus.publicKey) {
      alert('Paystack public key is not configured');
      return;
    }

    try {
      const client = new PaystackClient(envStatus.publicKey);
      await client.initialize();
      alert('Paystack client initialized successfully!');
    } catch (error) {
      alert(`Paystack initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Paystack Configuration Test</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Environment Variables Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {envStatus.isValid ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Environment Variables
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <strong>Public Key:</strong>
              <div className="text-sm font-mono bg-gray-100 p-2 rounded mt-1">
                {envStatus.publicKey ? 
                  `${envStatus.publicKey.substring(0, 20)}...` : 
                  'NOT SET'
                }
              </div>
            </div>
            
            <div>
              <strong>Secret Key:</strong>
              <div className="text-sm font-mono bg-gray-100 p-2 rounded mt-1">
                {envStatus.secretKey ? 
                  `${envStatus.secretKey.substring(0, 20)}...` : 
                  'NOT SET'
                }
              </div>
            </div>

            {envStatus.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside">
                    {envStatus.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* PaystackClient Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {clientStatus.initialized ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              PaystackClient Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <strong>Initialized:</strong> {clientStatus.initialized ? 'Yes' : 'No'}
            </div>
            
            {clientStatus.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{clientStatus.error}</AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={testPayment}
              disabled={!envStatus.isValid}
              className="w-full"
            >
              Test Paystack Initialization
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Debug Information */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</div>
            <div><strong>All Environment Keys:</strong></div>
            <div className="font-mono bg-gray-100 p-2 rounded text-xs">
              {Object.keys(process.env)
                .filter(key => key.includes('PAYSTACK'))
                .map(key => `${key}=${process.env[key]?.substring(0, 20)}...`)
                .join('\n')}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
