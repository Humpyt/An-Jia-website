import { NextRequest, NextResponse } from 'next/server';
import { GET as createGetHandler } from '@/lib/api-utils';

// Using our custom route handler wrapper for correct typing
export const GET = createGetHandler(
  async (request) => {
    try {
      // WordPress API URL (using HTTP for direct server-side requests)
      const wpApiUrl = process.env.WORDPRESS_DIRECT_API_URL || 'http://wp.ajyxn.com/wp-json';

      console.log(`Fetching featured properties from: ${wpApiUrl}/anjia/v1/featured-properties`);

      // Forward the request to WordPress
      const response = await fetch(`${wpApiUrl}/anjia/v1/featured-properties`, {
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
        console.log(`Trying fallback URL: ${fallbackUrl}/anjia/v1/featured-properties`);

        const fallbackResponse = await fetch(`${fallbackUrl}/anjia/v1/featured-properties`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });

        if (!fallbackResponse.ok) {
          throw new Error(`WordPress API returned ${response.status}: ${response.statusText}`);
        }

        const fallbackData = await fallbackResponse.json();
        return NextResponse.json(fallbackData);
      }

      // Get the response data
      const data = await response.json();

      // Return the response
      return NextResponse.json(data);
    } catch (error: any) {
      console.error('Error in featured properties proxy:', error);

      // Return fallback data in case of error
      return NextResponse.json(
        [
          {
            id: "1",
            title: "Luxury Apartment in Kampala",
            location: "Kampala, Uganda",
            bedrooms: "3",
            bathrooms: "2",
            price: "1500",
            currency: "USD",
            featured_image: "/images/properties/property-1.jpg"
          },
          {
            id: "2",
            title: "Modern Villa with Pool",
            location: "Entebbe, Uganda",
            bedrooms: "4",
            bathrooms: "3",
            price: "2500",
            currency: "USD",
            featured_image: "/images/properties/property-2.jpg"
          }
        ]
      );
    }
  }
);
