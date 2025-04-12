import { fetchInstance } from "@/lib/fetchInstance"

interface PostPayload {
  content: string
  tagId?: string | null
}

export function createPost(payload: PostPayload) {
  return fetchInstance("/posts", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function getAllPosts() {
  return fetchInstance("/posts/all")
}

export function getPostByUser(userId: string) {
  return fetchInstance(`/posts/user/${encodeURIComponent(userId)}`)
}

export function getPostByTags(tagName: string) {
  return fetchInstance(`/posts/tag/${encodeURIComponent(tagName)}`)
}

export function getPostByContent(content: string) {
  return fetchInstance(`/posts/search/${encodeURIComponent(content)}`)
}

export function getPostById(postId: string) {
  return fetchInstance(`/posts/${postId}`)
}

export function checkWord(text: string) {
  return fetchInstance("/posts/check/word", {
    method: "POST",
    body: JSON.stringify({ text }),
  })
}

export function updatePost(postId: string, payload: PostPayload) {
  return fetchInstance(`/posts/${postId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  })
}

export function deletePost(postId: string) {
  return fetchInstance(`/posts/${postId}`, {
    method: "DELETE",
  })
}
