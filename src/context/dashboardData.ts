import { create } from "zustand"
import {
  getGrowthPosts,
  getGrowthUsers,
  getTotalPosts,
  getTotalUsers,
} from "@/endpoints/dashboardData"

interface DashboardState {
  totalUsers: number | null
  totalPosts: number | null
  growthUsers: number | null
  growthPosts: number | null
  isLoading: boolean
  error: string | null
  fetchTotalUsers: () => Promise<void>
  fetchTotalPosts: () => Promise<void>
  fetchGrowthUsers: (day?: string) => Promise<void>
  fetchGrowthPosts: (day?: string) => Promise<void>
}

const useDashboardStore = create<DashboardState>(set => ({
  totalUsers: null,
  totalPosts: null,
  growthUsers: null,
  growthPosts: null,
  isLoading: false,
  error: null,

  fetchTotalUsers: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await getTotalUsers()
      set({ totalUsers: response.data, isLoading: false })
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch total users", isLoading: false })
    }
  },

  fetchTotalPosts: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await getTotalPosts()
      set({ totalPosts: response.data, isLoading: false })
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch total posts", isLoading: false })
    }
  },

  fetchGrowthUsers: async (day?: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await getGrowthUsers(day)
      set({ growthUsers: response.data, isLoading: false })
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch growth users", isLoading: false })
    }
  },

  fetchGrowthPosts: async (day?: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await getGrowthPosts(day)
      set({ growthPosts: response.data, isLoading: false })
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch growth posts", isLoading: false })
    }
  },
}))

export default useDashboardStore
