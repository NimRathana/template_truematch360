import useAuthStore from '@/store/useAuthStore'

const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7

const setCookie = (name, value, maxAge = ONE_WEEK_SECONDS) => {
  if (typeof document === 'undefined') return

  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`
}

export const saveAuthSession = ({ accessToken, refreshToken, userData, userType }) => {
  const store = useAuthStore.getState()

  if (accessToken) {
    setCookie('authToken', accessToken)
    store.setAccessToken(accessToken)
  }

  if (refreshToken) {
    setCookie('refresh_token', refreshToken, 60 * 60 * 24 * 30)
  }

  if (userData) {
    store.setUserData(userData)
  }

  if (userType !== undefined && userType !== null) {
    store.setUserType(userType)
  }
}

export const clearAuthSession = () => {
  const store = useAuthStore.getState()
  store.clearAccessToken()
  document.cookie = 'authToken=; Path=/; Max-Age=0'
  document.cookie = 'refresh_token=; Path=/; Max-Age=0'
}

export const getStoredToken = () => useAuthStore.getState().access_token

export default useAuthStore
