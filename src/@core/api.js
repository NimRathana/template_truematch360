import axios from 'axios'

let apiInstance = null

async function getApiUrl() {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/config.json')
      if (res.ok) {
        const cfg = await res.json()
        if (cfg && cfg.API_URL) return cfg.API_URL
      }
    } catch (e) {
      // ignore and fallback
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://192.168.18.11:8000'
}

function getCookie(name) {
  if (typeof document === 'undefined') return null
  const parts = document.cookie.split(';').map(p => p.trim())
  for (const part of parts) {
    if (part.startsWith(name + '=')) return decodeURIComponent(part.split('=')[1] || '')
  }
  return null
}

export async function getApi() {
  if (apiInstance) return apiInstance

  const baseURL = await getApiUrl()

  apiInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
  })

  apiInstance.interceptors.request.use(config => {
    try {
      const token = getCookie('authToken')
      if (token && config && config.headers && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (e) {}
    return config
  })

  return apiInstance
}

export const apiClient = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL && (process.env.NEXT_PUBLIC_API_URL.startsWith('http') ? process.env.NEXT_PUBLIC_API_URL : 'http://' + process.env.NEXT_PUBLIC_API_URL)) || 'http://192.168.18.11:8000',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
})

apiClient.interceptors.request.use(config => {
  if (typeof document !== 'undefined') {
    const token = getCookie('authToken')
    if (token && config && config.headers && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

export default apiClient
