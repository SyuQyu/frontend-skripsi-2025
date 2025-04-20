import { create } from "zustand"
import {
  createTag,
  deleteTag,
  getAllTags,
  getPopularTags,
  getTagById,
  updateTag,
} from "@/endpoints/tags"

interface TagState {
  tags: any[]
  popularTags: any[]
  isLoading: boolean
  error: string | null
  fetchAllTags: () => Promise<void>
  fetchPopularTags: () => Promise<void>
  fetchTagById: (tagId: string) => Promise<any>
  createTag: (data: any) => Promise<void>
  updateTag: (tagId: string, data: any) => Promise<void>
  deleteTag: (tagId: string) => Promise<void>
}

const useTagStore = create<TagState>((set, get) => ({
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

  fetchTagById: async (tagId: string) => {
    try {
      return await getTagById(tagId)
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch tag by ID" })
      return null
    }
  },

  createTag: async (data: any) => {
    set({ isLoading: true, error: null })
    try {
      const res = await createTag(data)
      await get().fetchAllTags()
      set({ isLoading: false })
      return res
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to create tag", isLoading: false })
    }
  },

  updateTag: async (tagId: string, data: any) => {
    set({ isLoading: true, error: null })
    try {
      const res = await updateTag(tagId, data)
      await get().fetchAllTags()
      set({ isLoading: false })
      return res
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to update tag", isLoading: false })
    }
  },

  deleteTag: async (tagId: string) => {
    set({ isLoading: true, error: null })
    try {
      const res = await deleteTag(tagId)
      await get().fetchAllTags()
      set({ isLoading: false })
      return res
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to delete tag", isLoading: false })
    }
  },
}))

export default useTagStore
