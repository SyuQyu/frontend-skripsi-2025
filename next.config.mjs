import process from "node:process"
import pkg from "@next/env"

const { loadEnvConfig } = pkg
// Memuat environment variables dari file .env
const projectDir = process.cwd()
loadEnvConfig(projectDir)

const nextConfig = {
  env: {
    API_URL: process.env.API_URL,
  },
}

export default nextConfig
