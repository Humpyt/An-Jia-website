import { NextRequest, NextResponse } from 'next/server';
import { GET as createGetHandler } from '@/lib/api-utils';
import { properties as mockProperties } from '@/lib/property-data';

// Using our custom route handler wrapper for correct typing
export const GET = createGetHandler(
  async (request) => {
    try {
      // Get query parameters
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get('page') || '1');
      const location = searchParams.get('location');
      const minPrice = searchParams.get('minPrice');
      const maxPrice = searchParams.get('maxPrice');
      const bedrooms = searchParams.get('bedrooms');
      const bathrooms = searchParams.get('bathrooms');
      const propertyType = searchParams.get('propertyType');

      console.log(`API: Fetching properties page ${page} with filters:`,
        { location, minPrice, maxPrice, bedrooms, bathrooms, propertyType });

      // Use mock data directly to avoid WordPress API issues
      // This is a reliable approach that works on Vercel
      let filteredProperties = [...mockProperties];

      // Apply filters
      if (location) {
        filteredProperties = filteredProperties.filter(p =>
          p.location.toLowerCase().includes(location.toLowerCase())
        );
      }

      if (minPrice) {
        const min = parseInt(minPrice);
        filteredProperties = filteredProperties.filter(p => parseInt(p.price) >= min);
      }

      if (maxPrice) {
        const max = parseInt(maxPrice);
        filteredProperties = filteredProperties.filter(p => parseInt(p.price) <= max);
      }

      if (bedrooms && bedrooms !== 'any') {
        filteredProperties = filteredProperties.filter(p => p.bedrooms === bedrooms);
      }

      if (bathrooms && bathrooms !== 'any') {
        filteredProperties = filteredProperties.filter(p => p.bathrooms === bathrooms);
      }

      if (propertyType && propertyType !== 'any') {
        filteredProperties = filteredProperties.filter(p => p.propertyType === propertyType);
      }

      // Apply pagination
      const limit = 12;
      const offset = (page - 1) * limit;
      const paginatedProperties = filteredProperties.slice(offset, offset + limit);

      const result = {
        properties: paginatedProperties,
        totalCount: filteredProperties.length,
        totalPages: Math.ceil(filteredProperties.length / limit),
        currentPage: page
      };

      console.log(`API: Returning ${result.properties.length} properties out of ${result.totalCount} total`);

      // Return the response
      return NextResponse.json(result);
    } catch (error: any) {
      console.error('Error in properties data API:', error);

      // Use static data in case of any error
      return getStaticPropertiesResponse(new URLSearchParams(request.url.split('?')[1]));
    }
  }
);

// Helper function to get static properties with filtering and pagination
function getStaticPropertiesResponse(searchParams: URLSearchParams) {
  try {
    // Get query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const location = searchParams.get('location');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const bedrooms = searchParams.get('bedrooms');
    const bathrooms = searchParams.get('bathrooms');
    const propertyType = searchParams.get('propertyType');

    // Apply filters to static properties
    let filteredProperties = [...staticProperties];

    if (location) {
      filteredProperties = filteredProperties.filter(p =>
        p.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (minPrice) {
      const min = parseInt(minPrice);
      filteredProperties = filteredProperties.filter(p => parseInt(p.price) >= min);
    }

    if (maxPrice) {
      const max = parseInt(maxPrice);
      filteredProperties = filteredProperties.filter(p => parseInt(p.price) <= max);
    }

    if (bedrooms && bedrooms !== 'any') {
      filteredProperties = filteredProperties.filter(p => p.bedrooms === bedrooms);
    }

    if (bathrooms && bathrooms !== 'any') {
      filteredProperties = filteredProperties.filter(p => p.bathrooms === bathrooms);
    }

    if (propertyType && propertyType !== 'any') {
      filteredProperties = filteredProperties.filter(p => p.propertyType === propertyType);
    }

    // Apply pagination
    const limit = 12;
    const offset = (page - 1) * limit;
    const paginatedProperties = filteredProperties.slice(offset, offset + limit);

    // Return formatted response
    return NextResponse.json({
      properties: paginatedProperties,
      totalCount: filteredProperties.length,
      totalPages: Math.ceil(filteredProperties.length / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Error processing static properties:', error);

    // Return minimal fallback data in case of error
    return NextResponse.json({
      properties: staticProperties.slice(0, 12),
      totalCount: staticProperties.length,
      totalPages: Math.ceil(staticProperties.length / 12),
      currentPage: 1
    });
  }
}
