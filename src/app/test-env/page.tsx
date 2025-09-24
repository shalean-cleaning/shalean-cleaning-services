'use client';

export default function TestEnvPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
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
        <div>
          <strong>All env vars:</strong> {JSON.stringify(process.env, null, 2)}
        </div>
      </div>
    </div>
  );
}
