"use client"
import { useEffect } from "react"
import { DataTable } from "@/components/tablesData/posts/data-table"
import usePostStore from "@/context/post"

export default function Page() {
  const { fetchAllPosts, posts } = usePostStore()
  useEffect(() => {
    const fetchData = async () => {
      await fetchAllPosts()
    }
    fetchData()
  }, [])
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <DataTable data={posts} />
        </div>
      </div>
    </div>
  )
}
