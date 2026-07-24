import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.18.11:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

api.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('authToken='))
      ?.split('=')[1]

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
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