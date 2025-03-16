import axiosInstance from "@/lib/axiosInstance"

interface PostPayload {
  content: string
  tagId?: string | null
}

export function createPost(payload: PostPayload) {
  return axiosInstance.post("/posts", payload)
}

export function getAllPosts() {
  return axiosInstance.get("/posts/all")
}

export function getPostByTags(tagName: string) {
  return axiosInstance.get(`/posts/tag/${tagName}`)
}

export function getPostByContent(content: string) {
  return axiosInstance.get(`/posts/search/${content}`)
}

export function getPostById(postId: string) {
  return axiosInstance.get(`/posts/${postId}`)
}

export function updatePost(postId: string, payload: PostPayload) {
  return axiosInstance.put(`/posts/${postId}`, payload)
}

export function deletePost(postId: string) {
  return axiosInstance.delete(`/posts/${postId}`)
}
