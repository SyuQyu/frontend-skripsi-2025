"use client"

import {
  BellIcon,
  CreditCardIcon,
  LogOut,
  LogOutIcon,
  MoreVerticalIcon,
  UserCircleIcon,
  X,
} from "lucide-react"

import { useRouter } from "next/navigation"
import * as React from "react"
import { toast } from "@/components/ui/use-toast"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { getRefreshToken, removeTokens } from "@/lib/cookies"
import useAuthStore from "@/context/auth"

// Tambahan import untuk notification
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import useNotificationStore from "@/context/notification"
import { Button } from "@/components/ui/button"

export function NavUser({
  user,
}: {
  user: {
    id: string
    username: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const { logout } = useAuthStore()
  const router = useRouter()

  // State untuk dialog notifikasi
  const [isNotifOpen, setIsNotifOpen] = React.useState(false)
  const { notifications, fetchNotificationsByUser, markAsRead, removeNotification, isLoading } = useNotificationStore()
  const userId = user?.id // Ganti dengan user.id jika ada id

  // Fetch notifikasi saat dialog dibuka
  React.useEffect(() => {
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

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user?.username} alt={user?.username} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.username}</span>
                <span className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {user?.email}
                </span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.username} alt={user?.username} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.username}</span>
                  <span className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserCircleIcon />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsNotifOpen(true)}>
                <BellIcon />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      {/* Notifikasi Pop Up Dialog */}
      <Dialog open={isNotifOpen} onOpenChange={open => setIsNotifOpen(open)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
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
    </SidebarMenu>
  )
}
