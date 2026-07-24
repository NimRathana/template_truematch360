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

const RouteApp = ({ children }) => {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const token = getCookie('authToken')

    if (!token && isProtectedRoute(pathname)) {
      router.replace(`${routes.login}?from=${encodeURIComponent(pathname)}`)
    }
  }, [pathname, router])

  return <>{children}</>
}

export default RouteApp
