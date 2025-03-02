import { create } from "zustand"
import Cookies from "js-cookie"
import { login, logout, refreshToken, register, resetPassword, verificationCheck, verificationSend, verifyToken } from "@/endpoints/auth"

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
  setCodeVerifcationPassword: (code: string) => void
  login: (email: string, password: string) => Promise<AuthResponse>
  register: (email: string, password: string, confirmPassword: string) => Promise<AuthResponse>
  logout: (refresh: string) => Promise<AuthResponse>
  verificationSend: (code_type: string, email: string) => Promise<AuthResponse>
  verificationCheck: (code_type: string, email: string, code: string) => Promise<AuthResponse>
  resetPassword: (email: string, password: string, confirmPassword: string, code: string) => Promise<AuthResponse | any>
  verifyToken: (token: string) => Promise<void>
  refreshToken: (refresh: string) => Promise<void>
}

const useAuthStore = create<AuthState>(set => ({
  user: null,
  error: null,
  isLoading: false,
  email: "",
  codeVerificationPassword: "",
  setCodeVerifcationPassword: (code) => {
    set({ codeVerificationPassword: code })
  },
  // Login function
  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const response = await login(email, password)
      Cookies.set("access_token", response.data.access, { expires: 1 })
      Cookies.set("refresh_token", response.data.refresh, { expires: 7 })

      // Ensure cookies are set properly before setting user state
      await new Promise(resolve => setTimeout(resolve, 50)) // Optional delay to ensure cookie setting

      set({ user: response.data, isLoading: false })
      return { data: response, error: false }
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
      if (code_type === "reset_password") {
        set({ codeVerificationPassword: code, email })
      }
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

      if (response.status >= 200 && response.status < 300) {
        set({ isLoading: false, email })
        return { data: response.data, error: false }
      }
      else {
        throw new Error(response.statusText || "Unknown error")
      }
    }
    catch (error: any) {
      set({
        error: error.response?.data || "Verification failed",
        isLoading: false,
      })
      return { error: true, message: error.response?.data || "Verification failed" }
    }
  },

  logout: async (refresh) => {
    set({ isLoading: true, error: null })
    try {
      const response = await logout(refresh)
      set({ user: null, isLoading: false })
      return { data: response.data, error: false }
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
      return
    }
    try {
      const response = await resetPassword(email, password, confirmPassword, code)
      if (response.status >= 200 && response.status < 300) {
        set({ isLoading: false, email })
        return { data: response.data, error: false }
      }
      else {
        throw new Error(response.statusText || "Unknown error")
      }
    }
    catch (error: any) {
      console.error("Error detail:", error)
      set({
        error: error.response?.data || "Verification failed",
        isLoading: false,
      })
      return { error: true, message: error.response?.data || "Verification failed" }
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
