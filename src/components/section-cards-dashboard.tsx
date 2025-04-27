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
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-white lg:px-6 dark:dark:*:data-[slot=card]:bg-slate-950">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total Posts</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {totalPosts}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +12.5%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month
            {" "}
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-slate-500 dark:text-slate-400">
            Visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total Users</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {totalUsers}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingDownIcon className="size-3" />
              -20%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period
            {" "}
            <TrendingDownIcon className="size-4" />
          </div>
          <div className="text-slate-500 dark:text-slate-400">
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
