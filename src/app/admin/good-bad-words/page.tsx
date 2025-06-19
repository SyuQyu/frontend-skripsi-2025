"use client"
import { useEffect } from "react"
import { DataTable } from "@/components/tablesData/goodWords/data-table"
import useGoodWordStore from "@/context/goodWords"
import useBadWordStore from "@/context/badWords"

export default function Page() {
  const { fetchAllGoodWords, goodWords } = useGoodWordStore()
  const { fetchAllWithoutPagination, badWords } = useBadWordStore()
  useEffect(() => {
    const fetchData = async () => {
      await fetchAllGoodWords()
      await fetchAllWithoutPagination()
    }
    fetchData()
  }, [])
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <DataTable data={goodWords} badWords={badWords} />
        </div>
      </div>
    </div>
  )
}
