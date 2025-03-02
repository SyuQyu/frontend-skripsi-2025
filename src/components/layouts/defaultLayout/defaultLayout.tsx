import dynamic from "next/dynamic"
import FooterLayout from "@/components/layouts/footerLayout/footerLayout"

const Header = dynamic(() => import("@/components/layouts/defaultLayout/header"))
const Footer = dynamic(() => import("@/components/layouts/defaultLayout/footer"))

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div id="defaultLayouts">
      <Header />
      <main id="main">
        {children}
      </main>
      <Footer />
      <FooterLayout />

    </div>
  )
}
