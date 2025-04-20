import { fetchInstance } from "@/lib/fetchInstance"

export function getPopularTags() {
  return fetchInstance("/tags/top/popular")
}

export function getAllTags() {
  return fetchInstance("/tags/all")
}

export function getTagById(tagId: string) {
  return fetchInstance(`/tags/${tagId}`)
}

export function createTag(data: any) {
  return fetchInstance("/tags", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function updateTag(tagId: string, data: any) {
  return fetchInstance(`/tags/${tagId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export function deleteTag(tagId: string) {
  return fetchInstance(`/tags/${tagId}`, {
    method: "DELETE",
  })
}
