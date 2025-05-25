import { create } from "zustand"
import {
  createCommonWord,
  deleteCommonWord,
  getAllCommonWords,
  getCommonWordById,
  updateCommonWord,
} from "@/endpoints/commonWords"

interface CommonWordPayload {
  word: string
  description?: string
}

interface CommonWordState {
  commonWords: any[]
  selectedCommonWord: any | null
  isLoading: boolean
  error: string | null
  fetchAllCommonWords: () => Promise<void>
  fetchCommonWordById: (id: string) => Promise<void>
  addCommonWord: (payload: CommonWordPayload) => Promise<void>
  editCommonWord: (id: string, payload: CommonWordPayload) => Promise<void>
  removeCommonWord: (id: string) => Promise<void>
}

const useCommonWordStore = create<CommonWordState>((set, get) => ({
  commonWords: [],
  selectedCommonWord: null,
  isLoading: false,
  error: null,

  fetchAllCommonWords: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await getAllCommonWords()
      set({ commonWords: response.words, isLoading: false })
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch common words", isLoading: false })
    }
  },

  fetchCommonWordById: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const response = await getCommonWordById(id)
      set({ selectedCommonWord: response.word, isLoading: false })
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch common word", isLoading: false })
    }
  },

  addCommonWord: async (payload) => {
    set({ isLoading: true, error: null })
    try {
      const res = await createCommonWord(payload)
      await get().fetchAllCommonWords()
      set({ isLoading: false })
      return res
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to create common word", isLoading: false })
    }
  },

  editCommonWord: async (id, payload) => {
    set({ isLoading: true, error: null })
    try {
      const res = await updateCommonWord(id, payload)
      await get().fetchAllCommonWords()
      set({ isLoading: false })
      return res
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to update common word", isLoading: false })
    }
  },

  removeCommonWord: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const res = await deleteCommonWord(id)
      await get().fetchAllCommonWords()
      set({ isLoading: false })
      return res
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to delete common word", isLoading: false })
    }
  },
}))

export default useCommonWordStore
