import axios from "axios"

const axiosInstance = axios.create({
  baseURL: process.env.API_URL || "https://dev-api.traumaandempathy.com",
  // headers: {
  //   "Access-Control-Allow-Origin": "*",
  //   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  //   "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
  // },
})

export default axiosInstance
