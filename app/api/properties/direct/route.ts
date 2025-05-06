import { NextResponse } from 'next/server';
import { GET as createGetHandler } from '@/lib/api-utils';

// Using our custom route handler wrapper for correct typing
export const GET = createGetHandler(
  async (request) => {
    try {
      // Get query parameters
      const url = new URL(request.url);
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '12');
      const offset = ((page - 1) * limit) || parseInt(url.searchParams.get('offset') || '0');
      const location = url.searchParams.get('location') || '';
      const minPrice = url.searchParams.get('minPrice') || '';
      const maxPrice = url.searchParams.get('maxPrice') || '';
      const bedrooms = url.searchParams.get('bedrooms') || '';
      const bathrooms = url.searchParams.get('bathrooms') || '';
      const propertyType = url.searchParams.get('propertyType') || '';
      const amenities = url.searchParams.get('amenities') || '';
      const cacheBust = url.searchParams.get('cacheBust') || '';

      console.log(`Direct Properties API: Request received with params:`, {
        page, limit, offset, location, minPrice, maxPrice,
        bedrooms, bathrooms, propertyType, amenities, cacheBust
      });

      // Try to import property data from multiple possible sources
      let allProperties = [];

      try {
        // First try to import from property-data.js
        const propertyDataModule = await import('@/lib/property-data');
        allProperties = propertyDataModule.properties || [];
        console.log(`Successfully imported ${allProperties.length} properties from property-data.js`);
      } catch (importError) {
        console.error('Error importing from property-data.js:', importError);

        try {
          // Then try to import from property-fallback.js
          const fallbackModule = await import('@/lib/property-fallback');
          allProperties = fallbackModule.FALLBACK_PROPERTIES || [];
          console.log(`Successfully imported ${allProperties.length} properties from property-fallback.js`);
        } catch (fallbackError) {
          console.error('Error importing from property-fallback.js:', fallbackError);
        }
      }

      // Ensure we have properties data
      if (!allProperties || allProperties.length === 0) {
        console.log('Property data not available, using hardcoded default properties');
        allProperties = [
          {
            id: "1",
            title: "Luxury Apartment in Beijing",
            location: "Beijing, China",
            bedrooms: "3",
            bathrooms: "2",
            price: "1500000",
            currency: "CNY",
            amenities: ['WiFi', 'Parking', 'Security'],
            images: ["/images/properties/property-placeholder.svg"],
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
            images: ["/images/properties/property-placeholder.svg"],
            propertyType: "house"
          }
        ];
      }

      console.log(`Direct Properties API: Starting with ${allProperties.length} properties`);

      // Create a copy of the properties array to avoid modifying the original
      let filteredProperties = [...allProperties];

      // Apply filters
      if (location) {
        filteredProperties = filteredProperties.filter(p =>
          p.location.toLowerCase().includes(location.toLowerCase())
        );
        console.log(`After location filter: ${filteredProperties.length} properties`);
      }

      if (minPrice) {
        const min = parseInt(minPrice);
        filteredProperties = filteredProperties.filter(p => parseInt(p.price) >= min);
        console.log(`After minPrice filter: ${filteredProperties.length} properties`);
      }

      if (maxPrice) {
        const max = parseInt(maxPrice);
        filteredProperties = filteredProperties.filter(p => parseInt(p.price) <= max);
        console.log(`After maxPrice filter: ${filteredProperties.length} properties`);
      }

      if (bedrooms && bedrooms !== 'any') {
        filteredProperties = filteredProperties.filter(p => p.bedrooms === bedrooms);
        console.log(`After bedrooms filter: ${filteredProperties.length} properties`);
      }

      if (bathrooms && bathrooms !== 'any') {
        filteredProperties = filteredProperties.filter(p => p.bathrooms === bathrooms);
        console.log(`After bathrooms filter: ${filteredProperties.length} properties`);
      }

      if (propertyType && propertyType !== 'any') {
        filteredProperties = filteredProperties.filter(p => p.propertyType === propertyType);
        console.log(`After propertyType filter: ${filteredProperties.length} properties`);
      }

      if (amenities) {
        const amenitiesList = amenities.split(',');
        filteredProperties = filteredProperties.filter(p =>
          amenitiesList.some(a =>
            p.amenities.some((pa: string) =>
              pa.toLowerCase().includes(a.toLowerCase())
            )
          )
        );
        console.log(`After amenities filter: ${filteredProperties.length} properties`);
      }

      // Calculate total count and pages
      const totalCount = filteredProperties.length;
      const totalPages = Math.ceil(totalCount / limit);

      // Apply pagination
      const paginatedProperties = filteredProperties.slice(offset, offset + limit);

      console.log(`Direct Properties API: Returning ${paginatedProperties.length} properties out of ${totalCount} total (page ${page} of ${totalPages})`);

      // Return the response
      return NextResponse.json({
        properties: paginatedProperties,
        totalCount,
        totalPages,
        currentPage: page
      });
    } catch (error: any) {
      console.error('Error in direct properties API:', error);

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
            images: ["/images/properties/property-placeholder.svg"],
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
            images: ["/images/properties/property-placeholder.svg"],
            propertyType: "house"
          }
        ],
        totalCount: 2,
        totalPages: 1,
        currentPage: 1,
        error: error.message || 'An error occurred while fetching properties'
      });
    }
  }
);
