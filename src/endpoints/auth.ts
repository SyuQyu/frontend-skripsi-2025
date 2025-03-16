import axiosInstance from "@/lib/axiosInstance"

export function login(username: string, password: string) {
  return axiosInstance.post("/auth/login", { username, password })
}

export function register(username: string, email: string, password: string) {
  return axiosInstance.post("/auth/register", { username, email, password })
}

export function logout(refresh: string) {
  return axiosInstance.post("/auth/logout", { refresh })
}

export function verificationSend(code_type: string, email: string) {
  return axiosInstance.post("/verification/send", { code_type, email })
}

export function verificationCheck(code_type: string, email: string, code: string) {
  return axiosInstance.post("/verification/verify", { code_type, email, code })
}

export function resetPassword(email: string, password: string, confirm_password: string, code: string) {
  return axiosInstance.post("/reset-password", { email, password, confirm_password, code })
}

export function verifyToken(token: string) {
  return axiosInstance.post("/verify-token", { token })
}

export function refreshToken(refresh: string) {
  return axiosInstance.post("/refresh-token", { refresh })
}

export function getLoggedInUserData() {
  return axiosInstance.get("/auth/data-logged-in")
}
