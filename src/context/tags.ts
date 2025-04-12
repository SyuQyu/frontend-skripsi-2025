import { create } from "zustand"
import { getAllTags, getPopularTags } from "@/endpoints/tags"

interface TagState {
  tags: any[]
  popularTags: any[]
  isLoading: boolean
  error: string | null
  fetchAllTags: () => Promise<void>
  fetchPopularTags: () => Promise<void>
}

const useTagStore = create<TagState>(set => ({
  tags: [],
  popularTags: [],
  isLoading: false,
  error: null,

  fetchAllTags: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await getAllTags()
      set({ tags: response.tags, isLoading: false })
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch tags", isLoading: false })
    }
  },

  fetchPopularTags: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await getPopularTags()
      set({ popularTags: response.tags, isLoading: false })
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch popular tags", isLoading: false })
    }
  },
}))

export default useTagStore
