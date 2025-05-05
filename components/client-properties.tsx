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
  
  // Function to fetch properties
  const fetchProperties = async (page: number = 1) => {
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
      
      // First try to fetch from static JSON file
      try {
        const staticResponse = await fetch(`/data/properties.json`);
        if (staticResponse.ok) {
          const staticData = await staticResponse.json();
          
          // Apply client-side filtering
          let filteredProperties = staticData.properties;
          
          if (location) {
            filteredProperties = filteredProperties.filter((p: Property) => 
              p.location.toLowerCase().includes(location.toLowerCase())
            );
          }
          
          if (minPrice) {
            const min = parseInt(minPrice);
            filteredProperties = filteredProperties.filter((p: Property) => 
              parseInt(p.price) >= min
            );
          }
          
          if (maxPrice) {
            const max = parseInt(maxPrice);
            filteredProperties = filteredProperties.filter((p: Property) => 
              parseInt(p.price) <= max
            );
          }
          
          if (bedrooms && bedrooms !== 'any') {
            filteredProperties = filteredProperties.filter((p: Property) => 
              p.bedrooms === bedrooms
            );
          }
          
          if (bathrooms && bathrooms !== 'any') {
            filteredProperties = filteredProperties.filter((p: Property) => 
              p.bathrooms === bathrooms
            );
          }
          
          if (propertyType && propertyType !== 'any') {
            filteredProperties = filteredProperties.filter((p: Property) => 
              p.propertyType === propertyType
            );
          }
          
          // Apply pagination
          const itemsPerPage = 6;
          const offset = (page - 1) * itemsPerPage;
          const paginatedProperties = filteredProperties.slice(offset, offset + itemsPerPage);
          
          // Update state
          setProperties(paginatedProperties);
          setTotalCount(filteredProperties.length);
          setTotalPages(Math.ceil(filteredProperties.length / itemsPerPage));
          setCurrentPage(page);
          
          console.log(`Loaded ${paginatedProperties.length} properties from static JSON`);
          return;
        }
      } catch (staticError) {
        console.error('Error loading static properties:', staticError);
      }
      
      // If static JSON fails, try the API
      const apiResponse = await fetch(`/api/properties?${queryParams.toString()}`);
      
      if (!apiResponse.ok) {
        throw new Error(`API returned ${apiResponse.status}: ${apiResponse.statusText}`);
      }
      
      const data = await apiResponse.json();
      
      setProperties(data.properties);
      setTotalCount(data.totalCount);
      setTotalPages(data.totalPages);
      setCurrentPage(page);
      
      console.log(`Loaded ${data.properties.length} properties from API`);
    } catch (err: any) {
      console.error('Error fetching properties:', err);
      setError(err.message || 'Failed to fetch properties');
      
      // If all else fails, use demo data
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
