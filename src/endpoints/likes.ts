import { fetchInstance } from "@/lib/fetchInstance"

export function createLikes(payload: any) {
  return fetchInstance("/likes", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function getLikesByParentId(parentId: string, type: string) {
  const endpoint = type === "post" ? `/likes/post/${parentId}` : `/likes/reply/${parentId}`
  return fetchInstance(endpoint)
}

export function getLikesByUserId(userId: string) {
  return fetchInstance(`/likes/user/${userId}`)
}

export function getAllLikes() {
  return fetchInstance("/likes/all")
}

export function deleteLikes(replyId: string) {
  return fetchInstance(`/likes/${replyId}`, {
    method: "DELETE",
  })
}
