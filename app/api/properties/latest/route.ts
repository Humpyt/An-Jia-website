import { NextResponse } from 'next/server';
import { properties as mockProperties } from '@/lib/property-data';
import { GET as createGetHandler } from '@/lib/api-utils';

// Using our custom route handler wrapper for correct typing
export const GET = createGetHandler(
  async () => {
    try {
      // WordPress API URL (using HTTP for direct server-side requests)
      const wpApiUrl = process.env.WORDPRESS_DIRECT_API_URL || 'http://wp.ajyxn.com/wp-json';

      console.log(`Fetching latest properties from: ${wpApiUrl}/anjia/v1/latest-properties`);

      // First try the custom endpoint for latest properties
      const response = await fetch(`${wpApiUrl}/anjia/v1/latest-properties`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        next: { revalidate: 300 } // Cache for 5 minutes
      });

      if (!response.ok) {
        console.error(`Custom endpoint error: ${response.status} ${response.statusText}`);

        // If custom endpoint fails, try the standard WP API with date sorting
        console.log(`Trying standard WP API: ${wpApiUrl}/wp/v2/property`);

        const standardResponse = await fetch(`${wpApiUrl}/wp/v2/property?per_page=12&_embed=true&orderby=date&order=desc`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });

        if (!standardResponse.ok) {
          throw new Error(`WordPress API returned ${standardResponse.status}: ${standardResponse.statusText}`);
        }

        const properties = await standardResponse.json();

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
              paymentTerms: acf.payment_terms || 'Monthly',
              amenities: Array.isArray(acf.amenities) ? acf.amenities : ['WiFi', 'Parking', 'Security'],
              images: featuredImageUrl ? [featuredImageUrl] : ['/images/properties/property-1.jpg'],
              featured_image: featuredImageUrl || '/images/properties/property-1.jpg',
              propertyType: acf.property_type || 'apartment',
              isPremium: acf.is_premium || false,
              description: property.content?.rendered || ''
            };
          })
        );

        console.log(`Successfully fetched ${transformedProperties.length} properties from standard WP API`);
        return NextResponse.json({ properties: transformedProperties });
      }

      // If we get here, the custom endpoint worked
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        console.log(`Successfully fetched ${data.length} properties from custom endpoint`);
        return NextResponse.json({ properties: data });
      }

      throw new Error('Custom endpoint returned empty or invalid data');
    } catch (error: any) {
      console.error('Error fetching latest properties:', error);

      // Try fallback URL if primary fails
      try {
        const fallbackUrl = process.env.WORDPRESS_FALLBACK_API_URL || 'http://199.188.200.71/wp-json';
        console.log(`Trying fallback URL: ${fallbackUrl}/wp/v2/property`);

        const fallbackResponse = await fetch(`${fallbackUrl}/wp/v2/property?per_page=12&_embed=true&orderby=date&order=desc`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });

        if (!fallbackResponse.ok) {
          throw new Error(`Fallback API returned ${fallbackResponse.status}: ${fallbackResponse.statusText}`);
        }

        const fallbackProperties = await fallbackResponse.json();

        // Transform the properties
        const transformedFallbackProperties = await Promise.all(
          fallbackProperties.map(async (property: any) => {
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
              paymentTerms: acf.payment_terms || 'Monthly',
              amenities: Array.isArray(acf.amenities) ? acf.amenities : ['WiFi', 'Parking', 'Security'],
              images: featuredImageUrl ? [featuredImageUrl] : ['/images/properties/property-1.jpg'],
              featured_image: featuredImageUrl || '/images/properties/property-1.jpg',
              propertyType: acf.property_type || 'apartment',
              isPremium: acf.is_premium || false,
              description: property.content?.rendered || ''
            };
          })
        );

        console.log(`Successfully fetched ${transformedFallbackProperties.length} properties from fallback API`);
        return NextResponse.json({ properties: transformedFallbackProperties });
      } catch (fallbackError) {
        console.error('Fallback API also failed:', fallbackError);

        // Use mock data as final fallback
        console.log('Using mock data as final fallback');

        // Transform mock data to match the expected format
        const fallbackProperties = mockProperties.slice(0, 12).map(property => ({
          id: property.id,
          title: property.title,
          location: property.location,
          price: property.price,
          currency: property.currency,
          paymentTerms: property.paymentTerms || 'Monthly',
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms || property.bedrooms, // Use bedrooms as fallback for bathrooms
          images: property.images,
          featured_image: property.images && property.images.length > 0 ? property.images[0] : '/images/properties/property-1.jpg',
          isPremium: property.isPremium || false,
          description: property.description || '',
          amenities: property.amenities || ['WiFi', 'Parking', 'Security'],
          propertyType: property.propertyType || 'apartment'
        }));

        return NextResponse.json({
          properties: fallbackProperties,
          error: 'WordPress API error, using fallback data'
        });
      }
    }
  }
)
