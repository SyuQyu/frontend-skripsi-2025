import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { removeTokens, setTokens } from "@/lib/cookies"
import { refreshToken as refreshTokenEndpoint } from "@/endpoints/auth"

const ADMIN_PATH = "/admin"

// Helper cek token expired berdasarkan exp claim JWT (exp = detik sejak epoch)
function isTokenExpired(token: string): boolean {
  try {
    const base64Url = token.split(".")[1]
    if (!base64Url)
      return true

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(c => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join(""),
    )
    const decoded: { exp?: number } = JSON.parse(jsonPayload)
    if (!decoded.exp)
      return true

    const currentTimeInSec = Math.floor(Date.now() / 1000)
    return decoded.exp <= currentTimeInSec
  }
  catch {
    // Jika gagal decode, anggap token invalid/expired
    return true
  }
}

export async function authMiddleware(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value
  const refreshToken = req.cookies.get("refresh_token")?.value

  const unprotectedRoutes = [
    "/login",
    "/contact-us",
    "/register/agreement",
    "/register/posting-rules",
    "/register/posting-rules/yes",
    "/register/form",
    "/register/verification-account",
    "/register/success",
    "/forgot-password/email",
    "/forgot-password/reset-password",
    "/forgot-password/verification-code",
    "/images/Logo.png",
  ]

  const currentPath = req.nextUrl.pathname

  // Redirect to home if already logged in and accessing unprotected route
  if (accessToken && unprotectedRoutes.includes(currentPath)) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // If trying to access a protected route without a token, redirect to login
  if (!unprotectedRoutes.includes(currentPath)) {
    if (!accessToken) {
      removeTokens()
      return NextResponse.redirect(new URL("/login", req.url))
    }
    else {
      // Cek access token expired
      const expired = isTokenExpired(accessToken)

      if (expired) {
        if (refreshToken) {
          try {
            const response = await refreshTokenEndpoint(refreshToken)

            if (response?.success === "success" && response.accessToken) {
              setTokens(refreshToken, response.accessToken)
            }
            else {
              removeTokens()
              return NextResponse.redirect(new URL("/login", req.url))
            }
          }
          catch (error) {
            console.error("Refresh token error:", error)
            removeTokens()
            return NextResponse.redirect(new URL("/login", req.url))
          }
        }
        else {
          removeTokens()
          return NextResponse.redirect(new URL("/login", req.url))
        }
      }

      // Jika token invalid atau tidak bisa decode, logout
      try {
        const base64Url = accessToken.split(".")[1]
        if (!base64Url)
          throw new Error("Invalid token")
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map(c => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
            .join(""),
        )
        const decoded: any = JSON.parse(jsonPayload)

        // Check role if accessing /admin
        if (currentPath.startsWith(ADMIN_PATH)) {
          const role = decoded?.roleName

          if (role !== "Admin" && role !== "SuperAdmin") {
            // Unauthorized access
            return NextResponse.redirect(new URL("/", req.url))
          }
        }
      }
      catch (error) {
        console.error("Failed to decode or invalid token:", error)
        removeTokens()
        return NextResponse.redirect(new URL("/login", req.url))
      }
    }
  }

  return NextResponse.next()
}
