import { create } from "zustand"
import {
  checkBadWord,
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
  fetchAllBadWords: () => Promise<void>
  fetchBadWordById: (badWordId: string) => Promise<void>
  addBadWord: (payload: BadWordPayload) => Promise<void>
  editBadWord: (badWordId: string, payload: BadWordPayload) => Promise<void>
  removeBadWord: (badWordId: string) => Promise<void>
  checkIfBadWord: (word: string) => Promise<any>
}

const useBadWordStore = create<BadWordState>((set, get) => ({
  badWords: [],
  selectedBadWord: null,
  isLoading: false,
  error: null,

  fetchAllBadWords: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await getAllBadWords()
      set({ badWords: response.badWords || [], isLoading: false })
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
      await get().fetchAllBadWords()
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
      await get().fetchAllBadWords()
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
      await get().fetchAllBadWords()
      set({ isLoading: false })
      return res
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to delete bad word", isLoading: false })
    }
  },

  checkIfBadWord: async (word) => {
    set({ isLoading: true, error: null })
    try {
      const response = await checkBadWord(word)
      set({ isLoading: false })
      return response
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to check word", isLoading: false })
    }
  },
}))

export default useBadWordStore
