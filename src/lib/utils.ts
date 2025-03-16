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
  const createdDate = new Date(createdAt)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000)

  const rtf = new Intl.RelativeTimeFormat("id", { numeric: "auto" })

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
