"use client"
import { useEffect } from "react"
import { DataTable } from "@/components/tablesData/commonWords/data-table"
import useCommonWordStore from "@/context/commonWords"

export default function Page() {
  const { fetchAllCommonWords, commonWords } = useCommonWordStore()
  useEffect(() => {
    const fetchData = async () => {
      await fetchAllCommonWords()
    }
    fetchData()
  }, [])
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <DataTable data={commonWords} />
        </div>
      </div>
    </div>
  )
}
