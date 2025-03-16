import axios from "axios"
import { getAccessToken } from "@/lib/cookies"

const axiosInstance = axios.create({
  baseURL: process.env.LOCAL_API || "http://localhost:4000",
  // headers: {
  //   "Content-Type": "application/json",
  // },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken() // Retrieve token from cookies
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default axiosInstance
