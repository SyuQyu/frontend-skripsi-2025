import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPasswordStrength(password: string) {
  let strength = 0
  if (password.length >= 8)
    strength += 1
  if (/\d/.test(password))
    strength += 1
  if (/[^A-Z0-9]/i.test(password))
    strength += 1
  return strength
}

export function timeAgo(createdAt: any) {
  if (!createdAt || Number.isNaN(new Date(createdAt).getTime())) {
    return "Unknown time"
  }
  const createdDate = new Date(createdAt)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000)

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, "second")
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return rtf.format(-diffInMinutes, "minute")
  }
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return rtf.format(-diffInHours, "hour")
  }
  const diffInDays = Math.floor(diffInHours / 24)
  return rtf.format(-diffInDays, "day")
}

export function toLocalDateTime(dateString: string) {
  if (!dateString)
    return "No date available"

  let date: Date | null = null

  // Cek format DD/MM/YYYY, HH:mm:ss
  const localMatch = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2}):(\d{2})$/)
  if (localMatch) {
    // Urutan: hari/bulan/tahun
    const [, day, month, year, hour, minute, second] = localMatch.map(Number)
    date = new Date(year, month - 1, day, hour, minute, second)
  }
  else {
    // Fallback: ISO string atau format lain yang didukung JS
    date = new Date(dateString)
  }

  if (!date || Number.isNaN(date.getTime())) {
    return "Invalid date"
  }

  // Format: 6 December 2025 at 07:51
  const datePart = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const timePart = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })

  return `${datePart} at ${timePart}`
}
