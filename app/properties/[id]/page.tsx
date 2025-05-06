import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getPropertyById, incrementPropertyViews } from "@/app/actions/wordpress-properties"
import Link from "next/link"
import Image from "next/image"
import type { Property } from "@/app/types/property";
import { Footer } from "@/components/footer"
import { NavLinks } from "@/components/nav-links"
import { AuthButtons } from "@/components/auth-buttons"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ErrorBoundary } from "@/components/error-boundary"
import { PageHeader } from "@/components/page-header"
import { Spinner } from "@/components/spinner"
import { ClientPropertyDetails } from "@/components/client-property-details"

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

  // Try to fetch initial property data from the server
  let property: Property;

  try {
    // First try to get property data from the server action
    console.log(`Server: Attempting to fetch property ${id} from server action`);
    const serverProperty = await getPropertyById(id);

    if (serverProperty) {
      console.log(`Server: Successfully fetched property ${id} from server action`);
      property = serverProperty;
    } else {
      throw new Error('Property not found');
    }
  } catch (error) {
    console.error(`Server: Error fetching property ${id}:`, error);

    // Create a minimal property object for initial rendering
    // The client component will handle the actual data fetching
    property = {
      id,
      title: "Loading Property...",
      description: "Loading property details...",
      location: "Loading...",
      bedrooms: "0",
      bathrooms: "0",
      price: "0",
      currency: "USD",
      amenities: [],
      images: ["/images/headers/property-detail.jpg"],
      propertyType: "property"
    };
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
            <Spinner size="lg" />
          </div>
        }>
          {/* Use a key to ensure React re-renders when property changes */}
          <div key={property.id}>
            <ClientPropertyDetails id={id} initialProperty={property} />
          </div>
        </Suspense>
      </ErrorBoundary>

      <Footer />
    </div>
  )
}
