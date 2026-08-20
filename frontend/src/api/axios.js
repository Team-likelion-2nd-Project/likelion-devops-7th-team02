import axios from 'axios'

import {
  getAccessToken,
  getTokenType,
} from '../utils/authStorage'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken()
  const tokenType = getTokenType()

  if (accessToken) {
    config.headers.Authorization = `${tokenType} ${accessToken}`
  }

  return config
})

export default api