import Link from "next/link"
import Image from "next/image"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Footer } from "@/components/footer"
import { NavLinks } from "@/components/nav-links"
import { AuthButtons } from "@/components/auth-buttons"
import { PageHeader } from "@/components/page-header"
import { Suspense } from "react"
import { Spinner } from "@/components/spinner"
import { ClientProperties } from "@/components/client-properties"
// Import the WordPress properties action as fallback
import { getPropertiesWithFilters } from "@/app/actions/wordpress-properties"

export default async function PropertiesPage(props: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { searchParams } = props

  // Wait for searchParams to be ready
  const searchParamsReady = await Promise.resolve(searchParams)

  // Sanitize searchParams to only include the values we need
  const params = {
    page: searchParamsReady?.page?.toString(),
    location: searchParamsReady?.location?.toString(),
    minPrice: searchParamsReady?.minPrice?.toString(),
    maxPrice: searchParamsReady?.maxPrice?.toString(),
    bedrooms: searchParamsReady?.bedrooms?.toString(),
    bathrooms: searchParamsReady?.bathrooms?.toString(),
    propertyType: searchParamsReady?.propertyType?.toString(),
    moveInDate: searchParamsReady?.moveInDate?.toString(),
    occupants: searchParamsReady?.occupants?.toString(),
    amenities: searchParamsReady?.amenities
  }

  // Parse filters
  const page = params?.page ? Number.parseInt(params.page) : 1
  const limit = 12
  const offset = (page - 1) * limit

  const filters = {
    location: params?.location || undefined,
    minPrice: params?.minPrice ? Number.parseInt(params.minPrice) : undefined,
    maxPrice: params?.maxPrice ? Number.parseInt(params.maxPrice) : undefined,
    bedrooms: params?.bedrooms && params.bedrooms !== 'any' ? Number.parseInt(params.bedrooms) : undefined,
    bathrooms: params?.bathrooms && params.bathrooms !== 'any' ? Number.parseInt(params.bathrooms) : undefined,
    propertyType: params?.propertyType && params.propertyType !== 'any' ? params.propertyType : undefined,
    amenities: params?.amenities
      ? Array.isArray(params.amenities)
        ? params.amenities
        : [params.amenities]
      : undefined
  }

  // Fetch initial data from fallback properties
  let properties = [];
  let totalCount = 0;
  let totalPages = 0;
  let error = null;

  try {
    // Import fallback properties directly
    const { FALLBACK_PROPERTIES } = await import('@/lib/property-fallback');

    // Use fallback properties
    let filteredProperties = [...FALLBACK_PROPERTIES];

    // Apply filters
    if (filters.location) {
      filteredProperties = filteredProperties.filter(p =>
        p.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.minPrice) {
      filteredProperties = filteredProperties.filter(p =>
        parseInt(p.price) >= filters.minPrice
      );
    }

    if (filters.maxPrice) {
      filteredProperties = filteredProperties.filter(p =>
        parseInt(p.price) <= filters.maxPrice
      );
    }

    if (filters.bedrooms) {
      filteredProperties = filteredProperties.filter(p =>
        parseInt(p.bedrooms) === filters.bedrooms
      );
    }

    if (filters.bathrooms) {
      filteredProperties = filteredProperties.filter(p =>
        parseInt(p.bathrooms) === filters.bathrooms
      );
    }

    if (filters.propertyType) {
      filteredProperties = filteredProperties.filter(p =>
        p.propertyType === filters.propertyType
      );
    }

    // Calculate total count and pages
    totalCount = filteredProperties.length;
    totalPages = Math.ceil(totalCount / limit);

    // Apply pagination
    properties = filteredProperties.slice(offset, offset + limit);

    console.log(`Server: Providing ${properties.length} initial properties out of ${totalCount} total`);
  } catch (err) {
    console.error('Error fetching initial properties:', err);
    error = 'Failed to fetch initial properties';
  }

  // Format data to match what ClientProperties expects
  const propertiesData = {
    data: properties || [],
    totalCount,
    totalPages,
    currentPage: page,
    error
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="An Jia You Xuan" width={150} height={50} priority className="h-10 w-auto" />
          </Link>
          <NavLinks />
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <AuthButtons />
          </div>
        </div>
      </header>

      <PageHeader
        title="Properties"
        description="Find your perfect property in our extensive listings"
        height="medium"
      />

      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      }>
        <ClientProperties initialData={{
          properties: properties || [],
          totalCount,
          totalPages,
          currentPage: page,
          error
        }} />
      </Suspense>

      <Footer />
    </div>
  )
}
