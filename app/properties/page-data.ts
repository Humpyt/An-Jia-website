/**
 * Properties Page Data Provider
 *
 * This file provides initial data for the properties page to ensure
 * there's always data available even if API calls fail.
 */

import { properties as mockProperties } from '@/lib/property-data';
import { FALLBACK_PROPERTIES } from '@/lib/property-fallback';

// Function to get initial properties data for server-side rendering
export async function getInitialPropertiesData() {
  try {
    console.log('Server: Fetching initial properties data');

    // Use mock data directly to avoid WordPress API issues
    // This is a reliable approach that works on Vercel
    const properties = mockProperties;

    // Apply pagination
    const page = 1;
    const limit = 12;

    // Calculate total count and pages
    const totalCount = properties.length;
    const totalPages = Math.ceil(totalCount / limit);

    // Get paginated properties
    const paginatedProperties = properties.slice(0, limit);

    console.log(`Server: Successfully prepared ${paginatedProperties.length} properties out of ${totalCount} total`);

    return {
      properties: paginatedProperties,
      totalCount: totalCount,
      totalPages: totalPages,
      currentPage: page,
      error: null
    };
  } catch (error) {
    console.error('Error getting initial properties data:', error);

    // Use fallback properties from property-fallback.js
    try {
      console.log('Server: Using fallback properties');

      // Apply pagination
      const page = 1;
      const limit = 12;
      const offset = 0;

      // Calculate total count and pages
      const totalCount = FALLBACK_PROPERTIES.length;
      const totalPages = Math.ceil(totalCount / limit);

      // Get paginated properties
      const paginatedProperties = FALLBACK_PROPERTIES.slice(offset, offset + limit);

      return {
        properties: paginatedProperties,
        totalCount,
        totalPages,
        currentPage: page,
        error: null
      };
    } catch (fallbackError) {
      console.error('Error using fallback properties:', fallbackError);

      // Return minimal fallback data in case of error
      return {
        properties: [
          {
            id: "1",
            title: "Modern 3 Bedroom Apartment in Downtown",
            location: "Downtown",
            bedrooms: "3",
            bathrooms: "2",
            price: "350000",
            currency: "USD",
            amenities: ['WiFi', 'Parking', 'Security'],
            images: ["/images/properties/property-placeholder.svg"],
            propertyType: "apartment"
          },
          {
            id: "2",
            title: "Luxury Villa with 5 Bedrooms in Westlands",
            location: "Westlands",
            bedrooms: "5",
            bathrooms: "3",
            price: "750000",
            currency: "USD",
            amenities: ['WiFi', 'Parking', 'Pool'],
            images: ["/images/properties/property-placeholder.svg"],
            propertyType: "house"
          }
        ],
        totalCount: 2,
        totalPages: 1,
        currentPage: 1,
        error: null
      };
    }
  }
}
