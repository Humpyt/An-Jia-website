"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Building, FileUp, Home, Import, MessageSquare, Settings, Users } from "lucide-react"

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
    icon: FileUp,
  },
  {
    title: "Import",
    href: "/dashboard/import",
    icon: Import,
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

interface DashboardNavProps extends React.HTMLAttributes<HTMLElement> {
  isCollapsed?: boolean
}

export function DashboardNav({ className, isCollapsed, ...props }: DashboardNavProps) {
  const pathname = usePathname()

  return (
    <nav className={cn("grid gap-2 px-2", className)} {...props}>
      {items.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              isCollapsed && "justify-center",
            )}
          >
            <item.icon className={cn("h-5 w-5", isCollapsed ? "mr-0" : "mr-2")} />
            {!isCollapsed && <span>{item.title}</span>}
          </Link>
        )
      })}
    </nav>
  )
}
