'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Spinner } from '@/components/spinner';
import { PropertyImageGallery } from '@/components/property-image-gallery';
import { PropertyFeatures } from '@/components/property-features';
import { PropertyContact } from '@/components/property-contact';
import { PropertyDescription } from '@/components/property-description';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertTriangle, CheckCircle, MapPin, Bed, Bath, Home } from 'lucide-react';

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
  _source?: string;
  _fetchedAt?: string;
}

interface ClientPropertyDetailsProps {
  id: string;
  initialProperty?: Property | null;
  dataSource?: string;
  serverError?: string | null;
}

export function ClientPropertyDetails({
  id,
  initialProperty,
  dataSource = 'unknown',
  serverError = null
}: ClientPropertyDetailsProps) {
  const [property, setProperty] = useState<Property | null>(initialProperty || null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(serverError);
  const [source, setSource] = useState<string>(dataSource);

  // Function to fetch property details from our consolidated API endpoint
  const fetchPropertyDetails = async (skipCache = false) => {
    // If refreshing, don't reset the current property
    if (!refreshing) {
      setLoading(true);
    }
    setError(null);

    try {
      console.log(`[CLIENT] Fetching property details for ID: ${id}, skipCache: ${skipCache}`);

      // Add cache buster and skipCache parameter
      const params = new URLSearchParams({
        cacheBust: Date.now().toString(),
        skipCache: skipCache.toString()
      });

      // Use our consolidated property API endpoint
      const apiUrl = `/api/property/${id}?${params}`;
      console.log(`[CLIENT] Using property API endpoint: ${apiUrl}`);

      // Fetch with timeout to avoid hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

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
      console.log(`[CLIENT] API response status:`, apiResponse.status);

      if (!apiResponse.ok) {
        console.error(`[CLIENT] API error:`, apiResponse.status, apiResponse.statusText);
        throw new Error(`API returned ${apiResponse.status}: ${apiResponse.statusText}`);
      }

      const data = await apiResponse.json();
      console.log(`[CLIENT] API response structure:`, Object.keys(data));

      if (!data.property) {
        throw new Error('Invalid API response: missing property data');
      }

      // Update the property state with the fetched data
      setProperty(data.property);
      setSource(data.source || data.property._source || 'api');
      console.log(`[CLIENT] Successfully loaded property ${id} from ${data.source || 'api'}`);

      return true;
    } catch (err: any) {
      console.error('[CLIENT] Error fetching property details:', err);

      // Only set error if we don't already have property data
      if (!property || refreshing) {
        setError(err.message || 'Failed to load property details');
      }

      return false;
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Function to handle manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPropertyDetails(true); // Skip cache when manually refreshing
  };

  // Fetch property details on initial load if needed
  useEffect(() => {
    // Only fetch if we don't have complete data or if we have a server error
    if (
      !initialProperty ||
      initialProperty.title === "Loading Property..." ||
      serverError
    ) {
      fetchPropertyDetails();
    }
  }, [id]);

  // Show loading state
  if (loading && !property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
          <span className="ml-3 text-gray-600">Loading property details...</span>
        </div>
      </div>
    );
  }

  // Show error state if we have an error and no property data
  if (error && !property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>

        <div className="text-center py-8">
          <Button onClick={handleRefresh} variant="outline" className="mx-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Show not found state
  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">Property not found</h3>
          <p className="text-gray-600 mb-6">
            The property you are looking for does not exist or has been removed.
          </p>
          <Link href="/properties">
            <Button>Browse All Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Format price for display
  const formattedPrice = property.price && !isNaN(parseInt(property.price))
    ? parseInt(property.price).toLocaleString()
    : property.price;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Data Source Indicator & Refresh Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center text-sm text-gray-500">
          <span className="mr-2">Data source:</span>
          <span className="font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
            {source}
          </span>
          {property._fetchedAt && (
            <span className="ml-2 text-xs text-gray-400">
              Fetched: {new Date(property._fetchedAt).toLocaleTimeString()}
            </span>
          )}
        </div>

        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={refreshing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>

      {/* Error Alert (shown even if we have property data) */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            {error} Using potentially incomplete data.
          </AlertDescription>
        </Alert>
      )}

      {/* Breadcrumb Navigation */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-rose-500 transition-colors">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/properties" className="hover:text-rose-500 transition-colors">Properties</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700 font-medium">{property.title}</span>
      </div>

      {/* Property Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900">{property.title}</h1>
            <div className="flex items-center text-xl text-gray-600">
              <MapPin className="h-5 w-5 mr-2 text-rose-500" />
              {property.location}
            </div>
            {property.googlePin && (
              <a
                href={property.googlePin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-rose-500 hover:text-rose-700 mt-1 inline-block"
              >
                View on Google Maps
              </a>
            )}
          </div>

          <div className="bg-rose-50 border border-rose-100 rounded-lg px-6 py-4 text-center">
            <p className="text-sm text-gray-500 mb-1">Price</p>
            <div className="text-3xl font-bold text-rose-600">
              {property.currency} {formattedPrice}
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
            <div className="flex justify-center items-center mb-1">
              <Bed className="h-4 w-4 text-gray-500 mr-1" />
              <p className="text-xs text-gray-500 uppercase">Bedrooms</p>
            </div>
            <p className="text-xl font-semibold text-gray-800">{property.bedrooms}</p>
          </div>
          <div className="bg-white shadow-sm border border-gray-100 px-4 py-3 rounded-lg text-center">
            <div className="flex justify-center items-center mb-1">
              <Bath className="h-4 w-4 text-gray-500 mr-1" />
              <p className="text-xs text-gray-500 uppercase">Bathrooms</p>
            </div>
            <p className="text-xl font-semibold text-gray-800">{property.bathrooms}</p>
          </div>
          {property.squareMeters && (
            <div className="bg-white shadow-sm border border-gray-100 px-4 py-3 rounded-lg text-center">
              <p className="text-xs text-gray-500 uppercase mb-1">Area</p>
              <p className="text-xl font-semibold text-gray-800">{property.squareMeters} m²</p>
            </div>
          )}
          <div className="bg-white shadow-sm border border-gray-100 px-4 py-3 rounded-lg text-center">
            <div className="flex justify-center items-center mb-1">
              <Home className="h-4 w-4 text-gray-500 mr-1" />
              <p className="text-xs text-gray-500 uppercase">Type</p>
            </div>
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
    </div>
  );
}
