'use client';

export default function DebugEnvPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Debug</h1>
      <div className="space-y-2">
        <div>
          <strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET'}
        </div>
        <div>
          <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'}
        </div>
        <div>
          <strong>NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY:</strong> {process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ? 'SET' : 'NOT SET'}
        </div>
        <div>
          <strong>NEXT_PUBLIC_APP_URL:</strong> {process.env.NEXT_PUBLIC_APP_URL || 'NOT SET'}
        </div>
        <div>
          <strong>NEXT_PUBLIC_APP_NAME:</strong> {process.env.NEXT_PUBLIC_APP_NAME || 'NOT SET'}
        </div>
      </div>
    </div>
  );
}
