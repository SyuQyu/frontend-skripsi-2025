import { fetchInstance } from "@/lib/fetchInstance"

interface GoodWordPayload {
  word: string
  badWordId: string
}

// Create a good word
export function createGoodWord(payload: GoodWordPayload) {
  return fetchInstance("/goodwords", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

// Get all good words
export function getAllGoodWords() {
  return fetchInstance("/goodwords/all")
}

// Get a good word by ID
export function getGoodWordById(goodWordId: string) {
  return fetchInstance(`/goodwords/${encodeURIComponent(goodWordId)}`)
}

// Update a good word
export function updateGoodWord(goodWordId: string, payload: GoodWordPayload) {
  return fetchInstance(`/goodwords/${encodeURIComponent(goodWordId)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  })
}

// Delete a good word
export function deleteGoodWord(goodWordId: string) {
  return fetchInstance(`/goodwords/${encodeURIComponent(goodWordId)}`, {
    method: "DELETE",
  })
}

export function bulkCreateGoodWords(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  return fetchInstance("/goodwords/bluk/create", {
    method: "POST",
    body: formData,
    // jangan set headers: { "Content-Type": "application/json" } atau apapun di sini!
  })
}
