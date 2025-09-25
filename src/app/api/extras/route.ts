import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';

// Mock data for service extras
const mockExtras = [
  {
    id: 'ee0e8400-e29b-41d4-a716-446655440001',
    name: 'Window Cleaning',
    description: 'Professional window cleaning inside and out',
    price: 150.00,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'ee0e8400-e29b-41d4-a716-446655440002',
    name: 'Oven Cleaning',
    description: 'Deep cleaning of oven interior and exterior',
    price: 200.00,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'ee0e8400-e29b-41d4-a716-446655440003',
    name: 'Refrigerator Cleaning',
    description: 'Complete refrigerator cleaning and sanitization',
    price: 180.00,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'ee0e8400-e29b-41d4-a716-446655440004',
    name: 'Carpet Cleaning',
    description: 'Professional carpet cleaning and stain removal',
    price: 300.00,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'ee0e8400-e29b-41d4-a716-446655440005',
    name: 'Garage Cleaning',
    description: 'Complete garage cleaning and organization',
    price: 250.00,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'ee0e8400-e29b-41d4-a716-446655440006',
    name: 'Balcony Cleaning',
    description: 'Outdoor balcony and patio cleaning',
    price: 120.00,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'ee0e8400-e29b-41d4-a716-446655440007',
    name: 'Laundry Service',
    description: 'Wash, dry, and fold laundry service',
    price: 100.00,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'ee0e8400-e29b-41d4-a716-446655440008',
    name: 'Pet Hair Removal',
    description: 'Specialized pet hair removal from furniture and carpets',
    price: 80.00,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  }
];

export async function GET() {
  try {
    // Try to fetch from Supabase first
    const { data: extras, error } = await supabase
      .from('service_extras')
      .select('id, name, description, price, is_active, created_at')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.warn('Supabase error, using mock data:', error.message);
      // Return mock data if Supabase is not available
      return NextResponse.json(mockExtras);
    }

    return NextResponse.json(extras);
  } catch (error) {
    console.warn('Unexpected error, using mock data:', error);
    // Return mock data if there's any error
    return NextResponse.json(mockExtras);
  }
}
