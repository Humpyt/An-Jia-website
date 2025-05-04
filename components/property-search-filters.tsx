"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { PropertyCard } from "@/components/property-card"
import { useLanguage } from "@/components/language-switcher"
import { Property } from "@/lib/property-data"
import { CustomPagination } from "@/components/custom-pagination"
import {
  MapPin, Building, Home, Landmark, Hotel, Store, Search,
  Bed, Bath, Wifi, Car, Zap, Shield, Droplets, Dumbbell,
  X, Filter, ChevronDown, ChevronUp, RefreshCw
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Property type options with icons
const propertyTypes = [
  { id: "any", name: "any", icon: Building },
  { id: "apartment", name: "apartment", icon: Building },
  { id: "house", name: "house", icon: Home },
  { id: "land", name: "land", icon: Landmark },
  { id: "hotel", name: "hotel", icon: Hotel },
  { id: "commercial", name: "commercial", icon: Store }
]

// Common amenities with icons
const commonAmenities = [
  { id: "wifi", name: "WiFi", icon: Wifi },
  { id: "parking", name: "Parking", icon: Car },
  { id: "generator", name: "Generator", icon: Zap },
  { id: "security", name: "Security", icon: Shield },
  { id: "water_tank", name: "Water Tank", icon: Droplets },
  { id: "gym", name: "Gym", icon: Dumbbell },
  { id: "furnished", name: "Furnished", icon: Home },
  { id: "air_conditioning", name: "Air Conditioning", icon: Zap }
]

// Popular locations
const popularLocations = [
  "Kampala", "Entebbe", "Jinja", "Mbarara", "Gulu",
  "Kololo", "Naguru", "Bukoto", "Muyenga", "Ntinda", "Bugolobi"
]

export function PropertySearchFilters({
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
  searchParams: {
    page?: string,
    location?: string,
    minPrice?: string,
    maxPrice?: string,
    bedrooms?: string,
    bathrooms?: string,
    propertyType?: string,
    amenities?: string | string[]
  }
}) {
  const router = useRouter()
  const { translate } = useLanguage()
  const [properties, setProperties] = useState<Property[]>(initialProperties.data || [])
  const [totalCount, setTotalCount] = useState(initialProperties.totalCount || 0)
  const [totalPages, setTotalPages] = useState(initialProperties.totalPages || 1)
  const [currentPage, setCurrentPage] = useState(initialProperties.currentPage || 1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(initialProperties.error)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [sortOption, setSortOption] = useState("newest")

  // Form state
  const [filters, setFilters] = useState({
    minPrice: searchParams?.minPrice?.toString() || '',
    maxPrice: searchParams?.maxPrice?.toString() || '',
    bedrooms: searchParams?.bedrooms?.toString() || 'any',
    bathrooms: searchParams?.bathrooms?.toString() || 'any',
    propertyType: searchParams?.propertyType?.toString() || 'any',
    location: searchParams?.location?.toString() || '',
    amenities: Array.isArray(searchParams?.amenities) ? searchParams.amenities :
      (searchParams?.amenities ? [searchParams.amenities.toString()] : [])
  })

  // Count active filters
  const activeFilterCount = Object.entries(filters).reduce((count, [key, value]) => {
    if (key === 'amenities' && Array.isArray(value) && value.length > 0) {
      return count + value.length
    }
    if (key !== 'amenities' && value && value !== 'any' && value !== '') {
      return count + 1
    }
    return count
  }, 0)

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Build query parameters
    const params = new URLSearchParams()

    if (filters.location) {
      params.append('location', filters.location)
    }

    if (filters.minPrice) {
      params.append('minPrice', filters.minPrice)
    }

    if (filters.maxPrice) {
      params.append('maxPrice', filters.maxPrice)
    }

    if (filters.bedrooms && filters.bedrooms !== 'any') {
      params.append('bedrooms', filters.bedrooms)
    }

    if (filters.bathrooms && filters.bathrooms !== 'any') {
      params.append('bathrooms', filters.bathrooms)
    }

    if (filters.propertyType && filters.propertyType !== 'any') {
      params.append('propertyType', filters.propertyType)
    }

    if (filters.amenities && filters.amenities.length > 0) {
      filters.amenities.forEach(amenity => {
        params.append('amenities', amenity)
      })
    }

    // Add page parameter
    params.append('page', '1')

    // Navigate to the filtered URL
    router.push(`/search-properties?${params.toString()}`)
  }

  // Handle amenity toggle
  const toggleAmenity = (amenity: string) => {
    setFilters(prev => {
      const amenities = [...prev.amenities]
      const index = amenities.indexOf(amenity)

      if (index >= 0) {
        amenities.splice(index, 1)
      } else {
        amenities.push(amenity)
      }

      return { ...prev, amenities }
    })
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    // Build query parameters
    const params = new URLSearchParams()

    if (filters.location) {
      params.append('location', filters.location)
    }

    if (filters.minPrice) {
      params.append('minPrice', filters.minPrice)
    }

    if (filters.maxPrice) {
      params.append('maxPrice', filters.maxPrice)
    }

    if (filters.bedrooms && filters.bedrooms !== 'any') {
      params.append('bedrooms', filters.bedrooms)
    }

    if (filters.bathrooms && filters.bathrooms !== 'any') {
      params.append('bathrooms', filters.bathrooms)
    }

    if (filters.propertyType && filters.propertyType !== 'any') {
      params.append('propertyType', filters.propertyType)
    }

    if (filters.amenities && filters.amenities.length > 0) {
      filters.amenities.forEach(amenity => {
        params.append('amenities', amenity)
      })
    }

    // Add page parameter
    params.append('page', page.toString())

    // Navigate to the filtered URL
    router.push(`/search?${params.toString()}`)
  }

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      bedrooms: 'any',
      bathrooms: 'any',
      propertyType: 'any',
      location: '',
      amenities: []
    })

    // Navigate to the base URL
    router.push('/search')
  }

  // Handle location quick select
  const handleLocationSelect = (location: string) => {
    setFilters(prev => ({ ...prev, location }))
  }

  return (
    <main className="flex-1">
      <section className="py-8 bg-gray-50">
        <div className="container">
          {/* Mobile filter toggle */}
          <div className="lg:hidden mb-6">
            <Button
              variant="outline"
              className="w-full flex items-center justify-between"
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            >
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <span>{translate("filters")}</span>
                {activeFilterCount > 0 && (
                  <Badge className="ml-2 bg-rose-500">{activeFilterCount}</Badge>
                )}
              </div>
              {mobileFiltersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters sidebar - desktop always visible, mobile conditionally */}
            <div className={`lg:col-span-1 ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="sticky top-24 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
                    <span>{translate("filter_properties")}</span>
                    {activeFilterCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFilters}
                        className="text-rose-500 hover:text-rose-600"
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        {translate("reset")}
                      </Button>
                    )}
                  </h2>
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <Accordion type="multiple" defaultValue={["location", "price", "bedrooms", "bathrooms", "propertyType", "amenities"]}>
                      <AccordionItem value="location">
                        <AccordionTrigger className="text-base font-medium">
                          {translate("location")}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
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
                              {popularLocations.slice(0, 6).map((location) => (
                                <Button
                                  key={location}
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className={`text-xs ${filters.location === location ? 'bg-primary text-primary-foreground' : ''}`}
                                  onClick={() => handleLocationSelect(location)}
                                >
                                  {location}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="price">
                        <AccordionTrigger className="text-base font-medium">
                          {translate("price_range")}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="minPrice">{translate("min_price")}</Label>
                                <div className="relative mt-1">
                                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <span className="text-neutral-400">$</span>
                                  </div>
                                  <Input
                                    id="minPrice"
                                    type="number"
                                    placeholder="0"
                                    value={filters.minPrice}
                                    onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                                    className="pl-7"
                                  />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="maxPrice">{translate("max_price")}</Label>
                                <div className="relative mt-1">
                                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <span className="text-neutral-400">$</span>
                                  </div>
                                  <Input
                                    id="maxPrice"
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
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="bedrooms">
                        <AccordionTrigger className="text-base font-medium">
                          {translate("bedrooms")}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
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
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="bathrooms">
                        <AccordionTrigger className="text-base font-medium">
                          {translate("bathrooms")}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <Select
                              value={filters.bathrooms}
                              onValueChange={(value) => setFilters(prev => ({ ...prev, bathrooms: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Any" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="any">{translate("any") || "Any"}</SelectItem>
                                <SelectItem value="1">1+</SelectItem>
                                <SelectItem value="2">2+</SelectItem>
                                <SelectItem value="3">3+</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="propertyType">
                        <AccordionTrigger className="text-base font-medium">
                          {translate("property_type")}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
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
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="amenities">
                        <AccordionTrigger className="text-base font-medium">
                          {translate("amenities")}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                              {commonAmenities.map((amenity) => (
                                <div key={amenity.id} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`amenity-${amenity.id}`}
                                    checked={filters.amenities.includes(amenity.id)}
                                    onCheckedChange={() => toggleAmenity(amenity.id)}
                                  />
                                  <Label htmlFor={`amenity-${amenity.id}`} className="flex items-center text-sm cursor-pointer">
                                    <amenity.icon className="h-3.5 w-3.5 mr-1.5 text-neutral-500" />
                                    <span>{translate(amenity.id) || amenity.name}</span>
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    <div className="flex flex-col gap-2">
                      <Button type="submit" disabled={loading} className="bg-rose-500 hover:bg-rose-600">
                        {loading ? translate("applying") : translate("apply_filters")}
                      </Button>
                      <Button
                        variant="outline"
                        type="button"
                        onClick={resetFilters}
                      >
                        {translate("reset_filters")}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Property results */}
            <div className="lg:col-span-3 space-y-6">
              {/* Active filters */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {filters.location && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {filters.location}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => setFilters(prev => ({ ...prev, location: '' }))}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </Badge>
                  )}
                  {filters.minPrice && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Min: ${filters.minPrice}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => setFilters(prev => ({ ...prev, minPrice: '' }))}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </Badge>
                  )}
                  {filters.maxPrice && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Max: ${filters.maxPrice}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => setFilters(prev => ({ ...prev, maxPrice: '' }))}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </Badge>
                  )}
                  {filters.bedrooms && filters.bedrooms !== 'any' && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Bed className="h-3 w-3" />
                      {filters.bedrooms}+
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => setFilters(prev => ({ ...prev, bedrooms: 'any' }))}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </Badge>
                  )}
                  {filters.bathrooms && filters.bathrooms !== 'any' && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Bath className="h-3 w-3" />
                      {filters.bathrooms}+
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => setFilters(prev => ({ ...prev, bathrooms: 'any' }))}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </Badge>
                  )}
                  {filters.propertyType && filters.propertyType !== 'any' && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {translate(filters.propertyType)}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => setFilters(prev => ({ ...prev, propertyType: 'any' }))}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </Badge>
                  )}
                  {filters.amenities.map(amenity => (
                    <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                      {translate(amenity)}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => toggleAmenity(amenity)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </Badge>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-500 hover:text-rose-600"
                    onClick={resetFilters}
                  >
                    {translate("clear_all")}
                  </Button>
                </div>
              )}

              {/* Results count and sort */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-neutral-500">
                    {totalCount > 0
                      ? `${translate("showing")} ${properties.length} ${translate("of")} ${totalCount} ${translate("properties")}`
                      : translate("no_properties_found")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-500">{translate("sort_by")}:</span>
                  <Select
                    value={sortOption}
                    onValueChange={setSortOption}
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

              {/* Error state */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
                  <p>{error}</p>
                </div>
              )}

              {/* Loading state */}
              {loading && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 content-visibility-auto mb-12">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="rounded-lg overflow-hidden border border-neutral-200 animate-pulse">
                      <div className="h-48 bg-neutral-200" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-neutral-200 rounded w-3/4" />
                        <div className="h-4 bg-neutral-200 rounded w-1/2" />
                        <div className="h-4 bg-neutral-200 rounded w-5/6" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!loading && properties.length === 0 && (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="h-12 w-12 text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">{translate("no_properties_found")}</h3>
                  <p className="text-neutral-500 mb-6">{translate("try_adjusting_filters")}</p>
                  <Button variant="outline" onClick={resetFilters}>
                    {translate("reset_filters")}
                  </Button>
                </div>
              )}

              {/* Property grid */}
              {!loading && properties.length > 0 && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 content-visibility-auto mb-12">
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <CustomPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
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
