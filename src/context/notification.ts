import { create } from "zustand"
import {
  deleteNotification,
  getNotificationsByUser,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/endpoints/notification"

interface NotificationState {
  notifications: any[]
  isLoading: boolean
  error: string | null
  fetchNotificationsByUser: (userId: string) => Promise<void>
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: (userId: string) => Promise<void>
  removeNotification: (notificationId: string) => Promise<void>
}

const useNotificationStore = create<NotificationState>(set => ({
  notifications: [],
  isLoading: false,
  error: null,

  fetchNotificationsByUser: async (userId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await getNotificationsByUser(userId)
      set({ notifications: response.badWords || response.notifications || [], isLoading: false })
    }
    catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch notifications",
        isLoading: false,
      })
    }
  },

  markAsRead: async (notificationId) => {
    set({ isLoading: true, error: null })
    try {
      await markNotificationAsRead(notificationId)
      set(state => ({
        notifications: state.notifications.map(notif =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif,
        ),
        isLoading: false,
      }))
    }
    catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to mark as read",
        isLoading: false,
      })
    }
  },

  markAllAsRead: async (userId) => {
    set({ isLoading: true, error: null })
    try {
      await markAllNotificationsAsRead(userId)
      set(state => ({
        notifications: state.notifications.map(notif => ({ ...notif, isRead: true })),
        isLoading: false,
      }))
    }
    catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to mark all as read",
        isLoading: false,
      })
    }
  },

  removeNotification: async (notificationId) => {
    set({ isLoading: true, error: null })
    try {
      await deleteNotification(notificationId)
      set(state => ({
        notifications: state.notifications.filter(notif => notif.id !== notificationId),
        isLoading: false,
      }))
    }
    catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to delete notification",
        isLoading: false,
      })
    }
  },
}))

export default useNotificationStore
