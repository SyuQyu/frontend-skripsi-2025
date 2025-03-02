import Cookies from "js-cookie"

export const getAccessToken = () => Cookies.get("access_token")
export const getRefreshToken = () => Cookies.get("refresh_token")
export function setTokens(accessToken: string, refreshToken: string) {
  Cookies.set("access_token", accessToken, { expires: 1 })
  Cookies.set("refresh_token", refreshToken, { expires: 7 })
}
export function removeTokens() {
  Cookies.remove("access_token")
  Cookies.remove("refresh_token")
}
