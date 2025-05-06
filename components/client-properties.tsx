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

  // Helper function to fetch from API with fallback
  const fetchFromApi = async (queryParams: URLSearchParams, cacheBuster: string) => {
    const apiUrl = `/api/properties?${queryParams.toString()}&${cacheBuster}`;
    console.log(`API URL: ${apiUrl}`);

    // Fetch with timeout to avoid hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const apiResponse = await fetch(apiUrl, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!apiResponse.ok) {
        throw new Error(`API returned ${apiResponse.status}: ${apiResponse.statusText}`);
      }

      const data = await apiResponse.json();
      return data;
    } catch (error) {
      console.error('Error fetching from primary API, trying direct API:', error);

      // Try the direct API endpoint as a fallback
      const directApiUrl = `/api/properties/direct?${queryParams.toString()}&${cacheBuster}`;
      console.log(`Trying direct API URL: ${directApiUrl}`);

      const directController = new AbortController();
      const directTimeoutId = setTimeout(() => directController.abort(), 10000);

      const directResponse = await fetch(directApiUrl, {
        signal: directController.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      clearTimeout(directTimeoutId);

      if (!directResponse.ok) {
        throw new Error(`Direct API returned ${directResponse.status}: ${directResponse.statusText}`);
      }

      const directData = await directResponse.json();
      console.log('Successfully fetched from direct API');
      return directData;
    }
  };

  // Function to fetch properties with retry mechanism
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

      // Fetch data from API (will try both endpoints)
      const data = await fetchFromApi(queryParams, cacheBuster);

      // Validate the response data
      if (!data || !Array.isArray(data.properties)) {
        console.error('Invalid API response format:', data);
        throw new Error('Invalid API response format');
      }

      setProperties(data.properties);
      setTotalCount(data.totalCount || data.properties.length);
      setTotalPages(data.totalPages || Math.ceil(data.properties.length / 12));
      setCurrentPage(page);

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
        // If all else fails, use demo data
        console.log('Using demo data as fallback');
        setProperties([
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
