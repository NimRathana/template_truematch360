'use client'

import { useEffect } from 'react'
import useAuthStore from '@views/store/useAuthStore'

import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'
import HorizontalLayout from '@layouts/HorizontalLayout'

import VerticalNavigation from '@components/layout/vertical/Navigation'
import VerticalNavbar from '@components/layout/vertical/Navbar'
import VerticalFooter from '@components/layout/vertical/Footer'
import HorizontalNavbar from '@components/layout/horizontal/Navbar'
import HorizontalNavigation from '@components/layout/horizontal/Navigation'
import HorizontalNav from '@menu/horizontal/HorizontalNav'

import MainLayout from '@views/layouts/MainLayout'

const AuthLayoutSwitcher = ({ children }) => {
  const hydrated = useAuthStore(state => state.hydrated)
  const access_token = useAuthStore(state => state.access_token)

  useEffect(() => {
    // Ensure store reads from localStorage on first client render
    try {
      useAuthStore.getState().hydrate()
    } catch (err) {
      // swallow errors silently
      console.warn('Auth hydrate failed', err)
    }
  }, [])

  // While not hydrated, render public MainLayout to avoid blank screen
  if (!hydrated) return <MainLayout>{children}</MainLayout>

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
        horizontalLayout={
          <HorizontalNav customBreakpoint='800px'>
            <HorizontalLayout
              navbar={<HorizontalNavbar />}
              navigation={<HorizontalNavigation />}
              footer={<VerticalFooter />}
            >
              {children}
            </HorizontalLayout>
          </HorizontalNav>
        }
      />
    )
  }

  return <MainLayout>{children}</MainLayout>
}

export default AuthLayoutSwitcher
