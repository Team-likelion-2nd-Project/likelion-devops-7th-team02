const ACCESS_TOKEN_KEY = 'accessToken'
const TOKEN_TYPE_KEY = 'tokenType'

export const getAccessToken = () => {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY)
}

export const setAccessToken = (accessToken) => {
  if (!accessToken) {
    return
  }

  sessionStorage.setItem(
    ACCESS_TOKEN_KEY,
    accessToken
  )
}

export const removeAccessToken = () => {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY)
}

export const getTokenType = () => {
  return (
    sessionStorage.getItem(TOKEN_TYPE_KEY) ||
    'Bearer'
  )
}

export const setTokenType = (tokenType) => {
  sessionStorage.setItem(
    TOKEN_TYPE_KEY,
    tokenType || 'Bearer'
  )
}

export const removeTokenType = () => {
  sessionStorage.removeItem(TOKEN_TYPE_KEY)
}

export const clearAuthStorage = () => {
  removeAccessToken()
  removeTokenType()
}