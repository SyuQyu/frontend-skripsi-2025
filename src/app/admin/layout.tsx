import type { Metadata } from "next"
import { Suspense } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export const metadata: Metadata = {
  title: "AnonChat",
  description: "AnonChat is a platform for sharing traumatic experiences from both childhood and adulthood. We aim to foster self-empathy by embracing our shared humanity and deepening our understanding of childhood trauma.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // <html lang="en" className={clsx("scroll-smooth", ROBOTO.variable)}>
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <Suspense fallback={<div className="flex h-full w-full items-center justify-center">Loading...</div>}>
          {children}
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
    // </html>
  )
}
