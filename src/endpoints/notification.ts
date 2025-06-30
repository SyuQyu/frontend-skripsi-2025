import { fetchInstance } from "@/lib/fetchInstance"

export function getNotificationsByUser(userId: string) {
  return fetchInstance(`/notifications/user/${userId}`)
}

export function markNotificationAsRead(notificationId: string) {
  return fetchInstance(`/notifications/read/${notificationId}`, {
    method: "PUT",
  })
}

export function markAllNotificationsAsRead(userId: string) {
  return fetchInstance(`/notifications/read-all/${userId}`, {
    method: "PUT",
  })
}

export function deleteNotification(notificationId: string) {
  return fetchInstance(`/notifications/${notificationId}`, {
    method: "DELETE",
  })
}
