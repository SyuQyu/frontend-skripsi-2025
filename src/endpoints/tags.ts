import { fetchInstance } from "@/lib/fetchInstance"

export function getPopularTags() {
  return fetchInstance("/tags/top/popular")
}

export function getAllTags() {
  return fetchInstance("/tags/all")
}
