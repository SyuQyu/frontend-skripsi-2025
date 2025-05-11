import process from "node:process"
import pkg from "@next/env"

const { loadEnvConfig } = pkg
// Memuat environment variables dari file .env
const projectDir = process.cwd()
loadEnvConfig(projectDir)

const nextConfig = {
  env: {
    NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API,
    NEXT_PUBLIC_FRONTEND: process.env.NEXT_PUBLIC_FRONTEND,
  },
  images: {
    domains: [
      "localhost",
      "anonchatku.space",
    ],
  },
}

export default nextConfig
