'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PropertyCard } from '@/components/property-card';
import { Pagination } from '@/components/pagination';
import { Spinner } from '@/components/spinner';
import { PropertyFilters } from '@/components/property-filters';
import { useLanguage } from '@/components/language-switcher';

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
  featured_image?: string;
}

interface ImprovedPropertiesProps {
  initialData?: {
    properties: Property[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    error?: string | null;
  };
}

export function ImprovedProperties({ initialData }: ImprovedPropertiesProps) {
  const { translate } = useLanguage();
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

  // Function to fetch properties from the API
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

      // Try the WordPress-specific endpoint first, then fall back to properties-data
      // This gives us two chances to get real data from WordPress
      const apiUrl = `/api/properties-wp?${queryParams.toString()}&${cacheBuster}`;

      // If that fails, we'll try the regular properties-data endpoint as fallback

      // Fetch with timeout to avoid hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(apiUrl, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        // Disable cache to ensure fresh data
        cache: 'no-store',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`Successfully fetched from API: ${data.properties?.length || 0} properties`);

      // Validate data structure
      if (!data.properties || !Array.isArray(data.properties)) {
        console.warn('API returned invalid data structure:', data);
        throw new Error('Invalid data structure from API');
      }

      // Ensure all properties have the required fields
      const validatedProperties = data.properties.map((prop: any) => ({
        ...prop,
        // Ensure these fields exist with fallbacks
        id: prop.id || `temp-${Math.random().toString(36).substring(2, 9)}`,
        title: prop.title || 'Property Listing',
        location: prop.location || 'Location not specified',
        bedrooms: prop.bedrooms || '0',
        bathrooms: prop.bathrooms || '0',
        price: prop.price || '0',
        currency: prop.currency || 'CNY',
        amenities: Array.isArray(prop.amenities) ? prop.amenities : [],
        images: Array.isArray(prop.images) && prop.images.length > 0
          ? prop.images
          : ['/images/properties/property-placeholder.jpg']
      }));

      setProperties(validatedProperties);
      setTotalCount(data.totalCount || validatedProperties.length);
      setTotalPages(data.totalPages || Math.ceil(validatedProperties.length / 12));
      setCurrentPage(page);

      console.log(`Loaded ${validatedProperties.length} properties from API`);
    } catch (err: any) {
      console.error(`Error fetching properties (attempt ${retryCount + 1}):`, err);

      // If this is the first attempt with the WordPress endpoint, try the properties-data endpoint
      if (retryCount === 0) {
        console.log('First endpoint failed, trying properties-data endpoint...');

        try {
          // Try the regular properties-data endpoint as fallback
          const fallbackApiUrl = `/api/properties-data?${queryParams.toString()}&${cacheBuster}`;

          console.log(`Trying fallback endpoint: ${fallbackApiUrl}`);

          const fallbackController = new AbortController();
          const fallbackTimeoutId = setTimeout(() => fallbackController.abort(), 10000);

          const fallbackResponse = await fetch(fallbackApiUrl, {
            signal: fallbackController.signal,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            cache: 'no-store',
          });

          clearTimeout(fallbackTimeoutId);

          if (!fallbackResponse.ok) {
            throw new Error(`Fallback API returned ${fallbackResponse.status}: ${fallbackResponse.statusText}`);
          }

          const fallbackData = await fallbackResponse.json();

          if (!fallbackData.properties || !Array.isArray(fallbackData.properties)) {
            throw new Error('Invalid data structure from fallback API');
          }

          // Process the data as before
          const validatedProperties = fallbackData.properties.map((prop: any) => ({
            ...prop,
            id: prop.id || `temp-${Math.random().toString(36).substring(2, 9)}`,
            title: prop.title || 'Property Listing',
            location: prop.location || 'Location not specified',
            bedrooms: prop.bedrooms || '0',
            bathrooms: prop.bathrooms || '0',
            price: prop.price || '0',
            currency: prop.currency || 'CNY',
            amenities: Array.isArray(prop.amenities) ? prop.amenities : [],
            images: Array.isArray(prop.images) && prop.images.length > 0
              ? prop.images
              : ['/images/properties/property-placeholder.jpg']
          }));

          setProperties(validatedProperties);
          setTotalCount(fallbackData.totalCount || validatedProperties.length);
          setTotalPages(fallbackData.totalPages || Math.ceil(validatedProperties.length / 12));
          setCurrentPage(page);

          console.log(`Successfully loaded ${validatedProperties.length} properties from fallback endpoint`);
          setLoading(false);
          return;
        } catch (fallbackError) {
          console.error('Fallback endpoint also failed:', fallbackError);
        }
      }

      // If fallback endpoint also failed or this is a retry, try again with the original endpoint
      if (retryCount < 1) {
        console.log(`Retrying original endpoint (attempt ${retryCount + 2})...`);
        setTimeout(() => {
          fetchProperties(page, retryCount + 1);
        }, 1000 * Math.pow(2, retryCount)); // 1s, 2s backoff
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
      <div className="mb-8">
        <PropertyFilters />
      </div>

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
          <h3 className="text-xl font-semibold mb-2">{translate("no_properties_found")}</h3>
          <p className="text-gray-600">
            {translate("try_adjusting_filters")}
          </p>
        </div>
      )}
    </div>
  );
}
