'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Spinner } from '@/components/spinner';
import { PropertyImageGallery } from '@/components/property-image-gallery';
import { PropertyFeatures } from '@/components/property-features';
import { PropertyContact } from '@/components/property-contact';
import { PropertyDescription } from '@/components/property-description';

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
}

interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  floor?: string;
  bedrooms: string;
  bathrooms: string;
  units?: string;
  price: string;
  currency: string;
  paymentTerms?: string;
  amenities: string[];
  ownerName?: string;
  ownerContact?: string;
  googlePin?: string;
  isPremium?: boolean;
  images: string[];
  propertyType: string;
  squareMeters?: string;
  agents?: Agent;
}

interface ClientPropertyDetailsProps {
  id: string;
  initialProperty?: Property | null;
}

export function ClientPropertyDetails({ id, initialProperty }: ClientPropertyDetailsProps) {
  const [property, setProperty] = useState<Property | null>(initialProperty || null);
  const [loading, setLoading] = useState(!initialProperty);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch property details with enhanced error handling and fallbacks
  const fetchPropertyDetails = async () => {
    if (initialProperty && initialProperty.title !== "Loading Property...") {
      console.log('Using initial property data:', initialProperty.title);
      return; // Skip fetching if we already have complete initial data
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`Fetching property details for ID: ${id}`);

      // Add cache buster to avoid stale data
      const cacheBuster = `cacheBust=${Date.now()}`;

      // Fetch with timeout to avoid hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const apiResponse = await fetch(`/api/properties/${id}?${cacheBuster}`, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        // Disable cache to ensure fresh data
        cache: 'no-store',
      });

      clearTimeout(timeoutId);

      if (!apiResponse.ok) {
        throw new Error(`API returned ${apiResponse.status}: ${apiResponse.statusText}`);
      }

      const data = await apiResponse.json();

      if (!data.property) {
        throw new Error('Invalid API response: missing property data');
      }

      // Validate and enhance the property data
      const validatedProperty = {
        ...data.property,
        // Ensure these fields exist with fallbacks
        id: data.property.id || id,
        title: data.property.title || 'Property Details',
        description: data.property.description || '<p>No description available</p>',
        location: data.property.location || 'Location not specified',
        bedrooms: data.property.bedrooms || '0',
        bathrooms: data.property.bathrooms || '0',
        price: data.property.price || 'Contact for price',
        currency: data.property.currency || 'USD',
        amenities: Array.isArray(data.property.amenities) ? data.property.amenities : [],
        images: Array.isArray(data.property.images) && data.property.images.length > 0
          ? data.property.images
          : ['/images/properties/property-placeholder.svg'],
        propertyType: data.property.propertyType || 'property'
      };

      setProperty(validatedProperty);
      console.log(`Successfully loaded property ${id} from API:`, validatedProperty.title);
    } catch (err: any) {
      console.error('Error fetching property details:', err);

      // Try to import property data directly as a fallback
      try {
        console.log('Attempting to import property data directly...');
        const { getPropertyById } = await import('@/lib/property-service');
        const fallbackProperty = await getPropertyById(id, true);

        if (fallbackProperty) {
          console.log('Successfully loaded property from direct import');
          setProperty(fallbackProperty);
          return;
        }
      } catch (importError) {
        console.error('Error importing property data directly:', importError);
      }

      // If direct import fails, try to use property-fallback.js
      try {
        console.log('Attempting to use property-fallback.js...');
        const { getFallbackProperty } = await import('@/lib/property-fallback');
        const fallbackProperty = getFallbackProperty(id);

        if (fallbackProperty) {
          console.log('Successfully loaded property from fallback system');
          setProperty(fallbackProperty);
          return;
        }
      } catch (fallbackError) {
        console.error('Error using property-fallback.js:', fallbackError);
      }

      // If all else fails, use minimal fallback data
      console.log('All fallback methods failed, using minimal property data');
      setError('Could not load complete property details. Showing limited information.');

      setProperty({
        id,
        title: "Property Information",
        description: "<p>Property details are being updated.</p>",
        location: "An Jia Properties",
        bedrooms: "0",
        bathrooms: "0",
        price: "Contact agent",
        currency: "USD",
        amenities: ["WiFi", "Parking", "Security"],
        images: [
          "/images/properties/property-placeholder.svg"
        ],
        propertyType: "property",
        agents: {
          id: "agent-1",
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+256 701 234 567",
          company: "An Jia You Xuan Real Estate"
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch property details on initial load
  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <p>{error}</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">Property not found</h3>
        <p className="text-gray-600">
          The property you are looking for does not exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
        <p className="text-xl text-gray-600 mb-4">{property.location}</p>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="bg-blue-50 px-4 py-2 rounded-md">
            <span className="font-semibold">{property.bedrooms}</span> Bedrooms
          </div>
          <div className="bg-blue-50 px-4 py-2 rounded-md">
            <span className="font-semibold">{property.bathrooms}</span> Bathrooms
          </div>
          {property.squareMeters && (
            <div className="bg-blue-50 px-4 py-2 rounded-md">
              <span className="font-semibold">{property.squareMeters}</span> m²
            </div>
          )}
          <div className="bg-blue-50 px-4 py-2 rounded-md">
            <span className="font-semibold">{property.propertyType}</span>
          </div>
        </div>

        <div className="text-2xl font-bold text-blue-600 mb-6">
          {property.currency} {parseInt(property.price).toLocaleString()}
          {property.paymentTerms && (
            <span className="text-sm font-normal text-gray-600 ml-2">
              {property.paymentTerms}
            </span>
          )}
        </div>
      </div>

      {/* Image Gallery */}
      <PropertyImageGallery images={property.images} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          {/* Property Description */}
          <PropertyDescription description={property.description} />

          {/* Property Features */}
          <PropertyFeatures
            amenities={property.amenities}
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            propertyType={property.propertyType}
            squareMeters={property.squareMeters}
            floor={property.floor}
          />
        </div>

        <div>
          {/* Property Contact */}
          <PropertyContact
            agent={property.agents}
            propertyId={property.id}
            propertyTitle={property.title}
          />
        </div>
      </div>
    </div>
  );
}
