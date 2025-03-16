"use client"
import dynamic from "next/dynamic"
import { useEffect } from "react"
import useAuthStore from "@/context/auth"

const LeftNavigation = dynamic(() => import("@/components/layouts/sideLayout/leftNavigation"))
const RightNavigation = dynamic(() => import("@/components/layouts/sideLayout/rightNavigation"))
const Header = dynamic(() => import("@/components/layouts/sideLayout/header"))

export default function SideLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { getLoggedInUser } = useAuthStore()
  useEffect(() => {
    getLoggedInUser()
  }, [])
  return (
    <div id="sideLayouts">
      <LeftNavigation />
      <Header />
      <div id="mainSideLayouts">
        {children}
      </div>
      <RightNavigation />
    </div>
  )
}
