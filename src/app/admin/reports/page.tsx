"use client"
import { useEffect } from "react"
import { DataTable } from "@/components/tablesData/reports/data-table"
import useReportStore from "@/context/reports"

export default function Page() {
  const { fetchAllReports, reports } = useReportStore()
  useEffect(() => {
    const fetchData = async () => {
      await fetchAllReports()
    }
    fetchData()
  }, [])
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <DataTable data={reports} />
        </div>
      </div>
    </div>
  )
}
