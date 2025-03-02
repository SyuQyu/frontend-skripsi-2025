"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import clsx from "clsx"
import { usePathname, useRouter } from "next/navigation"
import { IoLogOut, IoWarningOutline } from "react-icons/io5"
import { FiLogOut } from "react-icons/fi"
import { Button, HamburgerMenu, ImageWithFallback, Sheet } from "@/components/common"
import { bottomMenuItems, menuItems } from "@/constants/baseRoute"
import { getRefreshToken, removeTokens } from "@/lib/cookies"
import useAuthStore from "@/context/auth"
import { toast } from "@/components/ui/use-toast"

export default function Header() {
  const router = useRouter()
  const { logout } = useAuthStore()
  const pathname = usePathname()
  const [activePath, setActivePath] = useState("")

  useEffect(() => {
    setActivePath(pathname)
  }, [pathname])

  const handleLogout = async () => {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      console.error("No refresh token found")
      return
    }
    const response = await logout(refreshToken)
    if (response.error) {
      toast({
        icon: (<IoWarningOutline className="size-6" />),
        title: "Logout failed.",
        description: response.message.detail,
      })
    }
    else {
      toast({
        icon: (<IoLogOut className="size-6 text-green-600" />),
        title: "Logout Success.",
      })
      removeTokens()
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    }
  }

  return (
    <header id="sideLayoutHeader" className="flex justify-between items-center">
      <Link href="/" className="flex flex-row justify-start items-center gap-2">
        <ImageWithFallback
          width={0}
          height={0}
          sizes="10vw"
          className="w-8 h-8 object-contain"
          priority={true}
          src="/images/Logo.png"
          alt="Logo"
        />
      </Link>
      <Sheet
        button={<HamburgerMenu />}
        title="Menu"
      >
        <div className="flex flex-col justify-between h-full w-full">
          <div className="flex flex-col gap-6 justify-start items-start ml-2">
            {menuItems.map(({ icon: Icon, label, path }) => (
              <Link
                key={label}
                href={path}
                className="flex flex-row justify-start items-center gap-3 group"
              >
                <Icon
                  className={clsx("h-6 w-6 text-3xl transition-colors duration-200", {
                    "text-blue-500": activePath === path,
                    "group-hover:text-blue-500": activePath !== path,
                  })}
                />
                <p className="font-normal text-base group-hover:text-blue-500">{label}</p>
              </Link>
            ))}
          </div>
          <div className="flex flex-row justify-start items-center gap-3 mt-auto w-full pt-4">
            <div className="flex flex-col gap-6 justify-start items-start mt-4 ml-2">
              {bottomMenuItems.map(({ icon: Icon, label, path }) => (
                <Link
                  key={label}
                  href={path}
                  className="flex flex-row justify-start items-center gap-3 group"
                >
                  <Icon
                    className={clsx("h-6 w-6 text-3xl transition-colors duration-200", {
                      "text-blue-500": activePath === path,
                      "group-hover:text-blue-500": activePath !== path,
                    })}
                  />
                  <p className="font-normal text-base group-hover:text-blue-500">{label}</p>
                </Link>
              ))}
              <Button
                variant="ghost"
                type="button"
                className="flex flex-row justify-start items-center gap-3 -ml-4 group"
                onClick={handleLogout}
              >
                <FiLogOut
                  className={clsx("h-6 w-6 text-3xl transition-colors duration-200 group-hover:text-blue-500")}
                />
                <p className="font-normal text-base group-hover:text-blue-500">Logout</p>
              </Button>
            </div>
          </div>
        </div>
      </Sheet>
    </header>
  )
}
