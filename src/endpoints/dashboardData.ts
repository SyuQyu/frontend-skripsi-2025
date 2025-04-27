import { fetchInstance } from "@/lib/fetchInstance"

export function getTotalUsers() {
  return fetchInstance("/dashboard/total-users")
}

export function getTotalPosts() {
  return fetchInstance("/dashboard/total-posts")
}

export function getGrowthUsers(days?: string) {
  return fetchInstance(`/dashboard/growth-users?days=${days}`)
}

export function getGrowthPosts(days?: string) {
  return fetchInstance(`/dashboard/growth-posts?days=${days}`)
}
