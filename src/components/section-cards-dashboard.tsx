"use client"
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import useDashboardStore from "@/context/dashboardData"

export function SectionCards() {
  const { fetchTotalUsers, fetchTotalPosts, totalPosts, totalUsers } = useDashboardStore()
  useEffect(() => {
    const fetchData = async () => {
      await fetchTotalUsers()
      await fetchTotalPosts()
    }
    fetchData()
  }, [fetchTotalUsers, fetchTotalPosts])
  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-2 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-white lg:px-6 dark:dark:*:data-[slot=card]:bg-slate-950">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total Posts</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {totalPosts}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total Users</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {totalUsers}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
