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

      // WordPress API URL (using HTTP for direct server-side requests)
      const wpApiUrl = process.env.WORDPRESS_DIRECT_API_URL || 'http://wp.ajyxn.com/wp-json';

      // Log all environment variables for debugging
      console.log('Environment variables:');
      console.log('WORDPRESS_DIRECT_API_URL:', process.env.WORDPRESS_DIRECT_API_URL);
      console.log('WORDPRESS_FALLBACK_API_URL:', process.env.WORDPRESS_FALLBACK_API_URL);
      console.log('NEXT_PUBLIC_WORDPRESS_API_URL:', process.env.NEXT_PUBLIC_WORDPRESS_API_URL);

      console.log(`Fetching properties from: ${wpApiUrl}/wp/v2/property`);
      console.log('Query parameters:', {
        limit, offset, location, minPrice, maxPrice, bedrooms, bathrooms, propertyType, amenities
      });

      // Build query parameters
      let queryParams = new URLSearchParams({
        per_page: limit.toString(),
        offset: offset.toString(),
        _embed: 'true', // This ensures we get featured images and other embedded content
        _fields: 'id,title,acf,featured_media,_embedded,_links' // Only get the fields we need
      });

      // Add filters to query params
      if (location) {
        queryParams.append('acf_location', location);
      }

      if (minPrice) {
        queryParams.append('acf_min_price', minPrice);
      }

      if (maxPrice) {
        queryParams.append('acf_max_price', maxPrice);
      }

      if (bedrooms && bedrooms !== 'any') {
        queryParams.append('acf_bedrooms', bedrooms);
      }

      if (bathrooms && bathrooms !== 'any') {
        queryParams.append('acf_bathrooms', bathrooms);
      }

      if (propertyType && propertyType !== 'any') {
        queryParams.append('acf_property_type', propertyType);
      }

      if (amenities) {
        queryParams.append('acf_amenities', amenities);
      }

      // Try multiple approaches to fetch data
      let response;

      // First try: Direct WordPress API with custom fields
      try {
        console.log(`First attempt: ${wpApiUrl}/wp/v2/property?${queryParams.toString()}`);
        response = await fetch(`${wpApiUrl}/wp/v2/property?${queryParams.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          next: { revalidate: 300 } // Cache for 5 minutes
        });

        if (!response.ok) {
          throw new Error(`WordPress API returned ${response.status}: ${response.statusText}`);
        }

        console.log('First attempt successful');
      } catch (firstError) {
        console.error('First attempt failed:', firstError);

        // Second try: Use the custom endpoint for all properties
        try {
          console.log(`Second attempt: ${wpApiUrl}/anjia/v1/properties`);
          response = await fetch(`${wpApiUrl}/anjia/v1/properties`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            }
          });

          if (!response.ok) {
            throw new Error(`Custom endpoint returned ${response.status}: ${response.statusText}`);
          }

          console.log('Second attempt successful');
        } catch (secondError) {
          console.error('Second attempt failed:', secondError);

          // Third try: Standard WordPress API without custom fields
          console.log(`Third attempt: ${wpApiUrl}/wp/v2/property?per_page=${limit}&_embed=true`);
          response = await fetch(`${wpApiUrl}/wp/v2/property?per_page=${limit}&_embed=true`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            }
          });

          if (!response.ok) {
            throw new Error(`Standard WordPress API returned ${response.status}: ${response.statusText}`);
          }

          console.log('Third attempt successful');
        }
      }

      // If all attempts fail, try the fallback URL
      if (!response || !response.ok) {
        console.error(`All WordPress API attempts failed. Trying fallback URL.`);

        try {
          // Try fallback URL if primary fails
          const fallbackUrl = process.env.WORDPRESS_FALLBACK_API_URL || 'http://199.188.200.71/wp-json';
          console.log(`Trying fallback URL: ${fallbackUrl}/wp/v2/property`);

          // Try multiple approaches with the fallback URL
          let fallbackResponse;

          // First try with fallback URL
          try {
            console.log(`Fallback first attempt: ${fallbackUrl}/wp/v2/property?${queryParams.toString()}`);
            fallbackResponse = await fetch(`${fallbackUrl}/wp/v2/property?${queryParams.toString()}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              }
            });

            if (!fallbackResponse.ok) {
              throw new Error(`Fallback WordPress API returned ${fallbackResponse.status}: ${fallbackResponse.statusText}`);
            }
          } catch (fallbackFirstError) {
            console.error('Fallback first attempt failed:', fallbackFirstError);

            // Second try with fallback URL
            console.log(`Fallback second attempt: ${fallbackUrl}/wp/v2/property?per_page=${limit}&_embed=true`);
            fallbackResponse = await fetch(`${fallbackUrl}/wp/v2/property?per_page=${limit}&_embed=true`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              }
            });
          }

          if (!fallbackResponse.ok) {
            throw new Error(`All fallback attempts failed`);
          }

          // Use the fallback response
          const fallbackData = await fallbackResponse.json();
          const fallbackTotalCount = parseInt(fallbackResponse.headers.get('X-WP-Total') || '0');
          const fallbackTotalPages = parseInt(fallbackResponse.headers.get('X-WP-TotalPages') || '0');

          console.log(`Successfully fetched ${fallbackData.length} properties from fallback URL`);

          // Transform the properties
          const transformedFallbackProperties = await Promise.all(
            fallbackData.map(async (property: any) => {
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
                location: acf.location || '',
                bedrooms: acf.bedrooms?.toString() || '0',
                bathrooms: acf.bathrooms?.toString() || '0',
                price: acf.price?.toString() || '0',
                currency: acf.currency || 'CNY',
                amenities: Array.isArray(acf.amenities) ? acf.amenities : ['WiFi', 'Parking', 'Security'],
                images: featuredImageUrl ? [featuredImageUrl] : ['/images/properties/property-1.jpg'],
                propertyType: acf.property_type || 'apartment'
              };
            })
          );

          return NextResponse.json({
            properties: transformedFallbackProperties,
            totalCount: fallbackTotalCount,
            totalPages: fallbackTotalPages
          });
        } catch (fallbackError) {
          console.error('All fallback attempts failed:', fallbackError);

          // Return hardcoded fallback data in case of error
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

      // Get the total count of properties from the headers
      const totalCount = parseInt(response.headers.get('X-WP-Total') || '0');
      const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0');

      // Get the response data
      const properties = await response.json();

      // Transform the properties
      const transformedProperties = await Promise.all(
        properties.map(async (property: any) => {
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
            location: acf.location || '',
            bedrooms: acf.bedrooms?.toString() || '0',
            bathrooms: acf.bathrooms?.toString() || '0',
            price: acf.price?.toString() || '0',
            currency: acf.currency || 'CNY',
            amenities: Array.isArray(acf.amenities) ? acf.amenities : ['WiFi', 'Parking', 'Security'],
            images: featuredImageUrl ? [featuredImageUrl] : ['/images/properties/property-1.jpg'],
            propertyType: acf.property_type || 'apartment'
          };
        })
      );

      // Return the response
      return NextResponse.json({
        properties: transformedProperties,
        totalCount,
        totalPages
      });
    } catch (error: any) {
      console.error('Error in properties proxy:', error);

      // Return fallback data in case of error
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
