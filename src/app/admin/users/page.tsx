"use client"
import { useEffect } from "react"
import { DataTable } from "@/components/tablesData/users/data-table"
import useUserStore from "@/context/users"
// import useAuthStore from "@/context/auth"
// import { getRefreshToken } from "@/lib/cookies"
// import { refreshToken as refreshTokenEndpoint } from "@/endpoints/auth"

export default function Page() {
  const { fetchAllUsers, users } = useUserStore()
  // const refreshToken: any = getRefreshToken()
  useEffect(() => {
    const fetchData = async () => {
      await fetchAllUsers()
      // const res = await refreshTokenEndpoint(refreshToken)
      // console.log(res)
    }
    fetchData()
  }, [])
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <DataTable data={users} />
        </div>
      </div>
    </div>
  )
}
