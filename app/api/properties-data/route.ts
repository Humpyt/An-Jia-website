import { NextRequest, NextResponse } from 'next/server';
import { GET as createGetHandler } from '@/lib/api-utils';
import { properties as staticProperties } from '@/lib/property-data';

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
      
      // WordPress API URL (using HTTP for direct server-side requests)
      const wpApiUrl = process.env.WORDPRESS_DIRECT_API_URL || 'http://wp.ajyxn.com/wp-json';
      
      // Build the WordPress API URL with query parameters
      let wpEndpoint = `${wpApiUrl}/anjia/v1/properties?page=${page}`;
      
      if (location) wpEndpoint += `&location=${encodeURIComponent(location)}`;
      if (minPrice) wpEndpoint += `&min_price=${encodeURIComponent(minPrice)}`;
      if (maxPrice) wpEndpoint += `&max_price=${encodeURIComponent(maxPrice)}`;
      if (bedrooms && bedrooms !== 'any') wpEndpoint += `&bedrooms=${encodeURIComponent(bedrooms)}`;
      if (bathrooms && bathrooms !== 'any') wpEndpoint += `&bathrooms=${encodeURIComponent(bathrooms)}`;
      if (propertyType && propertyType !== 'any') wpEndpoint += `&property_type=${encodeURIComponent(propertyType)}`;
      
      console.log(`Fetching properties from: ${wpEndpoint}`);

      // Forward the request to WordPress
      const response = await fetch(wpEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        next: { revalidate: 300 } // Cache for 5 minutes
      });

      if (!response.ok) {
        console.error(`WordPress API error: ${response.status} ${response.statusText}`);

        // Try fallback URL if primary fails
        const fallbackUrl = process.env.WORDPRESS_FALLBACK_API_URL || 'http://199.188.200.71/wp-json';
        const fallbackEndpoint = wpEndpoint.replace(wpApiUrl, fallbackUrl);
        
        console.log(`Trying fallback URL: ${fallbackEndpoint}`);

        const fallbackResponse = await fetch(fallbackEndpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });

        if (!fallbackResponse.ok) {
          console.error(`Fallback API error: ${fallbackResponse.status} ${fallbackResponse.statusText}`);
          // If both API calls fail, use static data
          return getStaticPropertiesResponse(searchParams);
        }

        const fallbackData = await fallbackResponse.json();
        return NextResponse.json(fallbackData);
      }

      // Get the response data
      const data = await response.json();
      
      // Validate the response data
      if (!data || !Array.isArray(data.properties)) {
        console.error('Invalid API response format:', data);
        // Use static data if response format is invalid
        return getStaticPropertiesResponse(searchParams);
      }

      // Return the response
      return NextResponse.json(data);
    } catch (error: any) {
      console.error('Error in properties data proxy:', error);
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
