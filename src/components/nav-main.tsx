"use client"

import { type LucideIcon, MailIcon, PlusCircleIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { clsx } from "clsx" // make sure this is installed via `npm i clsx`

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  url: string
  icon?: LucideIcon
}

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  const isActivePath = (url: string) => {
    const fullPath = `/admin${url}`
    const cleanPath = pathname?.split("#")[0]

    // If the pathname is just "/admin" or "/admin/", make the root item ("/") active
    if (url === "/" && (cleanPath === "/admin" || cleanPath === "/admin/")) {
      return true
    }

    return cleanPath === fullPath || cleanPath?.startsWith(`${fullPath}/`)
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {/* Quick Create Button */}
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="min-w-8 bg-slate-900 text-slate-50 duration-200 ease-linear hover:bg-slate-900/90 hover:text-slate-50 active:bg-slate-900/90 active:text-slate-50 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 dark:hover:text-slate-900 dark:active:bg-slate-50/90 dark:active:text-slate-900"
            >
              <PlusCircleIcon />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <MailIcon />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Sidebar Menu Items */}
        <SidebarMenu>
          {items.map((item) => {
            const active = isActivePath(item.url)
            return (
              <SidebarMenuItem key={item.title}>
                <Link href={`/admin${item.url}`} className="w-full">
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={clsx(
                      "w-full flex items-center gap-2",
                      active
                        ? "bg-slate-900 text-slate-50 dark:bg-slate-50 dark:text-slate-900"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800",
                    )}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
