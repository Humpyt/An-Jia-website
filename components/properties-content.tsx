"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { PropertyCard } from "@/components/property-card"
import { useLanguage } from "@/components/language-switcher"
import { Property } from "@/lib/property-data"

export function PropertiesContent({ 
  initialProperties, 
  searchParams 
}: { 
  initialProperties: { data: Property[], error: null }, 
  searchParams: Record<string, string | string[] | undefined> 
}) {
  const { translate } = useLanguage()
  const [properties, setProperties] = useState(initialProperties.data || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [filters, setFilters] = useState({
    minPrice: searchParams.minPrice as string || '',
    maxPrice: searchParams.maxPrice as string || '',
    bedrooms: searchParams.bedrooms as string || 'any',
    bathrooms: searchParams.bathrooms as string || 'any',
    amenities: Array.isArray(searchParams.amenities) ? searchParams.amenities : 
      (searchParams.amenities ? [searchParams.amenities as string] : [])
  })
  
  return (
    <main className="flex-1">
      <section className="relative py-20 text-white">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/03/WhatsApp Image 2025-04-09 at 11.36.26 AM.jpeg" 
            alt="Kampala Properties" 
            fill 
            className="object-cover"
            priority
            sizes="100vw"
            quality={80}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight mb-4 md:text-4xl">
              {translate("all_properties")}
            </h1>
            <p className="text-xl text-muted-foreground">
              {translate("discover_best_properties")}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">{translate("filter_properties")}</h2>
                  <form className="space-y-6" onSubmit={async (e) => {
                    e.preventDefault()
                    setLoading(true)
                    setError(null)
                    
                    try {
                      const queryParams = new URLSearchParams()
                      
                      if (filters.minPrice) queryParams.set('minPrice', filters.minPrice)
                      if (filters.maxPrice) queryParams.set('maxPrice', filters.maxPrice)
                      if (filters.bedrooms !== 'any') queryParams.set('bedrooms', filters.bedrooms)
                      if (filters.bathrooms !== 'any') queryParams.set('bathrooms', filters.bathrooms)
                      if (filters.amenities.length > 0) {
                        filters.amenities.forEach(amenity => 
                          queryParams.append('amenities', amenity)
                        )
                      }
                      
                      // Use window.location to update URL with filters
                      window.location.href = `${window.location.pathname}?${queryParams.toString()}`
                    } catch (err: any) {
                      setError(err.message || 'Failed to apply filters')
                    } finally {
                      setLoading(false)
                    }
                  }}>
                    <div className="space-y-4">
                      <Label>{translate("price_range")}</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="min-price" className="text-sm">
                            {translate("min_price")}
                          </Label>
                          <Input 
                            id="min-price" 
                            type="number" 
                            placeholder="0"
                            value={filters.minPrice}
                            onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="max-price" className="text-sm">
                            {translate("max_price")}
                          </Label>
                          <Input 
                            id="max-price" 
                            type="number" 
                            placeholder="5000"
                            value={filters.maxPrice}
                            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>{translate("bedrooms")}</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="1">1+</SelectItem>
                          <SelectItem value="2">2+</SelectItem>
                          <SelectItem value="3">3+</SelectItem>
                          <SelectItem value="4">4+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <Label>{translate("bathrooms")}</Label>
                      <Select
                        value={filters.bathrooms}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, bathrooms: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="1">1+</SelectItem>
                          <SelectItem value="2">2+</SelectItem>
                          <SelectItem value="3">3+</SelectItem>
                          <SelectItem value="4">4+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <Label>{translate("property_type")}</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="apartment">Apartment</SelectItem>
                          <SelectItem value="house">House</SelectItem>
                          <SelectItem value="villa">Villa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <Label>{translate("select_amenities")}</Label>
                      <div className="space-y-2">
                        {['wifi', 'parking', 'gym', 'pool'].map((amenity) => (
                          <div key={amenity} className="flex items-center">
                            <input
                              type="checkbox"
                              id={amenity}
                              checked={filters.amenities.includes(amenity)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFilters(prev => ({
                                    ...prev,
                                    amenities: [...prev.amenities, amenity]
                                  }))
                                } else {
                                  setFilters(prev => ({
                                    ...prev,
                                    amenities: prev.amenities.filter(a => a !== amenity)
                                  }))
                                }
                              }}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor={amenity} className="ml-2 text-sm capitalize">
                              {amenity}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button type="submit" disabled={loading}>
                        {loading ? 'Applying...' : translate("apply_filters")}
                      </Button>
                      <Button 
                        variant="outline" 
                        type="reset" 
                        onClick={() => {
                          setFilters({
                            minPrice: '',
                            maxPrice: '',
                            bedrooms: 'any',
                            bathrooms: 'any',
                            amenities: []
                          })
                          window.location.href = window.location.pathname
                        }}
                      >
                        {translate("reset_filters")}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground">
                  {properties.length} {translate("properties")}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{translate("sort_by")}:</span>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Newest" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">{translate("newest")}</SelectItem>
                      <SelectItem value="price-asc">{translate("price_low_high")}</SelectItem>
                      <SelectItem value="price-desc">{translate("price_high_low")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
