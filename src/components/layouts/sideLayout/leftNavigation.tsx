import React, { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import clsx from "clsx"
import Link from "next/link"
import { BellIcon, LogOut, X } from "lucide-react"
import { bottomMenuItems, menuItems } from "@/constants/baseRoute"
import { Button, Input } from "@/components/common"
import { getRefreshToken, removeTokens } from "@/lib/cookies"
import useAuthStore from "@/context/auth"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import useNotificationStore from "@/context/notification"

export default function Header() {
  const pathname = usePathname()
  const { logout } = useAuthStore()
  const router = useRouter()
  const [activePath, setActivePath] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Notifikasi
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const { notifications, fetchNotificationsByUser, markAsRead, removeNotification, isLoading } = useNotificationStore()
  // Ganti dengan user id dari context/auth jika ada
  const userId = useAuthStore.getState().user?.id

  useEffect(() => {
    setActivePath(pathname)
  }, [pathname])

  useEffect(() => {
    if (isNotifOpen && userId) {
      fetchNotificationsByUser(userId)
    }
  }, [isNotifOpen, userId, fetchNotificationsByUser])

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
          {/* Tombol Notifikasi */}
          <button
            className="flex flex-row justify-start items-center gap-3 group"
            onClick={() => setIsNotifOpen(true)}
          >
            <BellIcon className="h-6 w-6 text-3xl transition-colors duration-200 group-hover:text-blue-500" />
            <p className="font-normal text-base group-hover:text-blue-500">Notifications</p>
          </button>
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

      {/* Dialog for Notifications */}
      <Dialog open={isNotifOpen} onOpenChange={setIsNotifOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
            <DialogDescription>
              Notifikasi like dan reply terbaru Anda
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-72 overflow-y-auto space-y-2">
            {isLoading
              ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                )
              : notifications.length === 0
                ? (
                    <div className="text-center py-8 text-muted-foreground">No notifications.</div>
                  )
                : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        className={`flex items-start gap-2 p-2 rounded ${notif.isRead ? "bg-muted" : "bg-blue-50"}`}
                      >
                        <div className="flex-1">
                          <div className="font-medium">{notif.title || "Notification"}</div>
                          <div className="text-xs text-muted-foreground">{notif.body || notif.message}</div>
                          {notif.url && (
                            <Button
                              size="sm"
                              variant="link"
                              className="px-0"
                              onClick={() => {
                                // Tutup dialog lalu redirect
                                setIsNotifOpen(false)
                                router.push(notif.url)
                              }}
                            >
                              Lihat Detail
                            </Button>
                          )}
                        </div>
                        {!notif.isRead && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsRead(notif.id)}
                          >
                            Mark as read
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeNotification(notif.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNotifOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
