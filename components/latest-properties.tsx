"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/components/language-switcher"

interface Property {
  id: string
  title: string
  slug?: string
  featured_image?: string | null
  images: string[]
  price: string
  currency?: string
  bedrooms: string
  bathrooms: string
  square_footage?: string
  squareMeters?: string
  is_featured?: boolean
  isPremium?: boolean
  location: string
  paymentTerms?: string
  description?: string
  amenities?: string[]
  propertyType?: string
  neighborhoods?: Array<{
    id: number
    name: string
    slug: string
  }>
  property_types?: Array<{
    id: number
    name: string
    slug: string
  }>
  price_ranges?: Array<{
    id: number
    name: string
    slug: string
  }>
  excerpt?: string
}

export function LatestProperties() {
  const { translate } = useLanguage()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // No favorites functionality

  useEffect(() => {
    const fetchLatestProperties = async () => {
      try {
        // Add a retry mechanism for fetching properties
        let retries = 3;
        let fetchedProperties = [];
        let lastError = null;

        for (let attempt = 0; attempt < retries; attempt++) {
          try {
            console.log(`Attempt ${attempt + 1}/${retries} to fetch latest properties`);

            // Use the correct API endpoint for latest properties
            const response = await fetch('/api/properties/latest');

            if (!response.ok) {
              throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // The API returns properties in a 'properties' field
            if (data.properties && Array.isArray(data.properties)) {
              console.log(`Successfully fetched ${data.properties.length} properties on attempt ${attempt + 1}`);
              fetchedProperties = data.properties;
              break; // Success, exit the retry loop
            } else {
              throw new Error('Invalid response format: properties field missing or not an array');
            }
          } catch (err) {
            lastError = err;
            console.error(`Attempt ${attempt + 1} failed:`, err);

            // Wait before retrying (exponential backoff)
            if (attempt < retries - 1) {
              const delay = Math.pow(2, attempt) * 500;
              console.log(`Waiting ${delay}ms before next attempt...`);
              await new Promise(resolve => setTimeout(resolve, delay));
            }
          }
        }

        if (fetchedProperties && fetchedProperties.length > 0) {
          setProperties(fetchedProperties);
        } else {
          const errorMessage = lastError instanceof Error ? lastError.message : 'Failed to load properties';
          console.error('All attempts to fetch properties failed:', errorMessage);
          setError(errorMessage);
        }
      } catch (err) {
        console.error('Error in property fetching process:', err);
        setError(err instanceof Error ? err.message : 'Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProperties();
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Latest Properties</h2>
            <p className="text-muted-foreground mt-2">Discover our newest listings in Kampala</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Latest Properties</h2>
            <p className="text-muted-foreground mt-2">Discover our newest listings in Kampala</p>
          </div>
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">{error}</div>
        </div>
      </section>
    )
  }

  if (properties.length === 0) {
    return (
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Latest Properties</h2>
            <p className="text-muted-foreground mt-2">Discover our newest listings in Kampala</p>
          </div>
          <div className="text-center text-gray-500 py-8">{translate("no_properties_found")}</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Latest Properties</h2>
          <p className="text-muted-foreground mt-2">Discover our newest listings in Kampala</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <Card key={property.id} className="group overflow-hidden bg-white">
              <div className="relative aspect-[4/3]">
                <Link href={`/properties/${property.id}`}>
                  <div className="relative w-full h-full">
                    <Image
                      src={property.featured_image || (property.images && property.images.length > 0 ? property.images[0] : "/placeholder.svg")}
                      alt={property.title}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                </Link>
                {property.propertyType && (
                  <Badge className="absolute bottom-2 left-2 capitalize bg-white text-black">
                    {property.propertyType}
                  </Badge>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <Link href={`/properties/${property.id}`} className="hover:underline">
                    <h3 className="font-medium text-base line-clamp-1">{property.title}</h3>
                  </Link>
                  <div className="flex items-center gap-1 text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 text-amber-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{(4.5 + (parseInt(property.id) % 5) * 0.1).toFixed(2)}</span>
                    <span className="text-neutral-400">({10 + (parseInt(property.id) % 20)})</span>
                  </div>
                </div>
                <p className="text-sm text-neutral-500 mt-1">{property.location}</p>
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <span>
                    {property.bedrooms} {parseInt(property.bedrooms) === 1 ? "Bedroom" : "Bedrooms"}
                  </span>
                  <span>•</span>
                  <span>
                    {property.bathrooms} {parseInt(property.bathrooms) === 1 ? "Bathroom" : "Bathrooms"}
                  </span>
                </div>
                <div className="mt-3">
                  <span className="font-semibold">
                    {property.currency ? `${property.currency === 'USD' ? '$' : property.currency} ` : '$'}
                    {property.price}
                  </span>
                  {property.paymentTerms && (
                    <span className="text-neutral-500 text-sm"> /{property.paymentTerms.toLowerCase()}</span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild size="lg" className="bg-rose-500 hover:bg-rose-600 text-white">
            <Link href="/properties">
              {translate("view_all_properties")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-2 h-4 w-4"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
