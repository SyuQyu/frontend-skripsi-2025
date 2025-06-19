import { create } from "zustand"
import {
  checkBadWord,
  checkBadWordNotExact,
  createBadWord,
  deleteBadWord,
  getAllBadWords,
  getBadWordById,
  updateBadWord,
} from "@/endpoints/badWords"

interface BadWordPayload {
  word: string
}

interface BadWordState {
  badWords: any[]
  selectedBadWord: any | null
  isLoading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  fetchAllBadWords: (page: number, limit: number) => Promise<any>
  fetchAllWithoutPagination: () => Promise<any>
  fetchBadWordById: (badWordId: string) => Promise<void>
  addBadWord: (payload: BadWordPayload) => Promise<void>
  editBadWord: (badWordId: string, payload: BadWordPayload) => Promise<void>
  removeBadWord: (badWordId: string) => Promise<void>
  checkIfBadWordNotExact: (word: string, page: number, limit: number) => Promise<any>
  checkIfBadWord: (word: string) => Promise<any>
}

const useBadWordStore = create<BadWordState>((set, get) => ({
  badWords: [],
  selectedBadWord: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },

  fetchAllBadWords: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null })
    try {
      const res = await getAllBadWords(page, limit)
      set({
        badWords: res.badWords || [],
        isLoading: false,
        pagination: {
          page,
          limit,
          total: res.total || 0,
          totalPages: res.totalPages || 1,
        },
      })
      return res
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch bad words", isLoading: false })
    }
  },

  fetchAllWithoutPagination: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await getAllBadWords(1, 1000) // Fetch all without pagination
      set({ badWords: res.badWords || [], isLoading: false })
      return res
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch bad words", isLoading: false })
    }
  },

  fetchBadWordById: async (badWordId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await getBadWordById(badWordId)
      set({ selectedBadWord: response.badWord, isLoading: false })
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch bad word", isLoading: false })
    }
  },

  addBadWord: async (payload) => {
    set({ isLoading: true, error: null })
    try {
      const res = await createBadWord(payload)
      const { pagination } = get()
      await get().fetchAllBadWords(pagination.page, pagination.limit)
      set({ isLoading: false })
      return res
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to create bad word", isLoading: false })
    }
  },

  editBadWord: async (badWordId, payload) => {
    set({ isLoading: true, error: null })
    try {
      const res = await updateBadWord(badWordId, payload)
      const { pagination } = get()
      await get().fetchAllBadWords(pagination.page, pagination.limit)
      set({ isLoading: false })
      return res
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to update bad word", isLoading: false })
    }
  },

  removeBadWord: async (badWordId) => {
    set({ isLoading: true, error: null })
    try {
      const res = await deleteBadWord(badWordId)
      const { pagination } = get()
      await get().fetchAllBadWords(pagination.page, pagination.limit)
      set({ isLoading: false })
      return res
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to delete bad word", isLoading: false })
    }
  },

  checkIfBadWordNotExact: async (word, page, limit) => {
    set({ isLoading: true, error: null })
    try {
      const res = await checkBadWordNotExact(word, page, limit)
      set({ isLoading: false })
      return res
    }
    catch (error: any) {
      set({ error: error.res?.data?.message || "Failed to check word", isLoading: false })
    }
  },

  checkIfBadWord: async (word) => {
    set({ isLoading: true, error: null })
    try {
      const res = await checkBadWord(word)
      set({ isLoading: false })
      return res
    }
    catch (error: any) {
      set({ error: error.res?.data?.message || "Failed to check word", isLoading: false })
    }
  },
}))

export default useBadWordStore
