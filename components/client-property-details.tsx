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

      // Try the direct API endpoint first (uses mock data directly)
      const directApiUrl = `/api/properties-direct/${id}?${cacheBuster}`;
      console.log(`Trying direct API endpoint: ${directApiUrl}`);

      // Fetch with timeout to avoid hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const apiResponse = await fetch(directApiUrl, {
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
          : ['/images/properties/property-placeholder.jpg'],
        propertyType: data.property.propertyType || 'property'
      };

      setProperty(validatedProperty);
      console.log(`Successfully loaded property ${id} from direct API:`, validatedProperty.title);
    } catch (err: any) {
      console.error('Error fetching property details from direct API:', err);

      // Try the regular API endpoint as fallback
      try {
        console.log('Trying regular API endpoint as fallback...');
        const regularApiUrl = `/api/properties/${id}?${cacheBuster}`;

        const fallbackController = new AbortController();
        const fallbackTimeoutId = setTimeout(() => fallbackController.abort(), 10000);

        const fallbackResponse = await fetch(regularApiUrl, {
          signal: fallbackController.signal,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          cache: 'no-store',
        });

        clearTimeout(fallbackTimeoutId);

        if (!fallbackResponse.ok) {
          throw new Error(`Fallback API returned ${fallbackResponse.status}`);
        }

        const fallbackData = await fallbackResponse.json();

        if (!fallbackData.property) {
          throw new Error('Invalid fallback API response');
        }

        const validatedFallbackProperty = {
          ...fallbackData.property,
          id: fallbackData.property.id || id,
          title: fallbackData.property.title || 'Property Details',
          description: fallbackData.property.description || '<p>No description available</p>',
          location: fallbackData.property.location || 'Location not specified',
          bedrooms: fallbackData.property.bedrooms || '0',
          bathrooms: fallbackData.property.bathrooms || '0',
          price: fallbackData.property.price || 'Contact for price',
          currency: fallbackData.property.currency || 'USD',
          amenities: Array.isArray(fallbackData.property.amenities) ? fallbackData.property.amenities : [],
          images: Array.isArray(fallbackData.property.images) && fallbackData.property.images.length > 0
            ? fallbackData.property.images
            : ['/images/properties/property-placeholder.jpg'],
          propertyType: fallbackData.property.propertyType || 'property'
        };

        setProperty(validatedFallbackProperty);
        console.log(`Successfully loaded property from fallback API:`, validatedFallbackProperty.title);
        return;
      } catch (fallbackError) {
        console.error('Error using fallback API:', fallbackError);
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
          "/images/properties/property-placeholder.jpg"
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
      {/* Breadcrumb Navigation */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-rose-500 transition-colors">Home</a>
        <span className="mx-2">›</span>
        <a href="/properties" className="hover:text-rose-500 transition-colors">Properties</a>
        <span className="mx-2">›</span>
        <span className="text-gray-700 font-medium">{property.title}</span>
      </div>

      {/* Property Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900">{property.title}</h1>
            <p className="text-xl text-gray-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {property.location}
            </p>
          </div>

          <div className="bg-rose-50 border border-rose-100 rounded-lg px-6 py-4 text-center">
            <p className="text-sm text-gray-500 mb-1">Price</p>
            <div className="text-3xl font-bold text-rose-600">
              {property.currency} {parseInt(property.price).toLocaleString()}
            </div>
            {property.paymentTerms && (
              <p className="text-sm text-gray-500 mt-1">
                {property.paymentTerms}
              </p>
            )}
          </div>
        </div>

        {/* Property Key Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow-sm border border-gray-100 px-4 py-3 rounded-lg text-center">
            <p className="text-xs text-gray-500 uppercase mb-1">Bedrooms</p>
            <p className="text-xl font-semibold text-gray-800">{property.bedrooms}</p>
          </div>
          <div className="bg-white shadow-sm border border-gray-100 px-4 py-3 rounded-lg text-center">
            <p className="text-xs text-gray-500 uppercase mb-1">Bathrooms</p>
            <p className="text-xl font-semibold text-gray-800">{property.bathrooms}</p>
          </div>
          {property.squareMeters && (
            <div className="bg-white shadow-sm border border-gray-100 px-4 py-3 rounded-lg text-center">
              <p className="text-xs text-gray-500 uppercase mb-1">Area</p>
              <p className="text-xl font-semibold text-gray-800">{property.squareMeters} m²</p>
            </div>
          )}
          <div className="bg-white shadow-sm border border-gray-100 px-4 py-3 rounded-lg text-center">
            <p className="text-xs text-gray-500 uppercase mb-1">Type</p>
            <p className="text-xl font-semibold text-gray-800 capitalize">{property.propertyType}</p>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden mb-8">
        <PropertyImageGallery images={property.images} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Property Description */}
          <div className="bg-white shadow-md rounded-xl overflow-hidden mb-8 p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Description</h2>
            <PropertyDescription description={property.description} />
          </div>

          {/* Property Features */}
          <div className="bg-white shadow-md rounded-xl overflow-hidden p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Features & Amenities</h2>
            <PropertyFeatures
              amenities={property.amenities}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              propertyType={property.propertyType}
              squareMeters={property.squareMeters}
              floor={property.floor}
            />
          </div>
        </div>

        <div>
          {/* Property Contact */}
          <div className="bg-white shadow-md rounded-xl overflow-hidden sticky top-24">
            <PropertyContact
              agent={property.agents}
              propertyId={property.id}
              propertyTitle={property.title}
            />
          </div>
        </div>
      </div>

      {/* Similar Properties Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Similar Properties</h2>
        <p className="text-gray-500 mb-8">You might also be interested in these properties</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* This would ideally be populated with actual similar properties */}
          <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Similar property image
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">Similar Property</h3>
              <p className="text-gray-500 text-sm mb-2">Similar location</p>
              <p className="font-bold text-rose-600">Contact for price</p>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Similar property image
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">Similar Property</h3>
              <p className="text-gray-500 text-sm mb-2">Similar location</p>
              <p className="font-bold text-rose-600">Contact for price</p>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Similar property image
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">Similar Property</h3>
              <p className="text-gray-500 text-sm mb-2">Similar location</p>
              <p className="font-bold text-rose-600">Contact for price</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
