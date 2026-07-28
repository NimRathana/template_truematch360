'use client'

import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import useAuthStore from '@views/store/useAuthStore'

import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'
import HorizontalLayout from '@layouts/HorizontalLayout'
import NotFound from '@views/NotFound'

import VerticalNavigation from '@components/layout/vertical/Navigation'
import VerticalNavbar from '@components/layout/vertical/Navbar'
import VerticalFooter from '@components/layout/vertical/Footer'
import HorizontalNavbar from '@components/layout/horizontal/Navbar'
import HorizontalNavigation from '@components/layout/horizontal/Navigation'
import HorizontalNav from '@menu/horizontal/HorizontalNav'

const AuthLayoutSwitcher = ({ children }) => {
  const pathname = usePathname()
  const hydrated = useAuthStore(state => state.hydrated)
  const access_token = useAuthStore(state => state.access_token)

  const normalizePath = path => path?.replace(/\/+$|\/+/g, '/') || ''
  const normalizedPath = normalizePath(pathname)
  const blankRoutes = ['/login', '/register', '/forgot-password', '/forgot_password', '/not-found', '/404']
  const isBlankPage = blankRoutes.some(route => normalizedPath === route || normalizedPath.startsWith(`${route}/`))

  useEffect(() => {
    // Ensure store reads from localStorage on first client render
    try {
      useAuthStore.getState().hydrate()
    } catch (err) {
      // swallow errors silently
      console.warn('Auth hydrate failed', err)
    }
  }, [])

  if (isBlankPage) return <>{children}</>

  const publicLayout = (
    <HorizontalNav customBreakpoint='800px'>
      <HorizontalLayout
        navbar={<HorizontalNavbar />}
        navigation={<HorizontalNavigation />}
        footer={<VerticalFooter />}
      >
        {children}
      </HorizontalLayout>
    </HorizontalNav>
  )

  if (!hydrated || !access_token) {
    return (
      <LayoutWrapper
        verticalLayout={publicLayout}
        horizontalLayout={publicLayout}
      />
    )
  }

  if (access_token) {
    return (
      <LayoutWrapper
        verticalLayout={
          <VerticalLayout
            navigation={<VerticalNavigation />}
            navbar={<VerticalNavbar />}
            footer={<VerticalFooter />}
          >
            {children}
          </VerticalLayout>
        }
        horizontalLayout={publicLayout}
      />
    )
  }

  return (
    <LayoutWrapper
      verticalLayout={publicLayout}
      horizontalLayout={publicLayout}
    />
  )
}

export default AuthLayoutSwitcher
