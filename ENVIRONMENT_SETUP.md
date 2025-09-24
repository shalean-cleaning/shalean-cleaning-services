# Environment Variables Configuration

This document describes the required environment variables for the Shalean Next.js application.

## Required Environment Variables

### Supabase Configuration
```bash
NEXT_PUBLIC_SUPABASE_URL=https://eiebitgqrnxjykkbpcbf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpZWJpdGdxcm54anlra2JwY2JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NTg1NjcsImV4cCI6MjA3NDEzNDU2N30.lv0bQU2M9FZ05ESGSkrtoc-JUC73x0Z1f86L8rreUiA
```

### Paystack Configuration
```bash
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_16df27480acd81aaf20b136ff5d9b53af08fd79e
PAYSTACK_SECRET_KEY=sk_test_3586fceaa64ccb45771cc59f37348512798c5db9
```

### Resend Configuration
```bash
RESEND_API_KEY=re_your_resend_api_key_here
```

### App Configuration
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Shalean Cleaning Services
```

## Setup Instructions

1. Create a `.env.local` file in the project root
2. Copy the environment variables above
3. Replace placeholder values with your actual API keys
4. Restart the development server

## Environment Variable Types

- `NEXT_PUBLIC_*`: Exposed to the browser (client-side)
- Others: Server-side only (secure)

## Security Notes

- Never commit `.env.local` to version control
- Use test keys for development
- Use production keys only in production environment
- Rotate keys regularly for security
