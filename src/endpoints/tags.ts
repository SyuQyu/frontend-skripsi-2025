import axiosInstance from "@/lib/axiosInstance"

export function getPopularTags() {
  return axiosInstance.get("/tags/top/popular")
}

export function getAllTags() {
  return axiosInstance.get("/tags/all")
}
