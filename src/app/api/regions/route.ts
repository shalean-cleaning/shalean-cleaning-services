import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';

// Mock data for South African provinces with focus on Western Cape
const mockRegions = [
  {
    id: '990e8400-e29b-41d4-a716-446655440001',
    name: 'Western Cape',
    description: 'Province including Cape Town and surrounding areas',
    is_active: true
  },
  {
    id: '990e8400-e29b-41d4-a716-446655440002',
    name: 'Gauteng',
    description: 'Province including Johannesburg and Pretoria',
    is_active: true
  },
  {
    id: '990e8400-e29b-41d4-a716-446655440003',
    name: 'KwaZulu-Natal',
    description: 'Province including Durban and Pietermaritzburg',
    is_active: true
  },
  {
    id: '990e8400-e29b-41d4-a716-446655440004',
    name: 'Eastern Cape',
    description: 'Province including Port Elizabeth and East London',
    is_active: true
  },
  {
    id: '990e8400-e29b-41d4-a716-446655440005',
    name: 'Free State',
    description: 'Province including Bloemfontein',
    is_active: true
  },
  {
    id: '990e8400-e29b-41d4-a716-446655440006',
    name: 'Limpopo',
    description: 'Northern province including Polokwane',
    is_active: true
  },
  {
    id: '990e8400-e29b-41d4-a716-446655440007',
    name: 'Mpumalanga',
    description: 'Province including Nelspruit and Witbank',
    is_active: true
  },
  {
    id: '990e8400-e29b-41d4-a716-446655440008',
    name: 'North West',
    description: 'Province including Mahikeng and Rustenburg',
    is_active: true
  },
  {
    id: '990e8400-e29b-41d4-a716-446655440009',
    name: 'Northern Cape',
    description: 'Province including Kimberley and Upington',
    is_active: true
  }
];

export async function GET() {
  try {
    // Try to fetch from Supabase first
    const { data: regions, error } = await supabase
      .from('regions')
      .select('id, name, description, is_active')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.warn('Supabase error, using mock data:', error.message);
      // Return mock data if Supabase is not available
      return NextResponse.json(mockRegions);
    }

    return NextResponse.json(regions);
  } catch (error) {
    console.warn('Unexpected error, using mock data:', error);
    // Return mock data if there's any error
    return NextResponse.json(mockRegions);
  }
}
