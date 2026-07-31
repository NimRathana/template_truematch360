'use client'

import { useEffect } from 'react'

export default function LayoutHeightVars() {
  useEffect(() => {
    const update = () => {
      const header = document.querySelector('header')
      const navbar = document.querySelector('header .ts-horizontal-layout-navbar')
      const nav = document.querySelector('header nav.ts-menu-root')
      const footer = document.querySelector('footer.ts-vertical-layout-footer') || document.querySelector('footer')
      const main = document.querySelector('main')
      const headerH = header ? Math.round(header.getBoundingClientRect().height) : 64
      const navbarH = navbar ? Math.round(navbar.getBoundingClientRect().height) : 0

      let navH = 0
      let navPaddingY = 0

      if (nav) {
        const style = getComputedStyle(nav)
        navPaddingY = (parseFloat(style.paddingTop) || 0) + (parseFloat(style.paddingBottom) || 0)
        navH = Math.max(0, Math.round(nav.getBoundingClientRect().height) - navPaddingY)
      }

      let footerH = 0
      let footerPaddingY = 0

      if (footer) {
        const style = getComputedStyle(footer)
        footerPaddingY = (parseFloat(style.paddingTop) || 0) + (parseFloat(style.paddingBottom) || 0)
        footerH = Math.max(0, Math.round(footer.getBoundingClientRect().height) - footerPaddingY)
      }

      let paddingTop = 24
      let paddingBottom = 24

      if (main) {
        const style = getComputedStyle(main)
        paddingTop = parseFloat(style.paddingTop) || 0
        paddingBottom = parseFloat(style.paddingBottom) || 0
      }

      const root = document.documentElement

      root.style.setProperty('--layout-header-height', `${headerH}px`)
      root.style.setProperty('--layout-navbar-height', `${navbarH}px`)
      root.style.setProperty('--layout-nav-height', `${navH}px`)
      root.style.setProperty('--footer-height', `${footerH}px`)

      root.style.setProperty('--layout-nav-padding-y', `${navPaddingY}px`)
      root.style.setProperty('--layout-footer-padding-y', `${footerPaddingY}px`)

      root.style.setProperty('--layout-padding-top', `${paddingTop}px`)
      root.style.setProperty('--layout-padding-bottom', `${paddingBottom}px`)
      root.style.setProperty('--layout-padding-y', `${paddingTop + paddingBottom}px`)
    }

    requestAnimationFrame(update)
    const t = setTimeout(update, 150)

    window.addEventListener('resize', update)

    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', update)
    }
  }, [])

  return null
}