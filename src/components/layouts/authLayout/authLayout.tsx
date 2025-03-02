import dynamic from "next/dynamic"
import FooterLayout from "@/components/layouts/footerLayout/footerLayout"

const LeftNavigation = dynamic(() => import("@/components/layouts/authLayout/leftNavigation"))
const RightNavigation = dynamic(() => import("@/components/layouts/authLayout/rightNavigation"))
const Header = dynamic(() => import("@/components/layouts/authLayout/header"))
export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div id="authLayouts">
      <LeftNavigation />
      <Header />
      <main id="mainAuthLayouts">
        {children}
      </main>
      <RightNavigation />
      <FooterLayout />
    </div>
  )
}
