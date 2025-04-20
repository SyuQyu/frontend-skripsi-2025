"use client"
import { useEffect } from "react"
import { DataTable } from "@/components/tablesData/tags/data-table"
import useTagStore from "@/context/tags"

export default function Page() {
  const { fetchAllTags, tags } = useTagStore()
  useEffect(() => {
    const fetchData = async () => {
      await fetchAllTags()
    }
    fetchData()
  }, [])
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <DataTable data={tags} />
        </div>
      </div>
    </div>
  )
}
