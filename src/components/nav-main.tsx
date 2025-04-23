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
import { DropdownMenuSeparator } from "./ui/dropdown-menu"

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
        <DropdownMenuSeparator />
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
                        ? "bg-blue-600 text-slate-50 dark:bg-blue-50 dark:text-slate-900"
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
