"use client"
import { useEffect } from "react"
import { DataTable } from "@/components/tablesData/replies/data-table"
import UserRepliesStore from "@/context/replies"

export default function Page() {
  const { fetchAllReplies, replies } = UserRepliesStore()
  useEffect(() => {
    const fetchData = async () => {
      await fetchAllReplies()
    }
    fetchData()
  }, [])
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <DataTable data={replies} />
        </div>
      </div>
    </div>
  )
}
