import dynamic from "next/dynamic"

const LeftNavigation = dynamic(() => import("@/components/layouts/sideLayout/leftNavigation"))
const RightNavigation = dynamic(() => import("@/components/layouts/sideLayout/rightNavigation"))
const Header = dynamic(() => import("@/components/layouts/sideLayout/header"))

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div id="sideLayouts">
      <LeftNavigation />
      <Header />
      <main id="mainSideLayouts">
        {children}
      </main>
      <RightNavigation />
    </div>
  )
}
