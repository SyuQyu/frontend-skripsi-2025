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
}

export function createUser(userData: CreateUserInput) {
  return fetchInstance("/user", {
    method: "POST",
    body: JSON.stringify(userData),
  })
}

export function getAllUsers() {
  return fetchInstance("/user/all", {
    method: "GET",
  })
}

export function getUserById(userId: string) {
  return fetchInstance(`/user/${userId}`, {
    method: "GET",
  })
}

export function updateUser(userId: string, updatedData: Partial<CreateUserInput>) {
  return fetchInstance(`/user/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(updatedData),
  })
}

export function deleteUser(userId: string) {
  return fetchInstance(`/user/${userId}`, {
    method: "DELETE",
  })
}
