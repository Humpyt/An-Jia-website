"use client"

import { useState, useEffect } from "react"
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
import { PropertyCategories } from "@/components/property-categories"
import { CustomPagination } from "@/components/custom-pagination"
import { MapPin, Building, Home, Landmark, Hotel, Store, Search } from "lucide-react"

// Property type options with icons
const propertyTypes = [
  { id: "any", name: "any", icon: Building },
  { id: "apartment", name: "apartment", icon: Building },
  { id: "house", name: "house", icon: Home },
  { id: "land", name: "land", icon: Landmark },
  { id: "hotel", name: "hotel", icon: Hotel },
  { id: "commercial", name: "commercial", icon: Store }
]

export function SearchContent({
  initialProperties,
  searchParams
}: {
  initialProperties: {
    data: Property[],
    totalCount: number,
    totalPages: number,
    currentPage: number,
    error: null
  },
  searchParams: Record<string, string | string[] | undefined>
}) {
  const { translate } = useLanguage()
  const [properties, setProperties] = useState(initialProperties.data || [])
  const [currentPage, setCurrentPage] = useState(initialProperties.currentPage || 1)
  const [totalCount, setTotalCount] = useState(initialProperties.totalCount || 0)
  const [totalPages, setTotalPages] = useState(initialProperties.totalPages || 1)
  const itemsPerPage = 12
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [filters, setFilters] = useState({
    minPrice: searchParams?.minPrice?.toString() || '',
    maxPrice: searchParams?.maxPrice?.toString() || '',
    bedrooms: searchParams?.bedrooms?.toString() || 'any',
    bathrooms: searchParams?.bathrooms?.toString() || 'any',
    propertyType: searchParams?.propertyType?.toString() || 'any',
    location: searchParams?.location?.toString() || '',
    sort: searchParams?.sort?.toString() || 'newest',
  })

  return (
    <main className="flex-1">
      <section className="relative py-20 text-white">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/03/WhatsApp Image 2025-04-09 at 11.36.26 AM.jpeg"
            alt="Property Search"
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={75}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx0fHRsdHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight mb-4 md:text-4xl">
              {translate("search_properties")}
            </h1>
            <p className="text-xl text-muted-foreground">
              {translate("find_your_perfect_property")}
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

                      if (filters.location) queryParams.set('location', filters.location)
                      if (filters.minPrice) queryParams.set('minPrice', filters.minPrice)
                      if (filters.maxPrice) queryParams.set('maxPrice', filters.maxPrice)
                      if (filters.bedrooms !== 'any') queryParams.set('bedrooms', filters.bedrooms)
                      if (filters.bathrooms !== 'any') queryParams.set('bathrooms', filters.bathrooms)
                      if (filters.propertyType !== 'any') queryParams.set('propertyType', filters.propertyType)
                      if (filters.sort) queryParams.set('sort', filters.sort)

                      // Use window.location to update URL with filters
                      // Make sure we're preserving the current page path
                      window.location.href = `/search?${queryParams.toString()}`
                    } catch (err: any) {
                      setError(err.message || 'Failed to apply filters')
                    } finally {
                      setLoading(false)
                    }
                  }}>
                    <div className="space-y-4">
                      <Label>{translate("location")}</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                          <MapPin className="h-4 w-4 text-neutral-400" />
                        </div>
                        <Input
                          id="location"
                          type="text"
                          placeholder={translate("enter_location") || "Enter location"}
                          value={filters.location}
                          onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                          className="pl-9"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {['Kampala', 'Entebbe', 'Jinja', 'Mbarara', 'Gulu'].map((location) => (
                          <Button
                            key={location}
                            type="button"
                            variant="outline"
                            size="sm"
                            className={`text-xs ${filters.location === location ? 'bg-primary text-primary-foreground' : ''}`}
                            onClick={() => setFilters(prev => ({ ...prev, location: location }))}
                          >
                            {location}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label>{translate("price_range")}</Label>
                        <span className="text-sm font-medium text-primary">
                          {filters.minPrice ? `$${parseInt(filters.minPrice).toLocaleString()}` : "$0"} - {filters.maxPrice ? `$${parseInt(filters.maxPrice).toLocaleString()}` : "$5,000+"}
                        </span>
                      </div>

                      <div className="pt-4 px-2">
                        <Slider
                          defaultValue={[
                            parseInt(filters.minPrice || "0"),
                            parseInt(filters.maxPrice || "5000")
                          ]}
                          max={5000}
                          step={100}
                          onValueChange={(values) => {
                            setFilters(prev => ({
                              ...prev,
                              minPrice: values[0].toString(),
                              maxPrice: values[1].toString()
                            }))
                          }}
                          className="my-6"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <Label htmlFor="min-price" className="text-sm">
                            {translate("min_price")}
                          </Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                              <span className="text-neutral-500">$</span>
                            </div>
                            <Input
                              id="min-price"
                              type="number"
                              placeholder="0"
                              value={filters.minPrice}
                              onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                              className="pl-7"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="max-price" className="text-sm">
                            {translate("max_price")}
                          </Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                              <span className="text-neutral-500">$</span>
                            </div>
                            <Input
                              id="max-price"
                              type="number"
                              placeholder="5000"
                              value={filters.maxPrice}
                              onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                              className="pl-7"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>{translate("bedrooms")}</Label>
                      <Select
                        value={filters.bedrooms}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, bedrooms: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">{translate("any") || "Any"}</SelectItem>
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
                      <Select value={filters.propertyType} onValueChange={(value) => setFilters(prev => ({ ...prev, propertyType: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">{translate("any")}</SelectItem>
                          <SelectItem value="apartment">{translate("apartment")}</SelectItem>
                          <SelectItem value="house">{translate("house")}</SelectItem>
                          <SelectItem value="land">{translate("land")}</SelectItem>
                          <SelectItem value="commercial">{translate("commercial")}</SelectItem>
                          <SelectItem value="hotel">{translate("hotel")}</SelectItem>
                        </SelectContent>
                      </Select>
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
                            propertyType: 'any',
                            location: '',
                            sort: 'newest',
                          })
                          window.location.href = '/search'
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
              <div className="flex justify-between items-center mt-6">
                <p className="text-muted-foreground">
                  {totalCount} {translate("properties")}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{translate("sort_by")}:</span>
                  <Select
                    value={filters.sort}
                    onValueChange={(value) => {
                      setFilters(prev => ({ ...prev, sort: value }))
                      const queryParams = new URLSearchParams(window.location.search);
                      queryParams.set('sort', value);
                      window.location.href = `/search?${queryParams.toString()}`;
                    }}
                  >
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

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 content-visibility-auto mb-12">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mb-16">
                  <CustomPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                      // Build the current query parameters
                      const queryParams = new URLSearchParams(window.location.search);

                      // Update or add the page parameter
                      queryParams.set('page', page.toString());

                      // Navigate to the new URL with updated page parameter
                      window.location.href = `/search?${queryParams.toString()}`;
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
