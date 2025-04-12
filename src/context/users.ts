// stores/useUserStore.ts

import { create } from "zustand"
import {
  CreateUserInput,
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "@/endpoints/users"
import useAuthStore from "./auth"

interface UserState {
  users: any[]
  selectedUser: any | null
  isLoading: boolean
  error: string | null
  fetchAllUsers: () => Promise<void>
  fetchUserById: (id: string) => Promise<void>
  addUser: (user: CreateUserInput) => Promise<void>
  editUser: (id: string, data: Partial<CreateUserInput>) => Promise<void>
  removeUser: (id: string) => Promise<void>
  clearSelectedUser: () => void
}

const useUserStore = create<UserState>(set => ({
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,

  fetchAllUsers: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await getAllUsers()
      set({ users: response.data, isLoading: false })
    }
    catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch users",
        isLoading: false,
      })
    }
  },

  fetchUserById: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await getUserById(id)
      set({ selectedUser: response.data, isLoading: false })
    }
    catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch user",
        isLoading: false,
      })
    }
  },

  addUser: async (user: CreateUserInput) => {
    set({ isLoading: true, error: null })
    try {
      await createUser(user)
      await useUserStore.getState().fetchAllUsers()
      set({ isLoading: false })
    }
    catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to create user",
        isLoading: false,
      })
    }
  },

  editUser: async (id: string, data: Partial<CreateUserInput>) => {
    set({ isLoading: true, error: null })
    try {
      const res = await updateUser(id, data)
      await useUserStore.getState().fetchAllUsers()
      await useAuthStore.getState().logout()
      set({ isLoading: false })
      return res
    }
    catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to update user",
        isLoading: false,
      })
    }
  },

  removeUser: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await deleteUser(id)
      await useUserStore.getState().fetchAllUsers()
      set({ isLoading: false })
    }
    catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to delete user",
        isLoading: false,
      })
    }
  },

  clearSelectedUser: () => {
    set({ selectedUser: null })
  },
}))

export default useUserStore
