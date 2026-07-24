'use client'

// Component Imports
import LayoutNavbar from '@layouts/components/vertical/Navbar'
import NavbarContent from './NavbarContent'
import { useState, useEffect } from 'react'
import { useSettings } from '@core/hooks/useSettings'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const { settings } = useSettings()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <LayoutNavbar>
      <NavbarContent scrolled={scrolled} />
    </LayoutNavbar>
  )
}

export default Navbar
