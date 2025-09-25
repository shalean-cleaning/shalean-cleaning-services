import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';

// Mock data from seed.sql for testing when Supabase is not available
const mockServices = [
  {
    id: '880e8400-e29b-41d4-a716-446655440001',
    name: 'Standard House Cleaning',
    description: 'Regular house cleaning including living areas, bedrooms, and bathrooms',
    base_price: 450.00,
    per_bedroom_price: 60.00,
    per_bathroom_price: 90.00,
    duration_minutes: 120,
    category_id: '770e8400-e29b-41d4-a716-446655440001',
    is_active: true,
    service_categories: {
      id: '770e8400-e29b-41d4-a716-446655440001',
      name: 'House Cleaning',
      description: 'Complete house cleaning services'
    }
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440002',
    name: 'Premium House Cleaning',
    description: 'Comprehensive house cleaning with attention to detail',
    base_price: 750.00,
    per_bedroom_price: 90.00,
    per_bathroom_price: 120.00,
    duration_minutes: 180,
    category_id: '770e8400-e29b-41d4-a716-446655440001',
    is_active: true,
    service_categories: {
      id: '770e8400-e29b-41d4-a716-446655440001',
      name: 'House Cleaning',
      description: 'Complete house cleaning services'
    }
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440003',
    name: 'Office Cleaning',
    description: 'Professional office cleaning including desks, floors, and common areas',
    base_price: 600.00,
    per_bedroom_price: null,
    per_bathroom_price: null,
    duration_minutes: 90,
    category_id: '770e8400-e29b-41d4-a716-446655440002',
    is_active: true,
    service_categories: {
      id: '770e8400-e29b-41d4-a716-446655440002',
      name: 'Office Cleaning',
      description: 'Professional office cleaning services'
    }
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440004',
    name: 'Commercial Cleaning',
    description: 'Large commercial space cleaning',
    base_price: 1050.00,
    per_bedroom_price: null,
    per_bathroom_price: null,
    duration_minutes: 240,
    category_id: '770e8400-e29b-41d4-a716-446655440002',
    is_active: true,
    service_categories: {
      id: '770e8400-e29b-41d4-a716-446655440002',
      name: 'Office Cleaning',
      description: 'Professional office cleaning services'
    }
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440005',
    name: 'Deep House Cleaning',
    description: 'Intensive cleaning including inside appliances, cabinets, and detailed scrubbing',
    base_price: 1200.00,
    per_bedroom_price: 150.00,
    per_bathroom_price: 180.00,
    duration_minutes: 300,
    category_id: '770e8400-e29b-41d4-a716-446655440003',
    is_active: true,
    service_categories: {
      id: '770e8400-e29b-41d4-a716-446655440003',
      name: 'Deep Cleaning',
      description: 'Intensive deep cleaning services'
    }
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440006',
    name: 'Move-in/Move-out Cleaning',
    description: 'Complete cleaning for moving in or out of property',
    base_price: 1050.00,
    per_bedroom_price: 120.00,
    per_bathroom_price: 150.00,
    duration_minutes: 240,
    category_id: '770e8400-e29b-41d4-a716-446655440003',
    is_active: true,
    service_categories: {
      id: '770e8400-e29b-41d4-a716-446655440003',
      name: 'Deep Cleaning',
      description: 'Intensive deep cleaning services'
    }
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440007',
    name: 'Post-Construction Cleaning',
    description: 'Specialized cleaning after construction or renovation work',
    base_price: 1500.00,
    per_bedroom_price: 180.00,
    per_bathroom_price: 240.00,
    duration_minutes: 360,
    category_id: '770e8400-e29b-41d4-a716-446655440004',
    is_active: true,
    service_categories: {
      id: '770e8400-e29b-41d4-a716-446655440004',
      name: 'Post-Construction',
      description: 'Cleaning after construction or renovation'
    }
  }
];

export async function GET() {
  try {
    // Try to fetch from Supabase first
    const { data: services, error } = await supabase
      .from('services')
      .select(`
        id,
        name,
        description,
        base_price,
        per_bedroom_price,
        per_bathroom_price,
        duration_minutes,
        category_id,
        is_active,
        service_categories (
          id,
          name,
          description
        )
      `)
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.warn('Supabase error, using mock data:', error.message);
      // Return mock data if Supabase is not available
      return NextResponse.json(mockServices);
    }

    return NextResponse.json(services);
  } catch (error) {
    console.warn('Unexpected error, using mock data:', error);
    // Return mock data if there's any error
    return NextResponse.json(mockServices);
  }
}
