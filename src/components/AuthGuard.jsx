'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@views/store/useAuthStore'

const AuthGuard = ({ children }) => {
  const router = useRouter()
  const hydrated = useAuthStore(state => state.hydrated)
  const access_token = useAuthStore(state => state.access_token)

  useEffect(() => {
    // Ensure store hydrates from localStorage if needed
    if (!hydrated) {
      try { useAuthStore.getState().hydrate() } catch (e) { /* ignore */ }
      return
    }

    if (!access_token) {
      // Redirect unauthenticated users to public homepage/login
      router.replace('/')
    }
  }, [hydrated, access_token, router])

  // While not hydrated or being redirected, render nothing to avoid flashing protected content
  if (!hydrated) return null
  if (!access_token) return null

  return <>{children}</>
}

export default AuthGuard
