"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import clsx from "clsx"
import { usePathname, useRouter } from "next/navigation"
import { LogOut, X } from "lucide-react"
import { Button, HamburgerMenu, Input, Sheet } from "@/components/common"
import { bottomMenuItems, menuItems } from "@/constants/baseRoute"
import { getRefreshToken, removeTokens } from "@/lib/cookies"
import useAuthStore from "@/context/auth"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function Header() {
  const router = useRouter()
  const { logout } = useAuthStore()
  const pathname = usePathname()
  const [activePath, setActivePath] = useState("")
  const [isSheetOpen, setIsSheetOpen] = useState(false) // sheet nav open state
  const [isDialogOpen, setIsDialogOpen] = useState(false) // dialog browse open state
  const [searchQuery, setSearchQuery] = useState("")

  // Set active path untuk styling active menu
  useEffect(() => {
    setActivePath(pathname)
  }, [pathname])

  // Logout handler
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
      setIsSheetOpen(false) // tutup sheet saat logout
    }
  }

  // Navigasi tertutup dan sheet ditutup
  const handleMenuClick = (path: string) => {
    setIsSheetOpen(false)
    router.push(path)
  }

  // Submit search pada browse dialog
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/browse/${encodeURIComponent(searchQuery.trim())}`)
      setIsDialogOpen(false)
      setIsSheetOpen(false) // opsional, tutup sheet juga saat search jika masih terbuka
      setSearchQuery("")
    }
  }

  return (
    <>
      <div id="sideLayoutHeader" className="flex justify-between items-center">
        <Link href="/" className="flex flex-row justify-start items-center gap-2">
          <p className="text-blue-500 text-xl font-bold">AnonChat</p>
        </Link>
        <Sheet
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          button={<HamburgerMenu />}
          title="Menu"
        >
          <div className="flex flex-col justify-between h-full w-full">
            <div className="flex flex-col gap-6 justify-start items-start ml-2">
              {menuItems.map(({ icon: Icon, label, path }) =>
                label === "Browse"
                  ? (
                      <button
                        key={label}
                        type="button"
                        className="flex flex-row justify-start items-center gap-3 group font-normal text-base text-inherit"
                        onClick={() => {
                          setIsDialogOpen(true)
                          setIsSheetOpen(false) // tutup sheet saat buka dialog browse
                        }}
                      >
                        <Icon className="h-6 w-6 text-3xl transition-colors duration-200 group-hover:text-blue-500" />
                        <p className="group-hover:text-blue-500">{label}</p>
                      </button>
                    )
                  : (
                      <button
                        key={label}
                        type="button"
                        onClick={() => handleMenuClick(path)}
                        className={clsx(
                          "flex flex-row justify-start items-center gap-3 group font-normal text-base",
                          { "text-blue-500": activePath === path, "text-inherit": activePath !== path },
                        )}
                      >
                        <Icon
                          className={clsx("h-6 w-6 text-3xl transition-colors duration-200", {
                            "text-blue-500": activePath === path,
                            "group-hover:text-blue-500": activePath !== path,
                          })}
                        />
                        <p className="group-hover:text-blue-500">{label}</p>
                      </button>
                    ),
              )}
            </div>
            <div className="flex flex-row justify-start items-center gap-3 mt-auto w-full pt-4">
              <div className="flex flex-col gap-6 justify-start items-start mt-4 ml-2">
                {bottomMenuItems.map(({ icon: Icon, label, path }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleMenuClick(path)}
                    className={clsx(
                      "flex flex-row justify-start items-center gap-3 group font-normal text-base",
                      { "text-blue-500": activePath === path, "text-inherit": activePath !== path },
                    )}
                  >
                    <Icon
                      className={clsx("h-6 w-6 text-3xl transition-colors duration-200", {
                        "text-blue-500": activePath === path,
                        "group-hover:text-blue-500": activePath !== path,
                      })}
                    />
                    <p className="group-hover:text-blue-500">{label}</p>
                  </button>
                ))}
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
        </Sheet>
      </div>
      {/* Dialog for Browse search */}
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
              autoFocus
            />
            <DialogFooter>
              <Button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                Search
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
