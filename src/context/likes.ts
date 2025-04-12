import { create } from "zustand"
import {
  createLikes,
  deleteLikes,
  getAllLikes,
  getLikesByParentId,
  getLikesByUserId,
} from "@/endpoints/likes"

interface LikePayload {
  userId: string
  postId?: string
  replyId?: string
  type: string // "post" or "reply"
}

interface LikeState {
  likes: any[]
  isLoading: boolean
  error: string | null
  fetchAllLikes: () => Promise<void>
  fetchLikesByParent: (parentId: string, type: string) => Promise<any>
  fetchLikesByUser: (userId: string) => Promise<void>
  addLike: (payload: LikePayload) => Promise<void>
  removeLike: (likeId: string) => Promise<void>
}

const useLikeStore = create<LikeState>((set, get) => ({
  likes: [],
  isLoading: false,
  error: null,

  fetchAllLikes: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await getAllLikes()
      set({ likes: response.likes, isLoading: false })
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch likes", isLoading: false })
    }
  },

  fetchLikesByParent: async (parentId, type) => {
    set({ isLoading: true, error: null })
    try {
      const response = await getLikesByParentId(parentId, type)
      set({ likes: response.likes, isLoading: false })
      return response.likes
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch likes", isLoading: false })
    }
  },

  fetchLikesByUser: async (userId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await getLikesByUserId(userId)
      set({ likes: response.likes, isLoading: false })
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch user likes", isLoading: false })
    }
  },

  addLike: async (payload) => {
    set({ isLoading: true, error: null })

    try {
      const { postId, replyId, type, userId } = payload

      if (!userId) {
        throw new Error("User ID is required")
      }

      if (!postId && !replyId) {
        throw new Error("Either postId or replyId must be provided")
      }

      const parentId = postId ?? replyId // Ensures a valid string is used

      if (!parentId) {
        throw new Error("Invalid postId or replyId")
      }

      // Fetch existing likes
      const response = await get().fetchLikesByParent(parentId, type)
      const existingLike = response.find((like: { userId: string }) => like.userId === userId)

      if (existingLike) {
        // If the user already liked, remove the like
        await get().removeLike(existingLike.id)
        set({ isLoading: false })
        return
      }

      // Otherwise, add the like
      await createLikes(payload)
      set({ isLoading: false })
    }
    catch (error: any) {
      set({ error: error.message || "Failed to toggle like", isLoading: false })
      throw new Error(error.message || "Failed to toggle like")
    }
  },

  removeLike: async (likeId) => {
    set({ isLoading: true, error: null })
    try {
      await deleteLikes(likeId)
      set({ isLoading: false })
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to delete like", isLoading: false })
    }
  },
}))

export default useLikeStore
