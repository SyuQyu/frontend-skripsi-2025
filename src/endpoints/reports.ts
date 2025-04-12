import { fetchInstance } from "@/lib/fetchInstance"

export function createReport(payload: any) {
  return fetchInstance("/reports", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function getAllReports() {
  return fetchInstance("/reports/all")
}

export function getReportsByPostId(postId: string) {
  return fetchInstance(`/reports/post/${postId}`)
}

export function getReportsByReplyId(replyId: string) {
  return fetchInstance(`/reports/reply/${replyId}`)
}

export function getReportById(reportId: string) {
  return fetchInstance(`/reports/${reportId}`)
}

export function updateReport(reportId: string, payload: any) {
  return fetchInstance(`/reports/${reportId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  })
}

export function deleteReport(reportId: string) {
  return fetchInstance(`/reports/${reportId}`, {
    method: "DELETE",
  })
}
