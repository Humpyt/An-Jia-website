import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getPropertyById, incrementPropertyViews } from "@/app/actions/properties"
import PropertyDetail from "@/components/property-detail"
import { Footer } from "@/components/footer"

export default async function PropertyPage({ params }: { params: { id: string } }) {
  // Fetch property data
  let property
  try {
    property = await getPropertyById(params.id)

    // Increment view count (fire and forget)
    incrementPropertyViews(params.id).catch(console.error)
  } catch (error) {
    console.error("Error fetching property:", error)
    notFound()
  }

  if (!property) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<div>Loading...</div>}>
        <PropertyDetail property={property} />
      </Suspense>
      <Footer />
    </div>
  )
}
