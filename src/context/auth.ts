import { create } from "zustand"
import Cookies from "js-cookie"
import {
  checkEmail,
  checkPassword,
  checkUsername,
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
  register: (username: string, email: string, password: string, confirmPassword: string) => Promise<AuthResponse>
  logout: (refresh?: string) => Promise<AuthResponse>
  verificationSend: (code_type: string, email: string) => Promise<AuthResponse>
  verificationCheck: (code_type: string, email: string, code: string) => Promise<AuthResponse>
  resetPassword: (email: string, password: string, confirmPassword: string, code: string) => Promise<AuthResponse>
  verifyToken: (token: string) => Promise<void>
  refreshToken: (refresh: string) => Promise<void>
  getLoggedInUser: () => any
  checkPassword: (userId: string, password: string) => Promise<any>
  checkUsername: (username: string) => Promise<AuthResponse>
  checkEmail: (email: string) => Promise<AuthResponse>
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  error: null,
  isLoading: false,
  email: "",
  codeVerificationPassword: "",

  setCodeVerificationPassword: code => set({ codeVerificationPassword: code }),
  checkUsername: async (username) => {
    set({ isLoading: true, error: null })
    try {
      const response = await checkUsername(username)
      set({ isLoading: false })
      return { data: response, error: false }
    }
    catch (error: any) {
      set({ error: error.response?.data || "Username check failed", isLoading: false })
      return { error: true, message: error.response?.data || "Username check failed" }
    }
  },

  checkEmail: async (email) => {
    set({ isLoading: true, error: null })
    try {
      const response = await checkEmail(email)
      set({ isLoading: false })
      return { data: response, error: false }
    }
    catch (error: any) {
      set({ error: error.response?.data || "Email check failed", isLoading: false })
      return { error: true, message: error.response?.data || "Email check failed" }
    }
  },
  getLoggedInUser: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await getLoggedInUserData()
      if (response.status === "success") {
        set({ user: response.user, isLoading: false })
        return response.user
      }
      else {
        set({ isLoading: false })
        get().logout()
        console.error("Error fetching user data:", response.message)
        throw new Error(response.message || "Failed to fetch user")
      }
    }
    catch (error: any) {
      get().logout()
      set({ error: error.response?.message || "Failed to fetch user", isLoading: false })
    }
  },

  login: async (username, password) => {
    set({ isLoading: true, error: null })
    try {
      const response = await login(username, password)
      if (response.status === "success") {
        Cookies.set("access_token", response.accessToken, { expires: 1 })
        Cookies.set("refresh_token", response.refreshToken, { expires: 7 })

        set({ user: response, isLoading: false })
        return { data: response, error: false }
      }
      else {
        throw new Error(response.message || "Login failed")
      }
    }
    catch (error: any) {
      set({ error: error.response?.message || "Login failed", isLoading: false })
      return { error: true, message: error.response?.data || "Login failed" }
    }
  },

  checkPassword: async (userId, password) => {
    set({ isLoading: true, error: null })
    try {
      const response = await checkPassword(userId, password)
      set({ isLoading: false })
      return { data: response, error: false }
    }
    catch (error: any) {
      set({ error: error.response?.data || "Password check failed", isLoading: false })
      return { error: true, message: error.response?.data || "Password check failed" }
    }
  },

  register: async (username, email, password, confirmPassword) => {
    set({ isLoading: true, error: null })

    if (password !== confirmPassword) {
      set({ error: "Passwords do not match", isLoading: false })
      return { error: true, message: "Passwords do not match" }
    }

    try {
      const response = await register(username, email, password)
      set({ user: response, isLoading: false, email })
      return { data: response, error: false }
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
      return { data: response, error: false }
    }
    catch (error: any) {
      set({ error: error.response?.message || "Verification failed", isLoading: false })
      return { error: true, message: error.response?.data?.message || "Verification failed" }
    }
  },

  verificationSend: async (code_type, email) => {
    set({ isLoading: true, error: null })
    try {
      const response = await verificationSend(code_type, email)
      set({ isLoading: false, email })
      return { data: response, error: false }
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
      set({ error: error.response?.message || "Logout failed", isLoading: false })
      return { error: true, message: error.response?.data || "Logout failed" }
    }
  },

  resetPassword: async (userId, password, confirmPassword) => {
    set({ isLoading: true, error: null })
    if (password !== confirmPassword) {
      set({ error: "Passwords do not match", isLoading: false })
      return { error: true, message: "Passwords do not match" }
    }
    try {
      const response = await resetPassword(userId, password)
      set({ isLoading: false })
      return { data: response, error: false }
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
      const res = await refreshToken(refresh)
      set({ isLoading: false })
      return res
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Token refresh failed", isLoading: false })
    }
  },
}))

export default useAuthStore
