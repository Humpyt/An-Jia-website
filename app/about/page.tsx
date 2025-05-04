"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Footer } from "@/components/footer"
import { AboutContent } from "@/components/about-content"
import { NavLinks } from "@/components/nav-links"
import { AuthButtons } from "@/components/auth-buttons"
import { PageHeader } from "@/components/page-header"

export default function AboutPage() {
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

      <PageHeader
        title="About Us"
        description="Connecting Kampala's Renters with Their Perfect Home"
        height="medium"
      />

      <AboutContent />
      <Footer />
    </div>
  )
}
