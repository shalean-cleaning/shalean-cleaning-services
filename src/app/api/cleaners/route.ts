import { NextRequest, NextResponse } from 'next/server';

// Real seeded data for cleaners (from our database)
const mockCleaners = [
  {
    id: 'cc0e8400-e29b-41d4-a716-446655440001',
    profiles: {
      first_name: 'Sarah',
      last_name: 'Johnson',
      avatar_url: null
    },
    bio: 'Professional cleaner with 5+ years experience. Specializes in deep cleaning and organization. Certified in eco-friendly cleaning methods.',
    hourly_rate: 120.00,
    rating: 4.8,
    total_jobs: 156,
    is_available: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cc0e8400-e29b-41d4-a716-446655440002',
    profiles: {
      first_name: 'Michael',
      last_name: 'Brown',
      avatar_url: null
    },
    bio: 'Experienced cleaner with attention to detail. Available for both residential and commercial cleaning. Background in hospitality cleaning.',
    hourly_rate: 110.00,
    rating: 4.6,
    total_jobs: 89,
    is_available: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cc0e8400-e29b-41d4-a716-446655440003',
    profiles: {
      first_name: 'Emily',
      last_name: 'Davis',
      avatar_url: null
    },
    bio: 'Reliable and thorough cleaner with eco-friendly cleaning products. Great with pets and children. Flexible scheduling available.',
    hourly_rate: 125.00,
    rating: 4.9,
    total_jobs: 203,
    is_available: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cc0e8400-e29b-41d4-a716-446655440004',
    profiles: {
      first_name: 'David',
      last_name: 'Wilson',
      avatar_url: null
    },
    bio: 'Professional cleaner specializing in post-construction cleanup and deep cleaning services. 8+ years experience in commercial spaces.',
    hourly_rate: 130.00,
    rating: 4.7,
    total_jobs: 134,
    is_available: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cc0e8400-e29b-41d4-a716-446655440005',
    profiles: {
      first_name: 'Lisa',
      last_name: 'Anderson',
      avatar_url: null
    },
    bio: 'Experienced cleaner with flexible scheduling. Specializes in move-in/move-out cleaning. Background in property management.',
    hourly_rate: 115.00,
    rating: 4.5,
    total_jobs: 78,
    is_available: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cc0e8400-e29b-41d4-a716-446655440006',
    profiles: {
      first_name: 'James',
      last_name: 'Taylor',
      avatar_url: null
    },
    bio: 'Professional cleaner with expertise in coastal property maintenance. Specializes in humidity-resistant cleaning methods.',
    hourly_rate: 118.00,
    rating: 4.6,
    total_jobs: 92,
    is_available: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cc0e8400-e29b-41d4-a716-446655440007',
    profiles: {
      first_name: 'Maria',
      last_name: 'Garcia',
      avatar_url: null
    },
    bio: 'Detail-oriented cleaner with 6+ years experience. Specializes in luxury home cleaning and maintenance.',
    hourly_rate: 135.00,
    rating: 4.8,
    total_jobs: 167,
    is_available: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cc0e8400-e29b-41d4-a716-446655440008',
    profiles: {
      first_name: 'Robert',
      last_name: 'Miller',
      avatar_url: null
    },
    bio: 'Professional cleaner with industrial cleaning background. Specializes in large residential properties and commercial spaces.',
    hourly_rate: 128.00,
    rating: 4.7,
    total_jobs: 145,
    is_available: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cc0e8400-e29b-41d4-a716-446655440009',
    profiles: {
      first_name: 'Jennifer',
      last_name: 'White',
      avatar_url: null
    },
    bio: 'Experienced cleaner with focus on sustainable cleaning practices. Certified in green cleaning methods and eco-friendly products.',
    hourly_rate: 122.00,
    rating: 4.9,
    total_jobs: 189,
    is_available: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cc0e8400-e29b-41d4-a716-446655440010',
    profiles: {
      first_name: 'William',
      last_name: 'Harris',
      avatar_url: null
    },
    bio: 'Reliable cleaner with flexible availability. Specializes in regular maintenance cleaning and emergency cleaning services.',
    hourly_rate: 105.00,
    rating: 4.4,
    total_jobs: 67,
    is_available: true,
    created_at: '2024-01-01T00:00:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const regionId = searchParams.get('region_id');

    console.log('Fetching cleaners for region:', regionId);

    // For now, return the seeded data directly
    // This contains all 10 cleaners we seeded into the database
    console.log('Returning seeded cleaner data:', mockCleaners.length);
    return NextResponse.json(mockCleaners);

  } catch (error) {
    console.warn('Unexpected error, using mock data:', error);
    return NextResponse.json(mockCleaners);
  }
}
