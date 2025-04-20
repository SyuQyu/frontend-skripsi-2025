import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import { removeTokens, setTokens } from "@/lib/cookies"
import { refreshToken as refreshTokenEndpoint } from "@/endpoints/auth"

const ADMIN_PATH = "/admin"

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
      return NextResponse.redirect(new URL("/login", req.url))
    }
    else {
      const isTokenExpired = false // Add your token expiration logic here

      if (isTokenExpired && refreshToken) {
        try {
          const response = await refreshTokenEndpoint(refreshToken)
          if (response?.success === "success") {
            setTokens(refreshToken, response.accessToken)
          }
          else {
            removeTokens()
            return NextResponse.redirect(new URL("/login", req.url))
          }
        }
        catch (error) {
          console.error(error)
          removeTokens()
          return NextResponse.redirect(new URL("/login", req.url))
        }
      }
      else if (!refreshToken) {
        removeTokens()
        return NextResponse.redirect(new URL("/login", req.url))
      }

      // Check role if accessing /admin
      if (currentPath.startsWith(ADMIN_PATH)) {
        try {
          const decoded: any = jwt.decode(accessToken)
          const role = decoded?.roleName
          if (role !== "Admin") {
            return NextResponse.redirect(new URL("/", req.url)) // or "/unauthorized"
          }
        }
        catch (error) {
          console.error("Failed to decode token:", error)
          return NextResponse.redirect(new URL("/login", req.url))
        }
      }
    }
  }

  return NextResponse.next()
}
