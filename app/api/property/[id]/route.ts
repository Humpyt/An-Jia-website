import { NextResponse } from 'next/server';
import { GET as createGetHandler } from '@/lib/api-utils';
import { getPropertyById } from '@/lib/property-service';

/**
 * Consolidated API endpoint for property data
 * This endpoint handles all property data fetching with proper error handling and fallbacks
 */
export const GET = createGetHandler(
  async (request, { params }) => {
    try {
      // Get the property ID from the URL parameters
      const id = params?.id;

      if (!id) {
        return NextResponse.json(
          { error: 'Property ID is required' },
          { status: 400 }
        );
      }

      // Check if we should skip cache
      const { searchParams } = new URL(request.url);
      const skipCache = searchParams.get('skipCache') === 'true';

      console.log(`[PROPERTY-API] Fetching property with ID: ${id}, skipCache: ${skipCache}`);

      // Use the centralized property service to get property details
      // This handles all data sources and fallbacks
      const property = await getPropertyById(id, skipCache);

      if (!property) {
        return NextResponse.json(
          { error: 'Property not found' },
          { status: 404 }
        );
      }

      console.log(`[PROPERTY-API] Successfully retrieved property for ID: ${id}`);

      // Return the response
      return NextResponse.json({ 
        property,
        source: property._source || 'unknown',
        timestamp: Date.now()
      });
    } catch (error: any) {
      console.error('[PROPERTY-API] Error in property API route:', error);

      // Return a proper error response
      return NextResponse.json(
        { 
          error: error.message || 'Internal Server Error',
          timestamp: Date.now()
        },
        { status: error.status || 500 }
      );
    }
  }
);
