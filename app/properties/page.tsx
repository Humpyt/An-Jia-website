import Link from "next/link"
import Image from "next/image"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Footer } from "@/components/footer"
import { NavLinks } from "@/components/nav-links"
import { AuthButtons } from "@/components/auth-buttons"
import { PropertiesContent } from "@/components/properties-content"
// Import the WordPress properties action instead of the mock data one
import { getPropertiesWithFilters } from "@/app/actions/wordpress-properties"

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Parse filters
  const page = searchParams.page ? Number.parseInt(searchParams.page as string) : 1
  const limit = 12
  const offset = (page - 1) * limit

  const location = searchParams.location as string | undefined
  const minPrice = searchParams.minPrice ? Number.parseInt(searchParams.minPrice as string) : undefined
  const maxPrice = searchParams.maxPrice ? Number.parseInt(searchParams.maxPrice as string) : undefined
  const bedrooms = searchParams.bedrooms ? Number.parseInt(searchParams.bedrooms as string) : undefined
  const bathrooms = searchParams.bathrooms ? Number.parseInt(searchParams.bathrooms as string) : undefined
  const amenities = searchParams.amenities
    ? Array.isArray(searchParams.amenities)
      ? searchParams.amenities
      : [searchParams.amenities]
    : undefined

  // Fetch properties with filters
  let properties = [];
  let error = null;
  
  try {
    console.log('Properties page: Fetching properties with filters');
    properties = await getPropertiesWithFilters({
      limit,
      offset,
      filters: {
        location,
        minPrice,
        maxPrice,
        bedrooms,
        bathrooms,
        amenities,
      },
    });
    console.log(`Properties page: Fetched ${properties.length} properties`);
  } catch (err: any) {
    console.error('Error in properties page:', err);
    error = err.message || 'Failed to fetch properties';
  }

  // Format data to match what PropertiesContent expects
  const propertiesData = { data: properties || [], error };
  
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

      <PropertiesContent initialProperties={propertiesData} searchParams={searchParams} />

      <Footer />
    </div>
  )
}
