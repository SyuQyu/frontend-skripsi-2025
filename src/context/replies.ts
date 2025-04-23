import { create } from "zustand"
import {
  IncrementReplyView,
  createReplies,
  deleteReplies,
  getAllReplies,
} from "@/endpoints/replies"

interface ReplyPayload {
  content: string
  postId: string
}

interface ReplyState {
  replies: any[]
  selectedReply: any | null
  isLoading: boolean
  error: string | null
  fetchAllReplies: () => Promise<void>
  addReply: (payload: ReplyPayload) => Promise<void>
  removeReply: (replyId: string) => Promise<void>
  IncrementReplyView: (replyId: string, userId: string) => Promise<void>
}

const useReplyStore = create<ReplyState>(set => ({
  replies: [],
  selectedReply: null,
  isLoading: false,
  error: null,

  fetchAllReplies: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await getAllReplies()
      set({ replies: response.replies, isLoading: false })
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch replies", isLoading: false })
    }
  },

  addReply: async (payload) => {
    set({ isLoading: true, error: null })
    try {
      await createReplies(payload)
      set({ isLoading: false })
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to create reply", isLoading: false })
    }
  },

  IncrementReplyView: async (replyId, userId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await IncrementReplyView(replyId, userId)
      set({ isLoading: false })
      return response
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to increment reply view", isLoading: false })
    }
  },

  removeReply: async (replyId) => {
    set({ isLoading: true, error: null })
    try {
      await deleteReplies(replyId)
      set({ isLoading: false })
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to delete reply", isLoading: false })
    }
  },
}))

export default useReplyStore
