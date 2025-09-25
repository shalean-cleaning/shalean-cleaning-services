# Supabase Remote Connection Setup Guide

## Project Reference: ytitquypkuboktpypjwa

This project has been configured to connect to the remote Supabase instance with reference `ytitquypkuboktpypjwa`.

## Required Environment Variables

To complete the connection, you need to set up the following environment variables:

### 1. Create Environment File
Create a `.env.local` file in the project root with the following content:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ytitquypkuboktpypjwa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here

# Optional: Other configurations
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key_here
PAYSTACK_SECRET_KEY=your_paystack_secret_key_here
RESEND_API_KEY=your_resend_api_key_here
```

### 2. Get Your Supabase API Key
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/ytitquypkuboktpypjwa)
2. Navigate to Settings > API
3. Copy the "anon public" key
4. Replace `your_actual_anon_key_here` in your `.env.local` file

### 3. Test the Connection
Run the test script to verify the connection:
```bash
node test-supabase-connection.js
```

## Current Configuration Status

✅ **Project Reference Updated**: The `supabase/config.toml` has been updated with the correct project reference
✅ **URL Configuration**: The application is configured to use `https://ytitquypkuboktpypjwa.supabase.co`
⏳ **API Key Required**: You need to add the actual anon key to complete the connection

## Next Steps

1. **Get your Supabase API key** from the dashboard
2. **Create `.env.local`** file with the environment variables
3. **Test the connection** using the provided test script
4. **Start the development server** with `npm run dev`

## Troubleshooting

If you encounter authentication issues:
1. Make sure you're logged into the correct Supabase account
2. Verify the project reference `ytitquypkuboktpypjwa` is correct
3. Check that the API key is copied correctly from the dashboard
4. Ensure the `.env.local` file is in the project root directory

## Supabase CLI Commands

Once properly configured, you can use these commands:
```bash
# Link to remote project
npx supabase link --project-ref ytitquypkuboktpypjwa

# Pull database schema
npx supabase db pull

# Generate TypeScript types
npx supabase gen types typescript --local

# Start local development
npx supabase start
```
