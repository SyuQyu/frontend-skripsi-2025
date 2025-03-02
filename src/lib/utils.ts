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
