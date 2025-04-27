import { ChartAreaInteractivePost, ChartAreaInteractiveUsers } from "@/components/chart-area-interactive-dashboard"
import { SectionCards } from "@/components/section-cards-dashboard"

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 lg:px-6 flex flex-col gap-4">
            <ChartAreaInteractiveUsers />
            <ChartAreaInteractivePost />
          </div>
          {/* <DataTable data={data} /> */}
        </div>
      </div>
    </div>
  )
}
