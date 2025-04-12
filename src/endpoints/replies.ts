import { fetchInstance } from "@/lib/fetchInstance"

export function createReplies(payload: any) {
  return fetchInstance("/replies", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function getAllReplies() {
  return fetchInstance("/replies/all")
}

export function deleteReplies(replyId: string) {
  return fetchInstance(`/replies/${replyId}`, {
    method: "DELETE",
  })
}
