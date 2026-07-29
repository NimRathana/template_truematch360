'use client'

import { useMemo, useState, useEffect } from 'react'
import { ThemeProvider, extendTheme, lighten, darken } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import ModeChanger from './ModeChanger'
import { useSettings } from '@core/hooks/useSettings'
import defaultCoreTheme from '@core/theme'
import primaryColorConfig from '@configs/primaryColorConfig'
import { I18nextProvider } from 'react-i18next';
import i18n from '@configs/i18n';

const CustomThemeProvider = ({ children }) => {
  const { settings } = useSettings()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.documentElement.setAttribute('dir', settings.direction || 'ltr')
  }, [settings.direction])

  // Reflect primary color and skin into CSS custom properties so non-MUI styles update in real time
  useEffect(() => {
    const mainColor = settings.primaryColor || primaryColorConfig[0].main

    // Set simple vars used in styles
    try {
      document.documentElement.style.setProperty('--primary-color', mainColor)
      document.documentElement.style.setProperty('--mui-palette-primary-main', mainColor)

      // Convert HEX to RGB channels for *_Channel variables used in theme
      const hex = mainColor.replace('#', '')
      const r = parseInt(hex.substring(0, 2), 16)
      const g = parseInt(hex.substring(2, 4), 16)
      const b = parseInt(hex.substring(4, 6), 16)
      const channels = `${r} ${g} ${b}`
      document.documentElement.style.setProperty('--mui-palette-primary-mainChannel', channels)
      // Also set opacity variants if needed
      document.documentElement.style.setProperty('--mui-palette-primary-mainOpacity', `rgb(${channels} / 0.24)`)
    } catch (err) {
      // ignore in environments where document is not available
    }

    // Apply skin as data attribute so CSS can scope styles based on skin
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
    };

    return extendTheme({
      ...coreTheme,
      colorSchemes: {
        ...coreTheme.colorSchemes,
        light: {
          palette: {
            ...coreTheme.colorSchemes?.light?.palette,
            primary: primaryPalette,
          }
        },
        dark: {
          palette: {
            ...coreTheme.colorSchemes?.dark?.palette,
            primary: primaryPalette,
          }
        }
      },
      colorSchemeSelector: 'class'
    })
  }, [settings.primaryColor, settings.skin, settings.mode, settings.direction])

  useEffect(() => {
    setLoading(false)
  }, [theme])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ModeChanger />
      <I18nextProvider i18n={i18n}>
        {!loading && children}
      </I18nextProvider>
    </ThemeProvider>
  )
}

export default CustomThemeProvider