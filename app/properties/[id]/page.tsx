import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getPropertyById } from "@/lib/property-service"
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

type Props = {
  params: {
    id: string;
  };
};

// This function runs before the page component and can safely access params
export async function generateMetadata({ params }: Props) {
  try {
    // Try to get property data for the metadata
    const property = await getPropertyById(params.id);

    if (property) {
      return {
        title: `${property.title} - An Jia You Xuan`,
        description: `${property.bedrooms} bedroom property in ${property.location}`,
        openGraph: {
          title: property.title,
          description: `${property.bedrooms} bedroom property in ${property.location}`,
          images: property.images[0] ? [property.images[0]] : undefined,
        },
      };
    }
  } catch (error) {
    console.error(`Error generating metadata for property ${params.id}:`, error);
  }

  // Fallback metadata
  return {
    title: `Property ${params.id} - An Jia You Xuan`,
  };
}

export default async function PropertyPage(props: Props) {
  // Use the id from props directly in async operations
  const id = props.params.id;

  // Try to fetch initial property data from the server
  let property: Property | null = null;
  let dataSource = 'server';
  let error = null;

  try {
    // Fetch property data using our centralized property service
    console.log(`[SERVER] Attempting to fetch property ${id}`);
    property = await getPropertyById(id);

    if (!property) {
      console.error(`[SERVER] Property ${id} not found`);
      return notFound();
    }

    console.log(`[SERVER] Successfully fetched property ${id} from ${property._source || 'unknown source'}`);
    dataSource = property._source || 'server';
  } catch (err: any) {
    console.error(`[SERVER] Error fetching property ${id}:`, err);
    error = err.message || 'Failed to load property';

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
      images: ["/images/properties/property-placeholder.jpg"],
      propertyType: "property"
    };
  }

  // Use the first property image for the header if available, otherwise use a placeholder
  const headerImagePath = property.images && property.images.length > 0
    ? property.images[0]
    : "/images/properties/property-placeholder.jpg";

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
        imagePath={headerImagePath}
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
            <ClientPropertyDetails
              id={id}
              initialProperty={property}
              dataSource={dataSource}
              serverError={error}
            />
          </div>
        </Suspense>
      </ErrorBoundary>

      <Footer />
    </div>
  )
}
