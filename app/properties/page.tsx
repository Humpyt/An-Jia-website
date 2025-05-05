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

  // Fetch properties with filters
  let properties = [];
  let totalCount = 0;
  let totalPages = 0;
  let error = null;

  try {
    console.log('Properties page: Fetching properties with filters');

    // Build query parameters for the API request
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString()
    });

    if (filters.location) queryParams.set('location', filters.location);
    if (filters.minPrice) queryParams.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) queryParams.set('maxPrice', filters.maxPrice.toString());
    if (filters.bedrooms) queryParams.set('bedrooms', filters.bedrooms.toString());
    if (filters.bathrooms) queryParams.set('bathrooms', filters.bathrooms.toString());
    if (filters.propertyType) queryParams.set('propertyType', filters.propertyType);
    if (filters.amenities) queryParams.set('amenities', filters.amenities.join(','));

    // Use our API endpoint instead of the server action
    // Use absolute URL to ensure it works in all environments
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    console.log(`Fetching properties from: ${baseUrl}/api/properties?${queryParams.toString()}`);

    const response = await fetch(`${baseUrl}/api/properties?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    properties = result.properties;
    totalCount = result.totalCount;
    totalPages = result.totalPages;

    console.log(`Properties page: Fetched ${properties.length} properties out of ${totalCount} total (${totalPages} pages)`);
  } catch (err: any) {
    console.error('Error in properties page:', err);
    error = err.message || 'Failed to fetch properties';

    // Use the server action as fallback
    try {
      console.log('Properties page: Trying server action as fallback');
      const result = await getPropertiesWithFilters({
        limit,
        offset,
        filters: {
          location: filters.location,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          bedrooms: filters.bedrooms,
          bathrooms: filters.bathrooms,
          propertyType: filters.propertyType,
          amenities: filters.amenities,
        },
      });

      properties = result.properties;
      totalCount = result.totalCount;
      totalPages = result.totalPages;
      error = null;

      console.log(`Properties page (fallback): Fetched ${properties.length} properties out of ${totalCount} total (${totalPages} pages)`);
    } catch (fallbackErr: any) {
      console.error('Error in properties page fallback:', fallbackErr);
      error = fallbackErr.message || 'Failed to fetch properties';
    }
  }

  // Format data to match what PropertiesContent expects
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
