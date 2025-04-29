import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getPropertyById, incrementPropertyViews } from "@/app/actions/wordpress-properties"
import Link from "next/link"
import Image from "next/image"
import PropertyDetail from "@/components/property-detail"
import { Footer } from "@/components/footer"
import { NavLinks } from "@/components/nav-links"
import { AuthButtons } from "@/components/auth-buttons"
import { LanguageSwitcher } from "@/components/language-switcher"

export default async function PropertyPage({ params }: { params: { id: string } }) {
  // Fetch property data
  let property
  try {
    console.log('Fetching property with ID:', params.id)
    property = await getPropertyById(params.id)
    console.log('Fetched property:', property)

    // If the property is null or undefined, throw 404
    if (!property) {
      console.log('Property not found')
      notFound()
    }

    // Increment view count (fire and forget)
    incrementPropertyViews(params.id).catch(console.error)
  } catch (error) {
    console.error("Error fetching property:", error)
    notFound()
  }

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

      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 bg-gray-200 rounded"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      }>
        <PropertyDetail property={property} />
      </Suspense>

      <Footer />
    </div>
  )
}
