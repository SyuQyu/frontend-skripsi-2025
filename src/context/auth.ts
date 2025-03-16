import { create } from "zustand"
import Cookies from "js-cookie"
import {
  getLoggedInUserData,
  login,
  logout,
  refreshToken,
  register,
  resetPassword,
  verificationCheck,
  verificationSend,
  verifyToken,
} from "@/endpoints/auth"
import { removeTokens } from "@/lib/cookies"

interface AuthResponse {
  data?: any
  error: boolean
  message?: any
}

interface AuthState {
  user: any
  error: string | null
  isLoading: boolean
  email: string
  codeVerificationPassword: string
  setCodeVerificationPassword: (code: string) => void
  login: (email: string, password: string) => Promise<AuthResponse>
  register: (email: string, password: string, confirmPassword: string) => Promise<AuthResponse>
  logout: (refresh: string) => Promise<AuthResponse>
  verificationSend: (code_type: string, email: string) => Promise<AuthResponse>
  verificationCheck: (code_type: string, email: string, code: string) => Promise<AuthResponse>
  resetPassword: (email: string, password: string, confirmPassword: string, code: string) => Promise<AuthResponse>
  verifyToken: (token: string) => Promise<void>
  refreshToken: (refresh: string) => Promise<void>
  getLoggedInUser: () => any
}

const useAuthStore = create<AuthState>(set => ({
  user: null,
  error: null,
  isLoading: false,
  email: "",
  codeVerificationPassword: "",

  setCodeVerificationPassword: code => set({ codeVerificationPassword: code }),

  getLoggedInUser: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await getLoggedInUserData()
      if (response.data.status === "success") {
        set({ user: response.data.user, isLoading: false })
        return response.data.user
      }
      else {
        set({ isLoading: false })
        throw new Error(response.data.message || "Failed to fetch user")
      }
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch user", isLoading: false })
    }
  },

  login: async (username, password) => {
    set({ isLoading: true, error: null })
    try {
      const response = await login(username, password)

      if (response.data.status === "success") {
        Cookies.set("access_token", response.data.accessToken, { expires: 1 })
        Cookies.set("refresh_token", response.data.refreshToken, { expires: 7 })

        set({ user: response.data, isLoading: false })
        return { data: response.data, error: false }
      }
      else {
        throw new Error(response.data.message || "Login failed")
      }
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Login failed", isLoading: false })
      return { error: true, message: error.response?.data || "Login failed" }
    }
  },

  register: async (email, password, confirmPassword) => {
    set({ isLoading: true, error: null })
    if (password !== confirmPassword) {
      set({ error: "Passwords do not match", isLoading: false })
      return { error: true, message: "Passwords do not match" }
    }
    try {
      const response = await register(email, password, confirmPassword)
      set({ user: response.data, isLoading: false, email })
      return { data: response.data, error: false }
    }
    catch (error: any) {
      set({ error: error.response?.data || "Registration failed", isLoading: false })
      return { error: true, message: error.response?.data || "Registration failed" }
    }
  },

  verificationCheck: async (code_type, email, code) => {
    set({ isLoading: true, error: null })
    try {
      const response = await verificationCheck(code_type, email, code)
      if (code_type === "reset_password")
        set({ codeVerificationPassword: code, email })
      set({ isLoading: false })
      return { data: response.data, error: false }
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Verification failed", isLoading: false })
      return { error: true, message: error.response?.data?.message || "Verification failed" }
    }
  },

  verificationSend: async (code_type, email) => {
    set({ isLoading: true, error: null })
    try {
      const response = await verificationSend(code_type, email)
      set({ isLoading: false, email })
      return { data: response.data, error: false }
    }
    catch (error: any) {
      set({ error: error.response?.data || "Verification failed", isLoading: false })
      return { error: true, message: error.response?.data || "Verification failed" }
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null })
    try {
      removeTokens()
      set({ user: null, isLoading: false })
      return { data: "Logout successful", error: false }
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Logout failed", isLoading: false })
      return { error: true, message: error.response?.data || "Logout failed" }
    }
  },

  resetPassword: async (email, password, confirmPassword, code) => {
    set({ isLoading: true, error: null })
    if (password !== confirmPassword) {
      set({ error: "Passwords do not match", isLoading: false })
      return { error: true, message: "Passwords do not match" }
    }
    try {
      const response = await resetPassword(email, password, confirmPassword, code)
      set({ isLoading: false, email })
      return { data: response.data, error: false }
    }
    catch (error: any) {
      set({ error: error.response?.data || "Password reset failed", isLoading: false })
      return { error: true, message: error.response?.data || "Password reset failed" }
    }
  },

  verifyToken: async (token) => {
    set({ isLoading: true, error: null })
    try {
      await verifyToken(token)
      set({ isLoading: false })
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Token verification failed", isLoading: false })
    }
  },

  refreshToken: async (refresh) => {
    set({ isLoading: true, error: null })
    try {
      await refreshToken(refresh)
      set({ isLoading: false })
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Token refresh failed", isLoading: false })
    }
  },
}))

export default useAuthStore
