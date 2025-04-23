import { create } from "zustand"
import {
  createGoodWord,
  deleteGoodWord,
  getAllGoodWords,
  getGoodWordById,
  updateGoodWord,
} from "@/endpoints/goodWords"

interface GoodWordPayload {
  word: string
  badWordId: string
}

interface GoodWordState {
  goodWords: any[]
  selectedGoodWord: any | null
  isLoading: boolean
  error: string | null
  fetchAllGoodWords: () => Promise<void>
  fetchGoodWordById: (goodWordId: string) => Promise<void>
  addGoodWord: (payload: GoodWordPayload) => Promise<void>
  editGoodWord: (goodWordId: string, payload: GoodWordPayload) => Promise<void>
  removeGoodWord: (goodWordId: string) => Promise<void>
}

const useGoodWordStore = create<GoodWordState>((set, get) => ({
  goodWords: [],
  selectedGoodWord: null,
  isLoading: false,
  error: null,

  fetchAllGoodWords: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await getAllGoodWords()
      set({ goodWords: response.listGoodWords || [], isLoading: false })
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch good words", isLoading: false })
    }
  },

  fetchGoodWordById: async (goodWordId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await getGoodWordById(goodWordId)
      set({ selectedGoodWord: response.goodWord, isLoading: false })
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch good word", isLoading: false })
    }
  },

  addGoodWord: async (payload) => {
    set({ isLoading: true, error: null })
    try {
      const res = await createGoodWord(payload)
      await get().fetchAllGoodWords()
      set({ isLoading: false })
      return res
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to create good word", isLoading: false })
    }
  },

  editGoodWord: async (goodWordId, payload) => {
    set({ isLoading: true, error: null })
    try {
      const res = await updateGoodWord(goodWordId, payload)
      console.log("res", res, payload)
      await get().fetchAllGoodWords()
      set({ isLoading: false })
      return res
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to update good word", isLoading: false })
    }
  },

  removeGoodWord: async (goodWordId) => {
    set({ isLoading: true, error: null })
    try {
      const res = await deleteGoodWord(goodWordId)
      await get().fetchAllGoodWords()
      set({ isLoading: false })
      return res
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to delete good word", isLoading: false })
    }
  },
}))

export default useGoodWordStore
