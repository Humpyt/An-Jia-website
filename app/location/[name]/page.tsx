import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Building, MapPin } from "lucide-react"

import { getPropertiesByNeighborhood } from "@/app/actions/wordpress-neighborhoods"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { LocationFilters } from "@/components/location-filters"

// Define the props type
type LocationPageProps = {
  params: {
    name: string
  }
  searchParams: {
    page?: string
    minPrice?: string
    maxPrice?: string
    bedrooms?: string
    bathrooms?: string
    propertyType?: string
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const locationName = decodeURIComponent(params.name)
  return {
    title: `Properties in ${locationName.charAt(0).toUpperCase() + locationName.slice(1)} - An Jia You Xuan`,
    description: `Explore properties available in ${locationName} neighborhood. Find apartments, houses, and more.`,
  }
}

// Location page component
export default async function LocationPage({ params, searchParams }: LocationPageProps) {
  // Get the location name from the URL
  const locationName = decodeURIComponent(params.name)
  const formattedLocationName = locationName.charAt(0).toUpperCase() + locationName.slice(1)

  // Parse pagination parameters
  const page = searchParams.page ? parseInt(searchParams.page) : 1
  const limit = 12
  const offset = (page - 1) * limit

  // Parse filter parameters
  const filters = {
    minPrice: searchParams.minPrice ? parseInt(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? parseInt(searchParams.maxPrice) : undefined,
    bedrooms: searchParams.bedrooms && searchParams.bedrooms !== 'any' ? parseInt(searchParams.bedrooms) : undefined,
    bathrooms: searchParams.bathrooms && searchParams.bathrooms !== 'any' ? parseInt(searchParams.bathrooms) : undefined,
    propertyType: searchParams.propertyType && searchParams.propertyType !== 'any' ? searchParams.propertyType : undefined,
  }

  // Fetch properties for this location
  const { properties, totalCount, totalPages } = await getPropertiesByNeighborhood(formattedLocationName, {
    limit,
    offset,
    filters
  })

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero section */}
        <section className="relative h-[250px] md:h-[300px]">
          <div className="absolute inset-0">
            {properties.length > 0 && properties[0].images.length > 0 ? (
              <Image
                src={properties[0].images[0]}
                alt={formattedLocationName}
                fill
                className="object-cover brightness-[0.7]"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-rose-500 to-rose-600" />
            )}
          </div>
          <div className="absolute inset-0 flex items-center">
            <div className="container">
              <Button variant="outline" size="sm" className="mb-4 bg-background/80" asChild>
                <Link href="/neighborhoods">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Neighborhoods
                </Link>
              </Button>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Properties in {formattedLocationName}</h1>
              <div className="flex items-center text-white/90 text-sm md:text-base">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{formattedLocationName}, Kampala</span>
                <Separator className="mx-2 h-4 bg-white/20" orientation="vertical" />
                <Building className="h-4 w-4 mr-1" />
                <span>{totalCount} Properties</span>
              </div>
            </div>
          </div>
        </section>

        {/* Filters and properties section */}
        <section className="py-8">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Filters sidebar */}
              <div className="md:col-span-1">
                <LocationFilters
                  currentFilters={filters}
                  locationName={formattedLocationName}
                />
              </div>

              {/* Properties grid */}
              <div className="md:col-span-3">
                {properties.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {properties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center mt-8">
                        <div className="flex space-x-2">
                          {page > 1 && (
                            <Button variant="outline" asChild>
                              <Link href={`/location/${params.name}?page=${page - 1}`}>
                                Previous
                              </Link>
                            </Button>
                          )}

                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <Button
                              key={pageNum}
                              variant={pageNum === page ? "default" : "outline"}
                              asChild
                            >
                              <Link href={`/location/${params.name}?page=${pageNum}`}>
                                {pageNum}
                              </Link>
                            </Button>
                          ))}

                          {page < totalPages && (
                            <Button variant="outline" asChild>
                              <Link href={`/location/${params.name}?page=${page + 1}`}>
                                Next
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-semibold mb-2">No properties found</h2>
                    <p className="text-muted-foreground mb-6">
                      We couldn't find any properties in {formattedLocationName} matching your criteria.
                    </p>
                    <Button asChild>
                      <Link href="/neighborhoods">
                        Explore Other Neighborhoods
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
