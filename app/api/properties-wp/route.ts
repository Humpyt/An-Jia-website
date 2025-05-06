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

      console.log(`API: Fetching properties from WordPress page ${page} with filters:`,
        { location, minPrice, maxPrice, bedrooms, bathrooms, propertyType });

      // Try to fetch from WordPress API using the custom anjia/v1 namespace
      try {
        // WordPress API URL (using HTTP for direct server-side requests)
        const wpApiUrl = process.env.WORDPRESS_DIRECT_API_URL || 'http://wp.ajyxn.com/wp-json';
        
        // Build the WordPress API URL with filters
        let apiEndpoint = `${wpApiUrl}/anjia/v1/properties?page=${page}&per_page=12`;
        
        // Add filters if provided
        if (location) {
          apiEndpoint += `&location=${encodeURIComponent(location)}`;
        }
        
        if (minPrice) {
          apiEndpoint += `&min_price=${encodeURIComponent(minPrice)}`;
        }
        
        if (maxPrice) {
          apiEndpoint += `&max_price=${encodeURIComponent(maxPrice)}`;
        }
        
        if (bedrooms && bedrooms !== 'any') {
          apiEndpoint += `&bedrooms=${encodeURIComponent(bedrooms)}`;
        }
        
        if (bathrooms && bathrooms !== 'any') {
          apiEndpoint += `&bathrooms=${encodeURIComponent(bathrooms)}`;
        }
        
        if (propertyType && propertyType !== 'any') {
          apiEndpoint += `&property_type=${encodeURIComponent(propertyType)}`;
        }
        
        console.log(`Trying WordPress custom API: ${apiEndpoint}`);
        
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
        
        const data = await response.json();
        
        // Validate the response structure
        if (!data.properties || !Array.isArray(data.properties)) {
          throw new Error('Invalid response structure from WordPress API');
        }
        
        console.log(`Successfully fetched ${data.properties.length} properties from WordPress custom API`);
        
        return NextResponse.json({
          properties: data.properties,
          totalCount: data.total || data.properties.length,
          totalPages: data.total_pages || Math.ceil(data.properties.length / 12),
          currentPage: page,
          source: 'wordpress'
        });
      } catch (wpError) {
        console.error('WordPress custom API error:', wpError);
        
        // Try fallback URL if primary fails
        try {
          const fallbackUrl = process.env.WORDPRESS_FALLBACK_API_URL || 'http://199.188.200.71/wp-json';
          let fallbackEndpoint = `${fallbackUrl}/anjia/v1/properties?page=${page}&per_page=12`;
          
          // Add filters if provided
          if (location) {
            fallbackEndpoint += `&location=${encodeURIComponent(location)}`;
          }
          
          if (minPrice) {
            fallbackEndpoint += `&min_price=${encodeURIComponent(minPrice)}`;
          }
          
          if (maxPrice) {
            fallbackEndpoint += `&max_price=${encodeURIComponent(maxPrice)}`;
          }
          
          if (bedrooms && bedrooms !== 'any') {
            fallbackEndpoint += `&bedrooms=${encodeURIComponent(bedrooms)}`;
          }
          
          if (bathrooms && bathrooms !== 'any') {
            fallbackEndpoint += `&bathrooms=${encodeURIComponent(bathrooms)}`;
          }
          
          if (propertyType && propertyType !== 'any') {
            fallbackEndpoint += `&property_type=${encodeURIComponent(propertyType)}`;
          }
          
          console.log(`Trying fallback WordPress API: ${fallbackEndpoint}`);
          
          const fallbackResponse = await fetch(fallbackEndpoint, {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            }
          });
          
          if (!fallbackResponse.ok) {
            throw new Error(`Fallback WordPress API returned ${fallbackResponse.status}: ${fallbackResponse.statusText}`);
          }
          
          const fallbackData = await fallbackResponse.json();
          
          // Validate the response structure
          if (!fallbackData.properties || !Array.isArray(fallbackData.properties)) {
            throw new Error('Invalid response structure from fallback WordPress API');
          }
          
          console.log(`Successfully fetched ${fallbackData.properties.length} properties from fallback WordPress API`);
          
          return NextResponse.json({
            properties: fallbackData.properties,
            totalCount: fallbackData.total || fallbackData.properties.length,
            totalPages: fallbackData.total_pages || Math.ceil(fallbackData.properties.length / 12),
            currentPage: page,
            source: 'wordpress-fallback'
          });
        } catch (fallbackError) {
          console.error('Fallback WordPress API error:', fallbackError);
          console.log('Falling back to mock data...');
          
          // If both WordPress APIs fail, use mock data
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
      }
    } catch (error: any) {
      console.error('Error in properties-wp API:', error);
      
      // Use mock data in case of any error
      return NextResponse.json({
        properties: mockProperties.slice(0, 12),
        totalCount: mockProperties.length,
        totalPages: Math.ceil(mockProperties.length / 12),
        currentPage: 1,
        source: 'mock-error',
        error: error.message
      });
    }
  }
);
