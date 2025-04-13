"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Image from "next/image"
import { BarChart3, Building, Home, MessageSquare, Settings, Upload, Users } from "lucide-react"

const items = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Properties",
    href: "/dashboard/properties",
    icon: Building,
  },
  {
    title: "Inquiries",
    href: "/dashboard/inquiries",
    icon: MessageSquare,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Bulk Upload",
    href: "/dashboard/bulk-upload",
    icon: Upload,
  },
  {
    title: "Team",
    href: "/dashboard/team",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
          <Image src="/logo.png" alt="An Jia You Xuan" width={120} height={40} className="h-8 w-auto" />
        </Link>
        <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-2">
            {items.map((item, index) => {
              const Icon = item.icon
              return (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                    pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
