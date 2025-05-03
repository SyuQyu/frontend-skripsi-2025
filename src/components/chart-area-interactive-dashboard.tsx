"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import useDashboardStore from "@/context/dashboardData"

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "count",
    color: "#3b82f6",
  },
} satisfies ChartConfig

export function ChartAreaInteractiveUsers() {
  const { fetchGrowthUsers, growthUsers } = useDashboardStore()

  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState<"90" | "30" | "7">("30")
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7")
    }
  }, [isMobile])

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await fetchGrowthUsers(timeRange)
      setLoading(false)
    }
    fetchData()
  }, [fetchGrowthUsers, timeRange])

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>Total Users</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            Total for the last
            {" "}
            {timeRange === "90" ? "3 months" : `${timeRange} days`}
          </span>
          <span className="@[540px]/card:hidden">
            Last
            {" "}
            {timeRange === "90" ? "3 months" : `${timeRange} days`}
          </span>
        </CardDescription>
        <div className="absolute right-4 top-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(value) => {
              if (value)
                setTimeRange(value as "90" | "30" | "7")
            }}
            variant="outline"
            className="@[767px]/card:flex hidden"
          >
            <ToggleGroupItem value="90" className="h-8 px-2.5">
              Last 3 months
            </ToggleGroupItem>
            <ToggleGroupItem value="30" className="h-8 px-2.5">
              Last 30 days
            </ToggleGroupItem>
            <ToggleGroupItem value="7" className="h-8 px-2.5">
              Last 7 days
            </ToggleGroupItem>
          </ToggleGroup>
          <Select
            value={timeRange}
            onValueChange={value => setTimeRange(value as "90" | "30" | "7")}
          >
            <SelectTrigger
              className="@[767px]/card:hidden flex w-40"
              aria-label="Select a time range"
            >
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          {loading
            ? (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  Loading chart...
                </div>
              )
            : (
                <AreaChart data={Array.isArray(growthUsers) ? growthUsers : []}>
                  <defs>
                    <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-desktop)"
                        stopOpacity={1.0}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-desktop)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="var(--color-desktop)"
                    fill="url(#fillDesktop)"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              )}
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function ChartAreaInteractivePost() {
  const { fetchGrowthPosts, growthPosts } = useDashboardStore()

  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState<"90" | "30" | "7">("30")
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7")
    }
  }, [isMobile])

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await fetchGrowthPosts(timeRange)
      setLoading(false)
    }
    fetchData()
  }, [fetchGrowthPosts, timeRange])

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>Total Posts</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            Total for the last
            {" "}
            {timeRange === "90" ? "3 months" : `${timeRange} days`}
          </span>
          <span className="@[540px]/card:hidden">
            Last
            {" "}
            {timeRange === "90" ? "3 months" : `${timeRange} days`}
          </span>
        </CardDescription>
        <div className="absolute right-4 top-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(value) => {
              if (value)
                setTimeRange(value as "90" | "30" | "7")
            }}
            variant="outline"
            className="@[767px]/card:flex hidden"
          >
            <ToggleGroupItem value="90" className="h-8 px-2.5">
              Last 3 months
            </ToggleGroupItem>
            <ToggleGroupItem value="30" className="h-8 px-2.5">
              Last 30 days
            </ToggleGroupItem>
            <ToggleGroupItem value="7" className="h-8 px-2.5">
              Last 7 days
            </ToggleGroupItem>
          </ToggleGroup>
          <Select
            value={timeRange}
            onValueChange={value => setTimeRange(value as "90" | "30" | "7")}
          >
            <SelectTrigger
              className="@[767px]/card:hidden flex w-40"
              aria-label="Select a time range"
            >
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          {loading
            ? (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  Loading chart...
                </div>
              )
            : (
                <AreaChart data={Array.isArray(growthPosts) ? growthPosts : []}>
                  <defs>
                    <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-desktop)"
                        stopOpacity={1.0}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-desktop)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="var(--color-desktop)"
                    fill="url(#fillDesktop)"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              )}
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
