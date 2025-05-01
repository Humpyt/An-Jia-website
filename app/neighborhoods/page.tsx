import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/components/language-switcher"
import { StarRating } from "@/components/star-rating"
import { Neighborhood } from "@/app/types/neighborhood"

async function getNeighborhoods(): Promise<Neighborhood[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/anjia/v1/neighborhoods`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch neighborhoods');
    }
    
    const data = await response.json();
    return data.neighborhoods;
  } catch (error) {
    console.error('Error fetching neighborhoods:', error);
    return [];
  }
}

export default async function NeighborhoodsPage() {
  const neighborhoods = await getNeighborhoods();
  const { translate } = useLanguage()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="An Jia You Xuan" width={150} height={50} priority className="h-10 w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/properties" className="text-sm font-medium hover:text-rose-500 transition-colors">
              {translate("properties")}
            </Link>
            <Link href="/neighborhoods" className="text-sm font-medium text-rose-500">
              {translate("neighborhoods")}
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-rose-500 transition-colors">
              {translate("about")}
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" className="hidden md:flex hover:bg-rose-50 hover:text-rose-500" asChild>
              <Link href="/list-property">{translate("list_property")}</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-neutral-200 shadow-sm gap-2 hidden md:flex hover:border-neutral-300"
            >
              {translate("sign_in")}
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="bg-rose-50 py-10 md:py-16">
          <div className="container">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                {translate("discover_neighborhoods")}
              </h1>
              <p className="mt-4 text-neutral-600">
                {translate("neighborhoods_description")}
              </p>
            </div>
          </div>
        </section>
        <section className="py-10">
          <div className="container">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {neighborhoods.map((neighborhood: Neighborhood) => (
                <Card key={neighborhood.id} className="overflow-hidden border-0 shadow-lg rounded-xl">
                  <div className="aspect-[16/9] relative">
                    <img
                      src={neighborhood.image || "/placeholder.svg"}
                      alt={neighborhood.name}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                      <h3 className="text-xl font-bold">{neighborhood.name}</h3>
                      <p className="text-sm text-white/80">{neighborhood.properties} {translate("properties")}</p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-neutral-500">{translate("avg_price")}</span>
                      <span className="font-semibold">${neighborhood.averagePrice}/mo</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-neutral-500">{translate("safety_rating")}</span>
                      <StarRating rating={neighborhood.stats.safetyRating} size="sm" />
                    </div>
                    <p className="text-sm text-neutral-600 mb-4">
                      {translate(`${neighborhood.id}_description`)}
                    </p>
                    <Button asChild className="w-full bg-rose-500 hover:bg-rose-600 text-white">
                      <Link href={`/neighborhoods/${neighborhood.id}`}>{translate("view_properties")}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="py-10 bg-neutral-50">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{translate("find_perfect_location")}</h2>
                <p className="mt-4 text-neutral-600">
                  {translate("location_help_description")}
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <Button className="bg-rose-500 hover:bg-rose-600 text-white">
                    {translate("contact_expert")}
                  </Button>
                  <Button variant="outline">{translate("compare_neighborhoods")}</Button>
                </div>
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src="/images/04/WhatsApp Image 2025-04-09 at 11.37.58 AM (2).jpeg"
                  alt="Kampala skyline"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
