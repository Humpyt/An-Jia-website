"use client"

import Link from "next/link"
import { useLanguage } from "@/components/language-switcher"

export function NavLinks() {
  const { translate } = useLanguage()

  return (
    <nav className="hidden md:flex gap-6 text-sm font-medium">
      <Link href="/" className="text-foreground">
        {translate("home")}
      </Link>
      <Link href="/properties" className="text-muted-foreground hover:text-foreground">
        {translate("properties")}
      </Link>

      <span className="text-muted-foreground opacity-50 cursor-not-allowed">
        {translate("neighborhoods")}
      </span>
      <Link href="/about" className="text-muted-foreground hover:text-foreground">
        {translate("about")}
      </Link>
      <Link href="/contact" className="text-muted-foreground hover:text-foreground">
        {translate("contact")}
      </Link>
    </nav>
  )
}
