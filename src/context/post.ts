import { create } from "zustand"
import {
  IncrementPostView,
  checkWord,
  createPost,
  deletePost,
  getAllPosts,
  getPostByContent,
  getPostById,
  getPostByTags,
  getPostByUser,
  updatePost,
} from "@/endpoints/post"

interface PostPayload {
  content: string
  tagId?: string | null
}

interface PostState {
  posts: any[]
  selectedPost: any | null
  isLoading: boolean
  error: string | null
  fetchAllPosts: () => Promise<void>
  fetchPostById: (postId: string) => Promise<void>
  addPost: (payload: PostPayload) => Promise<void>
  editPost: (postId: string, payload: PostPayload) => Promise<void>
  removePost: (postId: string) => Promise<void>
  fetchPostByTags: (tagName: string) => Promise<void>
  searchPostByContent: (content: string) => Promise<void>
  fetchPostByUser: (userId: string) => Promise<void>
  checkWord: (text: string) => Promise<void>
  IncrementPostView: (postId: string, userId: string) => Promise<void>
}

const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  selectedPost: null,
  isLoading: false,
  error: null,

  fetchAllPosts: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await getAllPosts()
      set({ posts: response.posts, isLoading: false })
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch posts", isLoading: false })
    }
  },

  fetchPostByTags: async (tagName) => {
    set({ isLoading: true, error: null })
    try {
      const response = await getPostByTags(tagName)
      set({ posts: response.posts, isLoading: false })
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch posts", isLoading: false })
    }
  },

  IncrementPostView: async (postId, userId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await IncrementPostView(postId, userId)
      set({ isLoading: false })
      return response
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch posts", isLoading: false })
    }
  },

  checkWord: async (text) => {
    set({ isLoading: true, error: null })
    try {
      const response = await checkWord(text)
      set({ isLoading: false })
      return response
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch posts", isLoading: false })
    }
  },

  fetchPostByUser: async (userId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await getPostByUser(userId)
      set({ posts: response.posts, isLoading: false })
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch posts", isLoading: false })
    }
  },

  searchPostByContent: async (content) => {
    set({ isLoading: true, error: null })
    try {
      const response = await getPostByContent(content)
      set({ posts: response.posts, isLoading: false })
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch posts", isLoading: false })
    }
  },

  fetchPostById: async (postId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await getPostById(postId)
      set({ selectedPost: response.post, isLoading: false })
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch post", isLoading: false })
    }
  },

  addPost: async (payload) => {
    set({ isLoading: true, error: null })
    try {
      await createPost(payload)
      set({ isLoading: false })
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to create post", isLoading: false })
    }
  },

  editPost: async (postId, payload) => {
    set({ isLoading: true, error: null })
    try {
      await updatePost(postId, payload)
      set({ isLoading: false })
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to update post", isLoading: false })
    }
  },

  removePost: async (postId) => {
    set({ isLoading: true, error: null })
    try {
      const res = await deletePost(postId)
      get().fetchAllPosts()
      set({ isLoading: false })
      return res
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to delete post", isLoading: false })
    }
  },
}))

export default usePostStore
