"use client"
import React, { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import clsx from "clsx"
import Link from "next/link"
import { LogOut, X } from "lucide-react"
import { bottomMenuItems, menuItems } from "@/constants/baseRoute"
import { Button, Input } from "@/components/common"
import { getRefreshToken, removeTokens } from "@/lib/cookies"
import useAuthStore from "@/context/auth"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function Header() {
  const pathname = usePathname()
  const { logout } = useAuthStore()
  const router = useRouter()
  const [activePath, setActivePath] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

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
        icon: (<X className="size-6" />),
        title: "Logout failed.",
        description: response.message.detail,
      })
    }
    else {
      toast({
        icon: (<LogOut className="size-6 text-green-600" />),
        title: "Logout Success.",
      })
      removeTokens()
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/browse/${encodeURIComponent(searchQuery.trim())}`)
      setIsDialogOpen(false)
    }
  }

  return (
    <div id="sideNavigationLeft" className="pt-6 pb-6">
      <Link href="/" className="flex flex-row justify-start items-center gap-2 ml-1">
        <p className="text-blue-500 text-xl font-bold">AnonChat</p>
      </Link>
      <div className="flex flex-col justify-between h-full w-full">
        <div className="flex flex-col gap-6 justify-start items-start mt-4 ml-2">
          {menuItems.map(({ icon: Icon, label, path }) => (
            label === "Browse"
              ? (
                  <button
                    key={label}
                    className="flex flex-row justify-start items-center gap-3 group"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Icon className="h-6 w-6 text-3xl transition-colors duration-200 group-hover:text-blue-500" />
                    <p className="font-normal text-base group-hover:text-blue-500">{label}</p>
                  </button>
                )
              : (
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
                )
          ))}
        </div>
        <div className="flex flex-row justify-start items-center gap-3 mt-auto w-full pt-4">
          <div className="flex flex-col gap-6 justify-start items-start mt-4 ml-2">
            {bottomMenuItems.length > 0 && (
              bottomMenuItems.map(({ icon, label, path }) => (
                <Link
                  key={label}
                  href={path}
                  className="flex flex-row justify-start items-center gap-3 group"
                >
                  {React.createElement(icon, {
                    className: clsx("h-6 w-6 text-3xl transition-colors duration-200", {
                      "text-blue-500": activePath === path,
                      "group-hover:text-blue-500": activePath !== path,
                    }),
                  })}
                  <p className="font-normal text-base group-hover:text-blue-500">{label}</p>
                </Link>
              ))
            )}

            <Button
              variant="ghost"
              type="button"
              className="flex flex-row justify-start items-center gap-3 -ml-4 group"
              onClick={handleLogout}
            >
              <LogOut className="h-6 w-6 text-3xl transition-colors duration-200 group-hover:text-blue-500" />
              <p className="font-normal text-base group-hover:text-blue-500">Logout</p>
            </Button>
          </div>
        </div>
      </div>

      {/* Dialog for Browse */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Search</DialogTitle>
            <DialogDescription>
              Find the story you’re looking for
            </DialogDescription>
          </DialogHeader>
          <form className="w-full flex flex-col gap-4" onSubmit={handleSearch}>
            <Input
              className="w-full"
              isTextarea={false}
              name="search"
              placeholder="Search for the story you want..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <DialogFooter>
              <Button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">
                Search
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
