// lib/api/users.ts

import { fetchInstance } from "@/lib/fetchInstance"

// Define User input type based on your Prisma schema
export interface CreateUserInput {
  roleId: string
  fullName?: string
  username: string
  email: string
  password: string
  phone?: string
  nim?: string
  faculty?: string
  gender?: string
  profilePicture?: string
  backgroundPicture?: string
}

// Creates a new user with optional file uploads
export function createUser(userData: CreateUserInput, profilePicture?: File, backgroundPicture?: File) {
  const formData = new FormData()

  // Append user data to FormData
  for (const key in userData) {
    if (userData[key as keyof CreateUserInput] !== undefined) {
      const value = userData[key as keyof CreateUserInput]
      if (value !== undefined) {
        formData.append(key, String(value))
      }
    }
  }

  // Append files if they exist
  if (profilePicture) {
    formData.append("profilePicture", profilePicture)
  }
  if (backgroundPicture) {
    formData.append("backgroundPicture", backgroundPicture)
  }

  return fetchInstance("/user", {
    method: "POST",
    body: formData,
  })
}

// Fetches all users
export function getAllUsers() {
  return fetchInstance("/user/all", {
    method: "GET",
  })
}

// Fetches user by ID
export function getUserById(userId: string) {
  return fetchInstance(`/user/${userId}`, {
    method: "GET",
  })
}

// Updates a user with optional file uploads
export function updateUser(userId: string, updatedData: Partial<CreateUserInput>, profilePicture?: File, backgroundPicture?: File) {
  const formData = new FormData()

  // Append updated data to FormData using a loop
  for (const key in updatedData) {
    if (updatedData[key as keyof Partial<CreateUserInput>] !== undefined) {
      const value = updatedData[key as keyof Partial<CreateUserInput>]
      if (value !== undefined) {
        formData.append(key, String(value))
      }
    }
  }

  // Append profilePicture if it exists
  if (profilePicture) {
    formData.append("profilePicture", profilePicture)
  }

  // Append backgroundPicture if it exists
  if (backgroundPicture) {
    formData.append("backgroundPicture", backgroundPicture)
  }

  return fetchInstance(`/user/${userId}`, {
    method: "PATCH",
    body: formData,
  })
}

// Deletes a user by ID
export function deleteUser(userId: string) {
  return fetchInstance(`/user/${userId}`, {
    method: "DELETE",
  })
}
