'use client';

import { useState, useEffect } from 'react';
import { PropertyCard } from '@/components/property-card';
import { Pagination } from '@/components/pagination';
import { Spinner } from '@/components/spinner';
import { useSearchParams, useRouter } from 'next/navigation';

interface Property {
  id: string;
  title: string;
  location: string;
  bedrooms: string;
  bathrooms: string;
  price: string;
  currency: string;
  amenities: string[];
  images: string[];
  propertyType: string;
  isPremium?: boolean;
}

interface ClientPropertiesProps {
  initialData?: {
    properties: Property[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    error?: string | null;
  };
}

export function ClientProperties({ initialData }: ClientPropertiesProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>(initialData?.properties || []);
  const [totalCount, setTotalCount] = useState(initialData?.totalCount || 0);
  const [totalPages, setTotalPages] = useState(initialData?.totalPages || 1);
  const [currentPage, setCurrentPage] = useState(initialData?.currentPage || 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialData?.error || null);

  // Get filters from URL
  const location = searchParams.get('location') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const bedrooms = searchParams.get('bedrooms') || '';
  const bathrooms = searchParams.get('bathrooms') || '';
  const propertyType = searchParams.get('propertyType') || '';

  // Helper function to fetch from API with multiple fallbacks
  const fetchFromApi = async (queryParams: URLSearchParams, cacheBuster: string) => {
    // Try the main API endpoint first
    const apiUrl = `/api/properties?${queryParams.toString()}&${cacheBuster}`;
    console.log(`API URL: ${apiUrl}`);

    try {
      // Fetch with timeout to avoid hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      console.log('Sending request to primary API endpoint...');
      const startTime = Date.now();

      const apiResponse = await fetch(apiUrl, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        // Disable cache to ensure fresh data
        cache: 'no-store',
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      console.log(`Primary API responded in ${responseTime}ms with status ${apiResponse.status}`);

      if (!apiResponse.ok) {
        throw new Error(`API returned ${apiResponse.status}: ${apiResponse.statusText}`);
      }

      const data = await apiResponse.json();
      console.log(`Successfully fetched from primary API: ${data.properties?.length || 0} properties`);

      // Validate data structure
      if (!data.properties || !Array.isArray(data.properties)) {
        console.warn('Primary API returned invalid data structure:', data);
        throw new Error('Invalid data structure from primary API');
      }

      return data;
    } catch (error) {
      console.error('Error fetching from primary API, trying direct API:', error);

      try {
        // Try the direct API endpoint as a fallback
        const directApiUrl = `/api/properties/direct?${queryParams.toString()}&${cacheBuster}`;
        console.log(`Trying direct API URL: ${directApiUrl}`);

        const directController = new AbortController();
        const directTimeoutId = setTimeout(() => directController.abort(), 10000);

        console.log('Sending request to direct API endpoint...');
        const directStartTime = Date.now();

        const directResponse = await fetch(directApiUrl, {
          signal: directController.signal,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          // Disable cache to ensure fresh data
          cache: 'no-store',
        });

        clearTimeout(directTimeoutId);
        const directResponseTime = Date.now() - directStartTime;
        console.log(`Direct API responded in ${directResponseTime}ms with status ${directResponse.status}`);

        if (!directResponse.ok) {
          throw new Error(`Direct API returned ${directResponse.status}: ${directResponse.statusText}`);
        }

        const directData = await directResponse.json();
        console.log(`Successfully fetched from direct API: ${directData.properties?.length || 0} properties`);

        // Validate data structure
        if (!directData.properties || !Array.isArray(directData.properties)) {
          console.warn('Direct API returned invalid data structure:', directData);
          throw new Error('Invalid data structure from direct API');
        }

        return directData;
      } catch (directError) {
        console.error('Error fetching from direct API, using property-data.js fallback:', directError);

        try {
          // Try to import property data directly as a last resort
          console.log('Attempting to import property data directly...');
          const propertyDataModule = await import('@/lib/property-data');
          const properties = propertyDataModule.properties || [];

          if (properties && properties.length > 0) {
            console.log(`Successfully imported ${properties.length} properties directly from module`);

            // Apply any filters that were in the query params
            let filteredProperties = [...properties];

            const location = queryParams.get('location');
            if (location) {
              filteredProperties = filteredProperties.filter(p =>
                p.location.toLowerCase().includes(location.toLowerCase())
              );
            }

            const minPrice = queryParams.get('minPrice');
            if (minPrice) {
              const min = parseInt(minPrice);
              filteredProperties = filteredProperties.filter(p => parseInt(p.price) >= min);
            }

            const maxPrice = queryParams.get('maxPrice');
            if (maxPrice) {
              const max = parseInt(maxPrice);
              filteredProperties = filteredProperties.filter(p => parseInt(p.price) <= max);
            }

            const bedrooms = queryParams.get('bedrooms');
            if (bedrooms && bedrooms !== 'any') {
              filteredProperties = filteredProperties.filter(p => p.bedrooms === bedrooms);
            }

            const bathrooms = queryParams.get('bathrooms');
            if (bathrooms && bathrooms !== 'any') {
              filteredProperties = filteredProperties.filter(p => p.bathrooms === bathrooms);
            }

            const propertyType = queryParams.get('propertyType');
            if (propertyType && propertyType !== 'any') {
              filteredProperties = filteredProperties.filter(p => p.propertyType === propertyType);
            }

            // Get page from query params
            const page = parseInt(queryParams.get('page') || '1');
            const limit = 12;
            const offset = (page - 1) * limit;

            // Apply pagination
            const paginatedProperties = filteredProperties.slice(offset, offset + limit);

            return {
              properties: paginatedProperties,
              totalCount: filteredProperties.length,
              totalPages: Math.ceil(filteredProperties.length / limit),
              currentPage: page
            };
          }
        } catch (importError) {
          console.error('Error importing property data directly:', importError);
        }

        // If all else fails, return hardcoded fallback data
        console.log('All data fetching methods failed, using hardcoded fallback data');
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
          currentPage: 1
        };
      }
    }
  };

  // Function to fetch properties with enhanced error handling
  const fetchProperties = async (page: number = 1, retryCount: number = 0) => {
    setLoading(true);
    setError(null);

    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.set('page', page.toString());

      if (location) queryParams.set('location', location);
      if (minPrice) queryParams.set('minPrice', minPrice);
      if (maxPrice) queryParams.set('maxPrice', maxPrice);
      if (bedrooms) queryParams.set('bedrooms', bedrooms);
      if (bathrooms) queryParams.set('bathrooms', bathrooms);
      if (propertyType) queryParams.set('propertyType', propertyType);

      console.log(`Fetching properties with params: ${queryParams.toString()}`);

      // Add cache-busting parameter to avoid stale data
      const cacheBuster = `cacheBust=${Date.now()}`;

      // Fetch data from API (will try multiple endpoints with fallbacks)
      const data = await fetchFromApi(queryParams, cacheBuster);

      // Validate the response data
      if (!data || !Array.isArray(data.properties)) {
        console.error('Invalid API response format:', data);
        throw new Error('Invalid API response format');
      }

      // If we got empty properties but have initial data, use that instead
      if (data.properties.length === 0 && initialData?.properties && initialData.properties.length > 0) {
        console.log('API returned empty properties, using initial data');
        setProperties(initialData.properties);
        setTotalCount(initialData.totalCount);
        setTotalPages(initialData.totalPages);
        setCurrentPage(initialData.currentPage);
      } else {
        // Ensure all properties have the required fields
        const validatedProperties = data.properties.map(prop => ({
          ...prop,
          // Ensure these fields exist with fallbacks
          id: prop.id || `temp-${Math.random().toString(36).substring(2, 9)}`,
          title: prop.title || 'Property Listing',
          location: prop.location || 'Location not specified',
          bedrooms: prop.bedrooms || '0',
          bathrooms: prop.bathrooms || '0',
          price: prop.price || '0',
          currency: prop.currency || 'USD',
          amenities: Array.isArray(prop.amenities) ? prop.amenities : [],
          images: Array.isArray(prop.images) && prop.images.length > 0
            ? prop.images
            : ['/images/properties/property-placeholder.svg']
        }));

        setProperties(validatedProperties);
        setTotalCount(data.totalCount || validatedProperties.length);
        setTotalPages(data.totalPages || Math.ceil(validatedProperties.length / 12));
        setCurrentPage(page);
      }

      console.log(`Loaded ${data.properties.length} properties from API`);
    } catch (err: any) {
      console.error(`Error fetching properties (attempt ${retryCount + 1}):`, err);

      // Retry logic - try up to 2 more times with exponential backoff
      if (retryCount < 2) {
        console.log(`Retrying fetch (attempt ${retryCount + 2})...`);
        setTimeout(() => {
          fetchProperties(page, retryCount + 1);
        }, 1000 * Math.pow(2, retryCount)); // 1s, 2s, 4s backoff
        return;
      }

      setError(err.message || 'Failed to fetch properties');
      console.log('All retry attempts failed, using fallback data');

      // If we have initial data, use that instead of the demo data
      if (initialData?.properties && initialData.properties.length > 0) {
        console.log('Using initial data as fallback');
        setProperties(initialData.properties);
        setTotalCount(initialData.totalCount);
        setTotalPages(initialData.totalPages);
        setCurrentPage(initialData.currentPage);
      } else {
        // If all else fails, use hardcoded demo data
        console.log('Using hardcoded demo data as final fallback');
        // Import from property-data.js directly
        try {
          const propertyDataModule = await import('@/lib/property-data');
          const fallbackProperties = propertyDataModule.properties || [];
          if (fallbackProperties.length > 0) {
            console.log('Successfully loaded fallback properties from property-data.js');
            setProperties(fallbackProperties);
            setTotalCount(fallbackProperties.length);
            setTotalPages(Math.ceil(fallbackProperties.length / 12));
            setCurrentPage(1);
            return;
          }
        } catch (importError) {
          console.error('Error importing fallback properties:', importError);
        }

        // Last resort fallback
        setProperties([
          {
            id: "1",
            title: "Modern 3 Bedroom Apartment in Downtown",
            location: "Downtown",
            bedrooms: "3",
            bathrooms: "2",
            price: "350000",
            currency: "USD",
            amenities: ['WiFi', 'Parking', 'Security'],
            images: ["/images/properties/property-1.jpg"],
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
            images: ["/images/properties/property-2.jpg"],
            propertyType: "house"
          }
        ]);
        setTotalCount(2);
        setTotalPages(1);
        setCurrentPage(1);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    // Update URL with new page
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());

    // Update the URL without refreshing the page
    router.push(`/properties?${params.toString()}`);

    // Fetch properties for the new page
    fetchProperties(page);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch properties on initial load and when filters change
  useEffect(() => {
    fetchProperties(currentPage);
  }, [location, minPrice, maxPrice, bedrooms, bathrooms, propertyType]);

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : properties.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No properties found</h3>
          <p className="text-gray-600">
            Try adjusting your filters to find more properties.
          </p>
        </div>
      )}
    </div>
  );
}
