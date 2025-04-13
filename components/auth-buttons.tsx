"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-switcher"

export function AuthButtons() {
  const { translate } = useLanguage()
  
  return (
    <>
      <Button variant="outline" size="sm" className="hidden md:flex">
        {translate("sign_in")}
      </Button>
      <Button size="sm" className="hidden md:flex">
        {translate("sign_up")}
      </Button>
    </>
  )
}
