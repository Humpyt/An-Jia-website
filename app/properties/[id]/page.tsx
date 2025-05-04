import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getPropertyById, incrementPropertyViews } from "@/app/actions/wordpress-properties"
import Link from "next/link"
import Image from "next/image"
import PropertyDetail from "@/components/property-detail"
import type { Property } from "@/app/types/property";
import { Footer } from "@/components/footer"
import { NavLinks } from "@/components/nav-links"
import { AuthButtons } from "@/components/auth-buttons"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ErrorBoundary } from "@/components/error-boundary"
import { PageHeader } from "@/components/page-header"

// Description enhancement removed


type Props = {
  params: {
    id: string;
  };
};

// This function runs before the page component and can safely access params
export async function generateMetadata({ params }: Props) {
  return {
    title: `Property ${params.id} - An Jia You Xuan`,
  };
}

export default async function PropertyPage(props: Props) {
  // Use the id from props directly in async operations
  const id = props.params.id;

  // Fetch property data
  let property: Property | null = null;
  try {
    console.log('Fetching property with ID:', id)
    property = await getPropertyById(id)
    console.log('Fetched property:', property)

    // If the property is null or undefined, throw 404
    if (!property) {
      console.log('Property not found')
      notFound()
    }

    // No description enhancement - using original description
    if (!property.description || property.description.trim() === '') {
      // If there's no description, add a basic one
      property.description = `${property.title} is a ${property.bedrooms}-bedroom ${property.propertyType} located in ${property.location}.`;
    }

    // Increment view count (fire and forget)
    incrementPropertyViews(id).catch(console.error)
  } catch (error) {
    console.error("Error fetching property:", error)
    if (!property) {
        notFound();
    }
  }

  // Ensure property is defined before rendering
  if (!property) {
      notFound();
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

      <PageHeader
        title={property.title}
        description={property.location}
        imagePath={property.images[0] || "/images/headers/property-detail.jpg"}
        imageAlt={property.title}
        height="medium"
      />

      <ErrorBoundary>
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-64 bg-gray-200 rounded"></div>
              <div className="h-4 w-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        }>
          {/* Use a key to ensure React re-renders when property changes */}
          <div key={property.id}>
            <PropertyDetail property={property} />
          </div>
        </Suspense>
      </ErrorBoundary>

      <Footer />
    </div>
  )
}
