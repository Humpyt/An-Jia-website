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
  
  // Function to fetch property details
  const fetchPropertyDetails = async () => {
    if (initialProperty) {
      return; // Skip fetching if we already have initial data
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // First try to fetch from static JSON file
      try {
        const staticResponse = await fetch(`/data/property-${id}.json`);
        if (staticResponse.ok) {
          const staticData = await staticResponse.json();
          setProperty(staticData.property);
          console.log(`Loaded property ${id} from static JSON`);
          return;
        }
      } catch (staticError) {
        console.error('Error loading static property:', staticError);
      }
      
      // If static JSON fails, try the API
      const apiResponse = await fetch(`/api/properties/${id}`);
      
      if (!apiResponse.ok) {
        throw new Error(`API returned ${apiResponse.status}: ${apiResponse.statusText}`);
      }
      
      const data = await apiResponse.json();
      setProperty(data.property);
      
      console.log(`Loaded property ${id} from API`);
    } catch (err: any) {
      console.error('Error fetching property details:', err);
      setError(err.message || 'Failed to fetch property details');
      
      // If all else fails, use demo data
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
          "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800"
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
