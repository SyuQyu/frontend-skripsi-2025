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

export function IncrementReplyView(replyId: string, userId: string) {
  return fetchInstance(`/replies/increment/view`, {
    method: "POST",
    body: JSON.stringify({ replyId, userId }),
  })
}
