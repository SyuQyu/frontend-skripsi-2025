import { createProxyMiddleware } from "http-proxy-middleware"

// Set up the proxy middleware without the /api prefix
export function addProxyMiddleware(app: any) {
  app.use(
    "/",
    createProxyMiddleware({
      target: process.env.PROXY_TARGET || "dev-api.traumaandempathy.com",
      changeOrigin: true,
    }),
  )
}
