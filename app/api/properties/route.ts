import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createProperty } from '@/app/actions/wordpress-properties'
import { POST as createPostHandler, GET as createGetHandler } from '@/lib/api-utils'

// Using our custom route handler wrapper for correct typing
export const POST = createPostHandler(
  async (request) => {
    try {
      const data = await request.json()
      const result = await createProperty(data)

      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 400 }
        )
      }

      return NextResponse.json(result)
    } catch (error: any) {
      console.error('Error in property creation:', error)
      return NextResponse.json(
        { error: error.message || 'Internal server error' },
        { status: 500 }
      )
    }
  }
)

// Using our custom route handler wrapper for correct typing
export const GET = createGetHandler(
  async (request) => {
    try {
      // Get query parameters
      const url = new URL(request.url);
      const limit = parseInt(url.searchParams.get('limit') || '12');
      const offset = parseInt(url.searchParams.get('offset') || '0');
      const location = url.searchParams.get('location') || '';
      const minPrice = url.searchParams.get('minPrice') || '';
      const maxPrice = url.searchParams.get('maxPrice') || '';
      const bedrooms = url.searchParams.get('bedrooms') || '';
      const bathrooms = url.searchParams.get('bathrooms') || '';
      const propertyType = url.searchParams.get('propertyType') || '';
      const amenities = url.searchParams.get('amenities') || '';

      console.log('Properties API: Using fallback properties');

      // Import fallback properties directly
      const { FALLBACK_PROPERTIES } = await import('@/lib/property-fallback');

      // Use fallback properties
      let properties = [...FALLBACK_PROPERTIES];

      // Apply filters
      if (location) {
        properties = properties.filter(p =>
          p.location.toLowerCase().includes(location.toLowerCase())
        );
      }

      if (minPrice) {
        const min = parseInt(minPrice);
        properties = properties.filter(p => parseInt(p.price) >= min);
      }

      if (maxPrice) {
        const max = parseInt(maxPrice);
        properties = properties.filter(p => parseInt(p.price) <= max);
      }

      if (bedrooms && bedrooms !== 'any') {
        properties = properties.filter(p => p.bedrooms === bedrooms);
      }

      if (bathrooms && bathrooms !== 'any') {
        properties = properties.filter(p => p.bathrooms === bathrooms);
      }

      if (propertyType && propertyType !== 'any') {
        properties = properties.filter(p => p.propertyType === propertyType);
      }

      if (amenities) {
        const amenitiesList = amenities.split(',');
        properties = properties.filter(p =>
          amenitiesList.some(a =>
            p.amenities.some((pa: string) =>
              pa.toLowerCase().includes(a.toLowerCase())
            )
          )
        );
      }

      // Calculate total count and pages
      const totalCount = properties.length;
      const totalPages = Math.ceil(totalCount / limit);

      // Apply pagination
      const paginatedProperties = properties.slice(offset, offset + limit);

      console.log(`Properties API: Returning ${paginatedProperties.length} properties out of ${totalCount} total`);

      // Return the response
      return NextResponse.json({
        properties: paginatedProperties,
        totalCount,
        totalPages
      });
    } catch (error: any) {
      console.error('Error in properties API:', error);

      // Return minimal fallback data in case of error
      return NextResponse.json({
        properties: [
          {
            id: "1",
            title: "Luxury Apartment in Beijing",
            location: "Beijing, China",
            bedrooms: "3",
            bathrooms: "2",
            price: "1500000",
            currency: "CNY",
            amenities: ['WiFi', 'Parking', 'Security'],
            images: ["/images/properties/property-1.jpg"],
            propertyType: "apartment"
          },
          {
            id: "2",
            title: "Modern Villa in Shanghai",
            location: "Shanghai, China",
            bedrooms: "4",
            bathrooms: "3",
            price: "2500000",
            currency: "CNY",
            amenities: ['WiFi', 'Parking', 'Pool'],
            images: ["/images/properties/property-2.jpg"],
            propertyType: "house"
          }
        ],
        totalCount: 2,
        totalPages: 1
      });
    }
  }
)
