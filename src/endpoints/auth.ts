import { fetchInstance } from "@/lib/fetchInstance"

export function login(username: string, password: string) {
  return fetchInstance("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  })
}

export function register(username: string, email: string, password: string) {
  return fetchInstance("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  })
}

export function logout(refresh: string) {
  return fetchInstance("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refresh }),
  })
}

export function verificationSend(code_type: string, email: string) {
  return fetchInstance("/verification/send", {
    method: "POST",
    body: JSON.stringify({ code_type, email }),
  })
}

export function verificationCheck(code_type: string, email: string, code: string) {
  return fetchInstance("/verification/verify", {
    method: "POST",
    body: JSON.stringify({ code_type, email, code }),
  })
}

// export function resetPassword(email: string, password: string, confirm_password: string, code: string) {
//   return fetchInstance("/reset-password", {
//     method: "POST",
//     body: JSON.stringify({ email, password, confirm_password, code }),
//   })
// }

export function verifyToken(token: string) {
  return fetchInstance("/verify-token", {
    method: "POST",
    body: JSON.stringify({ token }),
  })
}

export function refreshToken(refresh: string) {
  return fetchInstance("/refresh-token", {
    method: "POST",
    body: JSON.stringify({ refresh }),
  })
}

export function getLoggedInUserData() {
  return fetchInstance("/auth/data-logged-in")
}

export function checkPassword(userId: string, password: string) {
  return fetchInstance("/auth/check-password", {
    method: "POST",
    body: JSON.stringify({ userId, password }),
  })
}

export function resetPassword(userId: string, password: string) {
  return fetchInstance("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ userId, password }),
  })
}
