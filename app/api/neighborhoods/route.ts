import { NextResponse } from 'next/server';
import { fetchWithTimeout } from '@/lib/wordpress';

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://anjia-wordpress.local/wp-json';

export async function GET() {
  try {
    // Fetch all neighborhoods from WordPress
    const response = await fetchWithTimeout(`${WORDPRESS_API_URL}/wp/v2/neighborhood`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    const neighborhoods = await response.json();

    // Transform the data to match our frontend structure
    const transformedNeighborhoods = await Promise.all(neighborhoods.map(async (neighborhood: any) => {
      // Get property count for this neighborhood
      const propertiesResponse = await fetchWithTimeout(
        `${WORDPRESS_API_URL}/wp/v2/property?neighborhood=${neighborhood.id}&per_page=1`,
        {
          next: { revalidate: 3600 }
        }
      );
      const propertyCount = parseInt(propertiesResponse.headers.get('X-WP-Total') || '0');

      // Get the average price for this neighborhood
      const avgPriceResponse = await fetchWithTimeout(
        `${WORDPRESS_API_URL}/anjia/v1/neighborhoods/${neighborhood.id}/stats`,
        {
          next: { revalidate: 3600 }
        }
      );
      const stats = await avgPriceResponse.json();

      return {
        id: neighborhood.id,
        name: neighborhood.name.rendered,
        description: neighborhood.description || neighborhood.excerpt.rendered,
        image: neighborhood.acf?.featured_image?.url || '/placeholder.svg',
        properties: propertyCount,
        averagePrice: stats.average_price || 0,
        stats: {
          safetyRating: neighborhood.acf?.safety_rating || 0,
          nearbyAmenities: neighborhood.acf?.nearby_amenities || [],
          transportation: neighborhood.acf?.transportation || [],
          schoolsFacilities: neighborhood.acf?.schools_facilities || []
        }
      };
    }));

    return NextResponse.json({ neighborhoods: transformedNeighborhoods });
  } catch (error) {
    console.error('Error fetching neighborhoods:', error);
    return NextResponse.json(
      { error: 'Failed to fetch neighborhoods' },
      { status: 500 }
    );
  }
}
