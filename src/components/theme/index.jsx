'use client'

import { useMemo, useEffect } from 'react'
import { ThemeProvider, extendTheme, lighten, darken } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import ModeChanger from './ModeChanger'
import { useSettings } from '@core/hooks/useSettings'
import defaultCoreTheme from '@core/theme'
import primaryColorConfig from '@configs/primaryColorConfig'
import { I18nextProvider } from 'react-i18next'
import i18n from '@configs/i18n'

const CustomThemeProvider = ({ children }) => {
  const { settings } = useSettings()

  useEffect(() => {
    document.documentElement.setAttribute('dir', settings.direction || 'ltr')
  }, [settings.direction])

  useEffect(() => {
    const mainColor = settings.primaryColor || primaryColorConfig[0].main

    try {
      const lightColor = lighten(mainColor, 0.2)
      const darkColor = darken(mainColor, 0.1)
      const hex = mainColor.replace('#', '')
      const r = parseInt(hex.substring(0, 2), 16)
      const g = parseInt(hex.substring(2, 4), 16)
      const b = parseInt(hex.substring(4, 6), 16)
      const channels = `${r} ${g} ${b}`

      document.documentElement.style.setProperty('--primary-color', mainColor)
      document.documentElement.style.setProperty('--mui-palette-primary-main', mainColor)
      document.documentElement.style.setProperty('--mui-palette-primary-light', lightColor)
      document.documentElement.style.setProperty('--mui-palette-primary-dark', darkColor)
      document.documentElement.style.setProperty('--mui-palette-primary-mainChannel', channels)
      document.documentElement.style.setProperty('--mui-palette-primary-lighterOpacity', `rgb(${channels} / 0.08)`)
      document.documentElement.style.setProperty('--mui-palette-primary-lightOpacity', `rgb(${channels} / 0.16)`)
      document.documentElement.style.setProperty('--mui-palette-primary-mainOpacity', `rgb(${channels} / 0.24)`)
      document.documentElement.style.setProperty('--mui-palette-primary-darkOpacity', `rgb(${channels} / 0.32)`)
      document.documentElement.style.setProperty('--mui-palette-primary-darkerOpacity', `rgb(${channels} / 0.38)`)
      document.documentElement.style.setProperty('--mui-palette-primary-contrastText', '#ffffff')
    } catch (err) {
      // ignore if document is unavailable
    }

    try {
      if (settings.skin) document.documentElement.setAttribute('data-skin', settings.skin)
      else document.documentElement.removeAttribute('data-skin')
    } catch (err) {}
  }, [settings.primaryColor, settings.skin])

  const theme = useMemo(() => {
    const coreTheme = defaultCoreTheme(settings.mode || 'light', settings.direction || 'ltr', settings.skin || 'default')
    const mainColor = settings.primaryColor || primaryColorConfig[0].main

    const primaryPalette = {
      main: mainColor,
      light: lighten(mainColor, 0.2),
      dark: darken(mainColor, 0.1),
      contrastText: '#fff'
    }

    return extendTheme({
      ...coreTheme,
      colorSchemes: {
        ...coreTheme.colorSchemes,
        light: {
          ...coreTheme.colorSchemes?.light,
          palette: {
            ...(coreTheme.colorSchemes?.light?.palette || {}),
            primary: primaryPalette
          }
        },
        dark: {
          ...coreTheme.colorSchemes?.dark,
          palette: {
            ...(coreTheme.colorSchemes?.dark?.palette || {}),
            primary: primaryPalette
          }
        }
      },
      colorSchemeSelector: 'class',
      mainColorChannels: {
        light: '46 38 61',
        dark: '231 227 252',
        lightShadow: '46 38 61',
        darkShadow: '19 17 32'
      }
    })
  }, [settings.primaryColor, settings.skin, settings.mode, settings.direction])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ModeChanger />
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </ThemeProvider>
  )
}

export default CustomThemeProvider