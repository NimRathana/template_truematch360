'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import useAuthStore from '@views/store/useAuthStore'

const getRequiredUserTypes = (pathname) => {
  if (pathname?.startsWith('/admin')) return [1]
  if (pathname === '/system_parameter' || pathname === '/audit') return [1]

  return null
}

const getFallbackPath = (userType) => {
  if (userType === 2) return '/'
  if (userType === 3) return '/'

  return '/'
}

const AuthGuard = ({ children, allowedUserTypes }) => {
  const router = useRouter()
  const pathname = usePathname()
  const hydrated = useAuthStore(state => state.hydrated)
  const access_token = useAuthStore(state => state.access_token)
  const user_type = useAuthStore(state => state.user_type)

  useEffect(() => {
    // Ensure store hydrates from localStorage if needed
    if (!hydrated) {
      try { useAuthStore.getState().hydrate() } catch (e) { /* ignore */ }
      return
    }

    if (!access_token) {
      router.replace('/')
      return
    }

    const requiredUserTypes = allowedUserTypes ?? getRequiredUserTypes(pathname)

    if (requiredUserTypes?.length && !requiredUserTypes.includes(user_type)) {
      router.replace(getFallbackPath(user_type))
    }
  }, [access_token, allowedUserTypes, hydrated, pathname, router, user_type])

  // While not hydrated or being redirected, render nothing to avoid flashing protected content
  if (!hydrated) return null
  if (!access_token) return null

  const requiredUserTypes = allowedUserTypes ?? getRequiredUserTypes(pathname)

  if (requiredUserTypes?.length && !requiredUserTypes.includes(user_type)) return null

  return <>{children}</>
}

export default AuthGuard
