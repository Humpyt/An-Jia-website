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

  // Function to load properties directly from mock data
  const loadProperties = (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      console.log(`Loading properties from mock data for page ${page}`);

      // Import mock data directly
      import('@/lib/property-data').then(({ properties: mockProperties }) => {
        // Apply filters
        let filteredProperties = [...mockProperties];

        // Filter by location
        if (location) {
          filteredProperties = filteredProperties.filter(p =>
            p.location.toLowerCase().includes(location.toLowerCase())
          );
        }

        // Filter by price range
        if (minPrice) {
          const min = parseInt(minPrice);
          filteredProperties = filteredProperties.filter(p => parseInt(p.price) >= min);
        }

        if (maxPrice) {
          const max = parseInt(maxPrice);
          filteredProperties = filteredProperties.filter(p => parseInt(p.price) <= max);
        }

        // Filter by bedrooms
        if (bedrooms && bedrooms !== 'any') {
          filteredProperties = filteredProperties.filter(p => p.bedrooms === bedrooms);
        }

        // Filter by bathrooms
        if (bathrooms && bathrooms !== 'any') {
          filteredProperties = filteredProperties.filter(p => p.bathrooms === bathrooms);
        }

        // Filter by property type
        if (propertyType && propertyType !== 'any') {
          filteredProperties = filteredProperties.filter(p => p.propertyType === propertyType);
        }

        // Apply pagination
        const limit = 12;
        const offset = (page - 1) * limit;
        const paginatedProperties = filteredProperties.slice(offset, offset + limit);

        // Ensure all properties have the required fields
        const validatedProperties = paginatedProperties.map((prop) => ({
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
        setTotalCount(filteredProperties.length);
        setTotalPages(Math.ceil(filteredProperties.length / limit));
        setCurrentPage(page);

        console.log(`Loaded ${validatedProperties.length} properties from mock data`);
      }).catch(error => {
        console.error('Error importing mock data:', error);
        setError('Failed to load property data');

        // Use initial data as fallback if available
        if (initialData?.properties && initialData.properties.length > 0) {
          console.log('Using initial data as fallback');
          setProperties(initialData.properties);
          setTotalCount(initialData.totalCount);
          setTotalPages(initialData.totalPages);
          setCurrentPage(initialData.currentPage);
        }
      }).finally(() => {
        setLoading(false);
      });
    } catch (err: any) {
      console.error('Error in loadProperties:', err);
      setError(err.message || 'Failed to load properties');
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

    // Load properties for the new page
    loadProperties(page);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load properties on initial load and when filters change
  useEffect(() => {
    loadProperties(currentPage);
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
