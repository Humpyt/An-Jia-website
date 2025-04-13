import type { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { UserNav } from "@/components/dashboard/user-nav"
import { MobileNav } from "@/components/dashboard/mobile-nav"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-6 md:px-8">
        <Link href="/" className="hidden md:flex items-center gap-2">
          <Image src="/logo.png" alt="An Jia You Xuan" width={120} height={40} className="h-8 w-auto" />
        </Link>
        <MobileNav />
        <div className="flex flex-1 items-center justify-end gap-4">
          <UserNav />
        </div>
      </header>
      <div className="grid flex-1 md:grid-cols-[220px_1fr]">
        <aside className="hidden border-r bg-muted/40 md:block">
          <DashboardNav />
        </aside>
        <main className="flex flex-col p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
