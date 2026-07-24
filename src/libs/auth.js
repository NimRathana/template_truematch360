import useAuthStore from '@/store/useAuthStore'

export const saveAuthSession = ({ accessToken, refreshToken, userData, userType }) => {
    debugger
  const store = useAuthStore.getState()

  if (accessToken) {
    store.setAccessToken(accessToken)
  }

  if (refreshToken) {
    document.cookie = `refresh_token=${refreshToken}; Path=/; Max-Age=${60 * 60 * 24 * 30}`
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
