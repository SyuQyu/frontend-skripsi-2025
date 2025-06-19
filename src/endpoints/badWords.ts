import { fetchInstance } from "@/lib/fetchInstance"

interface BadWordPayload {
  word: string
}

// Create a bad word
export function createBadWord(payload: BadWordPayload) {
  return fetchInstance("/badwords", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

// Get all bad words
export function getAllBadWords(page: number = 1, limit: number = 10) {
  return fetchInstance(`/badwords/all?page=${page}&limit=${limit}`)
}

export function getAllBadWordsWithoutPagination() {
  return fetchInstance("/badwords/all-without-pagination")
}

// Get bad word by ID
export function getBadWordById(badWordId: string) {
  return fetchInstance(`/badwords/${encodeURIComponent(badWordId)}`)
}

// Update bad word by ID
export function updateBadWord(badWordId: string, payload: BadWordPayload) {
  return fetchInstance(`/badwords/${encodeURIComponent(badWordId)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  })
}

// Delete bad word by ID
export function deleteBadWord(badWordId: string) {
  return fetchInstance(`/badwords/${encodeURIComponent(badWordId)}`, {
    method: "DELETE",
  })
}

// Check if a word is a bad word
export function checkBadWord(word: string) {
  return fetchInstance(`/badwords/check/${encodeURIComponent(word)}`)
}

export function checkBadWordNotExact(word: string, page: number = 1, limit: number = 10) {
  return fetchInstance(`/badwords/check-not-exact/${encodeURIComponent(word)}?page=${page}&limit=${limit}`)
}
