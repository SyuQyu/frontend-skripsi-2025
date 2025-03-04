import axios from "axios"

const axiosInstance = axios.create({
  baseURL: process.env.LOCAL_API || "http://localhost:4000",
  // headers: {
  //   "Access-Control-Allow-Origin": "*",
  //   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  //   "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
  // },
})

export default axiosInstance
