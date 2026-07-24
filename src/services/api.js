import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
const AUTH_COOKIE_NAME = 'authToken'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
  withCredentials: true,
})

const getBearerToken = () => {
  if (typeof window === 'undefined') return ''

  const cookieToken = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${AUTH_COOKIE_NAME}=`))
    ?.split('=')[1]

  if (cookieToken) {
    return decodeURIComponent(cookieToken)
  }

  return window.localStorage.getItem('access_token') || ''
}

api.interceptors.request.use(config => {
  const token = getBearerToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    const message = error?.response?.data?.message || error?.response?.data?.detail || error?.message || 'Request failed'

    return Promise.reject(new Error(message))
  },
)

export default api