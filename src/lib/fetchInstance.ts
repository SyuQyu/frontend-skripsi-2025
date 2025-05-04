import { getAccessToken } from "@/lib/cookies"

const baseURL = process.env.NEXT_PUBLIC_API
interface FetchOptions extends RequestInit {
  retries?: number // Number of retry attempts
  retryDelay?: number // Initial delay before retrying (in ms)
}

export async function fetchInstance(url: string, options: FetchOptions = {}) {
  const { retries = 3, retryDelay = 500, ...fetchOptions } = options
  const token = getAccessToken() // Retrieve token from cookies

  const headers: HeadersInit = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...fetchOptions.headers,
  }

  // Jika body bukan FormData, baru tambahkan Content-Type: application/json
  if (!(fetchOptions.body instanceof FormData)) {
    (headers as Record<string, string>)["Content-Type"] = "application/json"
  } else {
    // pastikan kalau ada, hapus 'Content-Type'
    // headers.delete("Content-Type") hanya untuk Headers objek,  
    // jadi di sini kita override supaya tidak ada Content-Type
    if ("Content-Type" in headers) {
      delete headers["Content-Type"]
    }
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${baseURL}${url}`, {
        ...fetchOptions,
        headers,
      })

      if (response.ok) {
        return response.json()
      }

      // Handle rate-limiting (429 Too Many Requests)
      if (response.status === 429) {
        const retryAfter = Number.parseInt(response.headers.get("Retry-After") || "1", 10) * 1000
        await new Promise(resolve => setTimeout(resolve, retryAfter))
        continue // Retry the request
      }

      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    catch (error) {
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * 2 ** attempt)) // Exponential backoff
      }
      else {
        console.error("Fetch failed after retries:", error)
        throw error
      }
    }
  }
}
