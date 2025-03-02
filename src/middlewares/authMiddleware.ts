import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { removeTokens, setTokens } from "@/lib/cookies"
import { refreshToken as refreshTokenEndpoint } from "@/endpoints/auth"

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

  // Redirect to home if already logged in and accessing login or other unprotected routes
  if (accessToken && unprotectedRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // If trying to access a protected route without a token, redirect to login
  if (!unprotectedRoutes.includes(req.nextUrl.pathname)) {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    else {
      const isTokenExpired = false // Token expiration logic goes here

      if (isTokenExpired && refreshToken) {
        try {
          const response = await refreshTokenEndpoint(refreshToken)
          if (response?.data?.access && response?.data?.refresh) {
            setTokens(response.data.access, response.data.refresh)
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
    }
  }

  return NextResponse.next()
}
