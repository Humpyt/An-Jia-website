import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { PropertyCategories } from "@/components/property-categories"
import { FeaturedProperties } from "@/components/featured-properties"
import { SearchBar } from "@/components/search-bar"
import { NeighborhoodShowcase } from "@/components/neighborhood-showcase"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Footer } from "@/components/footer"
import { ImportedPropertiesShowcase } from "@/components/imported-properties-showcase"
import { HomeContent } from "@/components/home-content"
import { NavLinks } from "@/components/nav-links"
import { AuthButtons } from "@/components/auth-buttons"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/50">
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
      <main className="flex-1">
        <HomeContent />
      </main>
      <Footer />
    </div>
  )
}
