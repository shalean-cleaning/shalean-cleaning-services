import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';

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

    const { data, error } = await query;

    if (error) {
      console.warn('Supabase error:', error.message);
      return NextResponse.json({ error: 'Failed to fetch areas' }, { status: 500 });
    }

    // Transform suburbs to areas format for PRD compliance
    const areas = (data || []).map(suburb => ({
      id: suburb.id,
      slug: suburb.name.toLowerCase().replace(/\s+/g, '-'),
      name: suburb.name,
      price_adjustment_pct: 0, // Default for now
      region_id: suburb.region_id,
      is_active: suburb.is_active,
      region: suburb.regions
    }));

    return NextResponse.json(areas);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
