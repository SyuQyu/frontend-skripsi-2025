import { fetchInstance } from "@/lib/fetchInstance"

interface CommonWordPayload {
  word: string
  description?: string
}

// CREATE
export function createCommonWord(payload: CommonWordPayload) {
  return fetchInstance("/commonwords", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

// READ ALL
export function getAllCommonWords() {
  return fetchInstance("/commonwords/all")
}

// READ BY ID
export function getCommonWordById(wordId: string) {
  return fetchInstance(`/commonwords/${encodeURIComponent(wordId)}`)
}

// UPDATE
export function updateCommonWord(wordId: string, payload: CommonWordPayload) {
  return fetchInstance(`/commonwords/${encodeURIComponent(wordId)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  })
}

// DELETE
export function deleteCommonWord(wordId: string) {
  return fetchInstance(`/commonwords/${encodeURIComponent(wordId)}`, {
    method: "DELETE",
  })
}
