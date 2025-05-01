import { NextResponse } from 'next/server';
import { getPropertiesWithFilters } from '@/lib/wordpress';

export async function GET() {
  try {
    // Get premium properties, limit to 6, sorted by newest first
    const properties = await getPropertiesWithFilters({
      limit: 6,
      filters: {
        is_premium: true
      },
      orderBy: 'date',
      order: 'desc'
    });

    return NextResponse.json({ properties });
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured properties' },
      { status: 500 }
    );
  }
}
