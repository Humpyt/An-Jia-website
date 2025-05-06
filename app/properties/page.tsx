import Link from "next/link"
import Image from "next/image"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Footer } from "@/components/footer"
import { NavLinks } from "@/components/nav-links"
import { AuthButtons } from "@/components/auth-buttons"
import { PageHeader } from "@/components/page-header"
import { Suspense } from "react"
import { Spinner } from "@/components/spinner"
import { ImprovedProperties } from "@/components/improved-properties"
// Import the initial data provider
import { getInitialPropertiesData } from "./page-data"

export default async function PropertiesPage(props: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { searchParams } = props
  const params = Object.fromEntries(Object.entries(searchParams))

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

  // Get initial data for server-side rendering
  const initialData = await getInitialPropertiesData();

  console.log(`Server: Providing ${initialData.properties.length} initial properties out of ${initialData.totalCount} total`);

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
        imagePath="/images/headers/luxury-property-header.jpg"
        height="medium"
      />

      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      }>
        <ImprovedProperties initialData={initialData} />
      </Suspense>

      <Footer />
    </div>
  )
}
