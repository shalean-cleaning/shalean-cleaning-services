import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';

// Mock data for South African suburbs with focus on Cape Town
const mockSuburbs = [
  // Western Cape - Cape Town suburbs
  {
    id: 'aa0e8400-e29b-41d4-a716-446655440001',
    name: 'Cape Town CBD',
    region_id: '990e8400-e29b-41d4-a716-446655440001',
    is_active: true,
    regions: {
      id: '990e8400-e29b-41d4-a716-446655440001',
      name: 'Western Cape',
      description: 'Province including Cape Town and surrounding areas'
    }
  },
  {
    id: 'aa0e8400-e29b-41d4-a716-446655440002',
    name: 'Sea Point',
    region_id: '990e8400-e29b-41d4-a716-446655440001',
    is_active: true,
    regions: {
      id: '990e8400-e29b-41d4-a716-446655440001',
      name: 'Western Cape',
      description: 'Province including Cape Town and surrounding areas'
    }
  },
  {
    id: 'aa0e8400-e29b-41d4-a716-446655440003',
    name: 'Green Point',
    region_id: '990e8400-e29b-41d4-a716-446655440001',
    is_active: true,
    regions: {
      id: '990e8400-e29b-41d4-a716-446655440001',
      name: 'Western Cape',
      description: 'Province including Cape Town and surrounding areas'
    }
  },
  {
    id: 'aa0e8400-e29b-41d4-a716-446655440004',
    name: 'Camps Bay',
    region_id: '990e8400-e29b-41d4-a716-446655440001',
    is_active: true,
    regions: {
      id: '990e8400-e29b-41d4-a716-446655440001',
      name: 'Western Cape',
      description: 'Province including Cape Town and surrounding areas'
    }
  },
  {
    id: 'aa0e8400-e29b-41d4-a716-446655440005',
    name: 'Claremont',
    region_id: '990e8400-e29b-41d4-a716-446655440001',
    is_active: true,
    regions: {
      id: '990e8400-e29b-41d4-a716-446655440001',
      name: 'Western Cape',
      description: 'Province including Cape Town and surrounding areas'
    }
  },
  {
    id: 'aa0e8400-e29b-41d4-a716-446655440006',
    name: 'Rondebosch',
    region_id: '990e8400-e29b-41d4-a716-446655440001',
    is_active: true,
    regions: {
      id: '990e8400-e29b-41d4-a716-446655440001',
      name: 'Western Cape',
      description: 'Province including Cape Town and surrounding areas'
    }
  },
  {
    id: 'aa0e8400-e29b-41d4-a716-446655440007',
    name: 'Newlands',
    region_id: '990e8400-e29b-41d4-a716-446655440001',
    is_active: true,
    regions: {
      id: '990e8400-e29b-41d4-a716-446655440001',
      name: 'Western Cape',
      description: 'Province including Cape Town and surrounding areas'
    }
  },
  {
    id: 'aa0e8400-e29b-41d4-a716-446655440008',
    name: 'Constantia',
    region_id: '990e8400-e29b-41d4-a716-446655440001',
    is_active: true,
    regions: {
      id: '990e8400-e29b-41d4-a716-446655440001',
      name: 'Western Cape',
      description: 'Province including Cape Town and surrounding areas'
    }
  },
  {
    id: 'aa0e8400-e29b-41d4-a716-446655440009',
    name: 'Hout Bay',
    region_id: '990e8400-e29b-41d4-a716-446655440001',
    is_active: true,
    regions: {
      id: '990e8400-e29b-41d4-a716-446655440001',
      name: 'Western Cape',
      description: 'Province including Cape Town and surrounding areas'
    }
  },
  {
    id: 'aa0e8400-e29b-41d4-a716-446655440010',
    name: 'Stellenbosch',
    region_id: '990e8400-e29b-41d4-a716-446655440001',
    is_active: true,
    regions: {
      id: '990e8400-e29b-41d4-a716-446655440001',
      name: 'Western Cape',
      description: 'Province including Cape Town and surrounding areas'
    }
  },
  // Gauteng - Johannesburg suburbs
  {
    id: 'aa0e8400-e29b-41d4-a716-446655440011',
    name: 'Sandton',
    region_id: '990e8400-e29b-41d4-a716-446655440002',
    is_active: true,
    regions: {
      id: '990e8400-e29b-41d4-a716-446655440002',
      name: 'Gauteng',
      description: 'Province including Johannesburg and Pretoria'
    }
  },
  {
    id: 'aa0e8400-e29b-41d4-a716-446655440012',
    name: 'Rosebank',
    region_id: '990e8400-e29b-41d4-a716-446655440002',
    is_active: true,
    regions: {
      id: '990e8400-e29b-41d4-a716-446655440002',
      name: 'Gauteng',
      description: 'Province including Johannesburg and Pretoria'
    }
  },
  {
    id: 'aa0e8400-e29b-41d4-a716-446655440013',
    name: 'Melville',
    region_id: '990e8400-e29b-41d4-a716-446655440002',
    is_active: true,
    regions: {
      id: '990e8400-e29b-41d4-a716-446655440002',
      name: 'Gauteng',
      description: 'Province including Johannesburg and Pretoria'
    }
  },
  {
    id: 'aa0e8400-e29b-41d4-a716-446655440014',
    name: 'Pretoria CBD',
    region_id: '990e8400-e29b-41d4-a716-446655440002',
    is_active: true,
    regions: {
      id: '990e8400-e29b-41d4-a716-446655440002',
      name: 'Gauteng',
      description: 'Province including Johannesburg and Pretoria'
    }
  },
  // KwaZulu-Natal - Durban suburbs
  {
    id: 'aa0e8400-e29b-41d4-a716-446655440015',
    name: 'Durban CBD',
    region_id: '990e8400-e29b-41d4-a716-446655440003',
    is_active: true,
    regions: {
      id: '990e8400-e29b-41d4-a716-446655440003',
      name: 'KwaZulu-Natal',
      description: 'Province including Durban and Pietermaritzburg'
    }
  },
  {
    id: 'aa0e8400-e29b-41d4-a716-446655440016',
    name: 'Umhlanga',
    region_id: '990e8400-e29b-41d4-a716-446655440003',
    is_active: true,
    regions: {
      id: '990e8400-e29b-41d4-a716-446655440003',
      name: 'KwaZulu-Natal',
      description: 'Province including Durban and Pietermaritzburg'
    }
  },
  {
    id: 'aa0e8400-e29b-41d4-a716-446655440017',
    name: 'Pietermaritzburg',
    region_id: '990e8400-e29b-41d4-a716-446655440003',
    is_active: true,
    regions: {
      id: '990e8400-e29b-41d4-a716-446655440003',
      name: 'KwaZulu-Natal',
      description: 'Province including Durban and Pietermaritzburg'
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const regionId = searchParams.get('region_id');

    // Try to fetch from Supabase first
    let query = supabase
      .from('suburbs')
      .select(`
        id,
        name,
        region_id,
        is_active,
        regions (
          id,
          name,
          description
        )
      `)
      .eq('is_active', true)
      .order('name');

    if (regionId) {
      query = query.eq('region_id', regionId);
    }

    const { data: suburbs, error } = await query;

    if (error) {
      console.warn('Supabase error, using mock data:', error.message);
      // Return filtered mock data if Supabase is not available
      const filteredMockData = regionId 
        ? mockSuburbs.filter(suburb => suburb.region_id === regionId)
        : mockSuburbs;
      return NextResponse.json(filteredMockData);
    }

    return NextResponse.json(suburbs);
  } catch (error) {
    console.warn('Unexpected error, using mock data:', error);
    // Return filtered mock data if there's any error
    const { searchParams } = new URL(request.url);
    const regionId = searchParams.get('region_id');
    const filteredMockData = regionId 
      ? mockSuburbs.filter(suburb => suburb.region_id === regionId)
      : mockSuburbs;
    return NextResponse.json(filteredMockData);
  }
}
