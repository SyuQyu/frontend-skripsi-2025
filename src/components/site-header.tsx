"use client"
import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  const pathname = usePathname()
  const pageTitle = pathname?.split("/admin/")[1]?.split("/")[0] || "Dashboard"
  const pageTitleCapitalized = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1)
  const pageTitleFormatted = pageTitleCapitalized.replace(/-/g, " ")
  const pageTitleFormattedCapitalized = pageTitleFormatted.charAt(0).toUpperCase() + pageTitleFormatted.slice(1)
  const pageTitleFormattedCapitalizedWithSpaces = pageTitleFormattedCapitalized.replace(/-/g, " ")

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium capitalize">
          {decodeURIComponent(pageTitleFormattedCapitalizedWithSpaces)}
        </h1>
      </div>
    </header>
  )
}
