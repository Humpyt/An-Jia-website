import { NextResponse } from 'next/server';
import { getPropertiesWithFilters } from '@/lib/wordpress';

export async function GET() {
  try {
    // Get latest properties, limit to 12, sorted by newest first
    const properties = await getPropertiesWithFilters({
      limit: 12,
      orderBy: 'date',
      order: 'desc'
    });

    return NextResponse.json({ properties });
  } catch (error) {
    console.error('Error fetching latest properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latest properties' },
      { status: 500 }
    );
  }
}
