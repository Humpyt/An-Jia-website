"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/components/language-switcher"
import { PropertyCard } from "@/components/property-card"

interface Property {
  id: string
  title: string
  slug: string
  featured_image: string | null
  images: string[]
  price: string
  bedrooms: string
  bathrooms: string
  square_footage: string
  is_featured: boolean
  isPremium: boolean
  location: string
  paymentTerms: string
  neighborhoods: Array<{
    id: number
    name: string
    slug: string
  }>
  property_types: Array<{
    id: number
    name: string
    slug: string
  }>
  price_ranges: Array<{
    id: number
    name: string
    slug: string
  }>
  excerpt: string
}

export function FeaturedProperties() {
  const { translate } = useLanguage()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        // Use our proxy API endpoint instead of directly calling WordPress
        const response = await fetch('/api/featured-properties')
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()
        // Take first 4 properties
        setProperties(data.slice(0, 4))
      } catch (err) {
        console.error('Error fetching featured properties:', err)
        setError(err instanceof Error ? err.message : 'Failed to load properties')
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProperties()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Properties</h2>
            <p className="text-neutral-500">Discover our selection of premium properties in Kampala</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
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
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Properties</h2>
            <p className="text-neutral-500">Discover our selection of premium properties in Kampala</p>
          </div>
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">{error}</div>
        </div>
      </section>
    )
  }

  if (properties.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Properties</h2>
            <p className="text-neutral-500">Discover our selection of premium properties in Kampala</p>
          </div>
          <div className="text-center text-gray-500 py-8">{translate("no_featured_properties")}</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight">{translate("featured_properties")}</h2>
          <p className="text-neutral-600 mt-2">Discover our selection of premium properties in Kampala</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} featured />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Link href="/properties" className="flex items-center">
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
