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

      // First try to fetch from WordPress API
      try {
        // WordPress API URL (using HTTP for direct server-side requests)
        const wpApiUrl = process.env.WORDPRESS_DIRECT_API_URL || 'http://wp.ajyxn.com/wp-json';

        // Build the WordPress API URL with filters
        let apiEndpoint = `${wpApiUrl}/wp/v2/property?per_page=12&page=${page}&_embed=true`;

        // Add filters if provided
        if (location) {
          apiEndpoint += `&filter[meta_query][0][key]=location&filter[meta_query][0][value]=${encodeURIComponent(location)}&filter[meta_query][0][compare]=LIKE`;
        }

        if (minPrice) {
          apiEndpoint += `&filter[meta_query][1][key]=price&filter[meta_query][1][value]=${encodeURIComponent(minPrice)}&filter[meta_query][1][compare]=>=&filter[meta_query][1][type]=NUMERIC`;
        }

        if (maxPrice) {
          apiEndpoint += `&filter[meta_query][2][key]=price&filter[meta_query][2][value]=${encodeURIComponent(maxPrice)}&filter[meta_query][2][compare]=<=&filter[meta_query][2][type]=NUMERIC`;
        }

        if (bedrooms && bedrooms !== 'any') {
          apiEndpoint += `&filter[meta_query][3][key]=bedrooms&filter[meta_query][3][value]=${encodeURIComponent(bedrooms)}&filter[meta_query][3][compare]=LIKE`;
        }

        if (bathrooms && bathrooms !== 'any') {
          apiEndpoint += `&filter[meta_query][4][key]=bathrooms&filter[meta_query][4][value]=${encodeURIComponent(bathrooms)}&filter[meta_query][4][compare]=LIKE`;
        }

        if (propertyType && propertyType !== 'any') {
          apiEndpoint += `&filter[meta_query][5][key]=property_type&filter[meta_query][5][value]=${encodeURIComponent(propertyType)}&filter[meta_query][5][compare]=LIKE`;
        }

        console.log(`Trying WordPress API: ${apiEndpoint}`);

        // Fetch with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(apiEndpoint, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          next: { revalidate: 300 } // Cache for 5 minutes
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`WordPress API returned ${response.status}: ${response.statusText}`);
        }

        // Get total pages from headers
        const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');
        const totalCount = parseInt(response.headers.get('X-WP-Total') || '0');

        const wpProperties = await response.json();

        // Transform WordPress properties to our format
        const transformedProperties = wpProperties.map((property: any) => {
          // Extract featured image URL
          let featuredImageUrl = '';
          const featuredMedia = property._embedded?.['wp:featuredmedia']?.[0];
          if (featuredMedia?.source_url) {
            featuredImageUrl = featuredMedia.source_url;
          }

          // Extract ACF fields
          const acf = property.acf || {};

          return {
            id: property.id?.toString() || '',
            title: property.title?.rendered || '',
            description: property.content?.rendered || '',
            location: acf.location || '',
            bedrooms: acf.bedrooms?.toString() || '0',
            bathrooms: acf.bathrooms?.toString() || '0',
            price: acf.price?.toString() || '0',
            currency: acf.currency || 'CNY',
            amenities: Array.isArray(acf.amenities) ? acf.amenities : ['WiFi', 'Parking', 'Security'],
            images: acf.images || (featuredImageUrl ? [featuredImageUrl] : ['/images/properties/property-placeholder.jpg']),
            propertyType: acf.property_type || 'apartment',
            isPremium: acf.is_premium || false
          };
        });

        console.log(`Successfully fetched ${transformedProperties.length} properties from WordPress API`);

        return NextResponse.json({
          properties: transformedProperties,
          totalCount: totalCount,
          totalPages: totalPages,
          currentPage: page
        });
      } catch (wpError) {
        console.error('WordPress API error:', wpError);
        console.log('Falling back to mock data...');

        // If WordPress API fails, use mock data
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
          currentPage: page,
          source: 'mock' // Indicate this is mock data
        };

        console.log(`API: Returning ${result.properties.length} mock properties out of ${result.totalCount} total`);

        return NextResponse.json(result);
      }
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
