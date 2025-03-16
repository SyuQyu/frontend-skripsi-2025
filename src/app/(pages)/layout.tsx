import type { Metadata } from "next"
import SideLayout from "@/components/layouts/sideLayout/sideLayout"
import FooterLayout from "@/components/layouts/footerLayout/footerLayout"

export const metadata: Metadata = {
  title: "AnonChat",
  description: "AnonChat is a platform for sharing traumatic experiences from both childhood and adulthood. We aim to foster self-empathy by embracing our shared humanity and deepening our understanding of childhood trauma.",
}

export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SideLayout>
      {children}
      <FooterLayout />
    </SideLayout>

  )
}
