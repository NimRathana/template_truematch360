'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { isProtectedRoute, routes } from '@/configs/routes'

function getCookie(name) {
  if (typeof document === 'undefined') return ''

  const cookies = document.cookie.split(';').map(cookie => cookie.trim())

  for (const cookie of cookies) {
    if (cookie.startsWith(`${name}=`)) {
      return decodeURIComponent(cookie.split('=').slice(1).join('='))
    }
  }

  return ''
}

const AuthGuard = ({ children }) => {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const token = getCookie('authToken')
    const isAuthPage = [routes.login, routes.register, routes.forgotPassword].includes(pathname)

    if (!token && isProtectedRoute(pathname)) {
      const next = pathname + (window.location.search || '')
      router.replace(`${routes.login}?from=${encodeURIComponent(next)}`)
      return
    }

    if (token && isAuthPage) {
      router.replace(routes.dashboard)
    }
  }, [pathname, router])

  return <>{children}</>
}

export default AuthGuard
