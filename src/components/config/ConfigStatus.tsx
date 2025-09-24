'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import config from '@/lib/config';

interface ConfigStatusProps {
  className?: string;
}

export function ConfigStatus({ className }: ConfigStatusProps) {
  const [showSecrets, setShowSecrets] = useState(false);

  if (!config.features.debugMode) {
    return null;
  }

  const getStatusIcon = (isValid: boolean) => {
    return isValid ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getStatusBadge = (isValid: boolean) => {
    return isValid ? (
      <Badge variant="default" className="bg-green-600">
        Valid
      </Badge>
    ) : (
      <Badge variant="destructive">Invalid</Badge>
    );
  };

  const maskSecret = (value: string | undefined) => {
    if (!value) return 'Not set';
    if (showSecrets) return value;
    return value.substring(0, 8) + '...' + value.substring(value.length - 4);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Configuration Status
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSecrets(!showSecrets)}
            >
              {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showSecrets ? 'Hide' : 'Show'} Secrets
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Environment Info */}
        <div>
          <h3 className="font-semibold mb-2">Environment</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Mode:</span>
              <Badge variant="outline" className="ml-2">
                {config.isDevelopment ? 'Development' : config.isProduction ? 'Production' : 'Test'}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">App URL:</span>
              <span className="ml-2">{config.app?.url || 'Not set'}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Supabase Configuration */}
        <div>
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            {getStatusIcon(!!config.supabase?.url && !!config.supabase?.anonKey)}
            Supabase
            {getStatusBadge(!!config.supabase?.url && !!config.supabase?.anonKey)}
          </h3>
          <div className="space-y-1 text-sm">
            <div>
              <span className="text-muted-foreground">URL:</span>
              <span className="ml-2 font-mono">{config.supabase?.url || 'Not set'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Anon Key:</span>
              <span className="ml-2 font-mono">{maskSecret(config.supabase?.anonKey)}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Paystack Configuration */}
        <div>
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            {getStatusIcon(!!config.paystack?.publicKey)}
            Paystack
            {getStatusBadge(!!config.paystack?.publicKey)}
          </h3>
          <div className="space-y-1 text-sm">
            <div>
              <span className="text-muted-foreground">Public Key:</span>
              <span className="ml-2 font-mono">{maskSecret(config.paystack?.publicKey)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Secret Key:</span>
              <span className="ml-2 font-mono text-muted-foreground">Server-side only</span>
            </div>
            <div>
              <span className="text-muted-foreground">Currency:</span>
              <span className="ml-2">{config.payment.currency}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Resend Configuration */}
        <div>
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            {getStatusIcon(!!config.resend?.apiKey)}
            Resend
            {getStatusBadge(!!config.resend?.apiKey)}
          </h3>
          <div className="space-y-1 text-sm">
            <div>
              <span className="text-muted-foreground">API Key:</span>
              <span className="ml-2 font-mono">{maskSecret(config.resend?.apiKey)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">From:</span>
              <span className="ml-2">{config.email.from}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Feature Flags */}
        <div>
          <h3 className="font-semibold mb-2">Feature Flags</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Analytics:</span>
              <Badge variant={config.features.analytics ? 'default' : 'secondary'}>
                {config.features.analytics ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Debug Mode:</span>
              <Badge variant={config.features.debugMode ? 'default' : 'secondary'}>
                {config.features.debugMode ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Email:</span>
              <Badge variant={config.features.emailNotifications ? 'default' : 'secondary'}>
                {config.features.emailNotifications ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
