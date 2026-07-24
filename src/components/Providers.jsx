import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'
import { HorizontalNavProvider } from '@menu/contexts/horizontalNavContext'
import { SettingsProvider } from '@core/contexts/settingsContext'
import CustomThemeProvider from './theme'
import { getMode, getSettingsFromCookie } from '@core/utils/serverHelpers'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import ClientCacheProvider from './ClientCacheProvider'
import rtlPlugin from 'stylis-plugin-rtl'
import { prefixer } from 'stylis'

const Providers = async props => {
  const { children } = props

  const mode = await getMode()
  const settingsCookie = await getSettingsFromCookie()

  const direction = settingsCookie?.direction || 'ltr'
  const cacheOptions = {
    prepend: true,
    key: direction === 'rtl' ? 'mui-rtl' : 'mui',
    stylisPlugins: direction === 'rtl' ? [prefixer, rtlPlugin] : []
  }

  return (
    <SettingsProvider settingsCookie={settingsCookie} mode={mode}>
      <VerticalNavProvider>
        <HorizontalNavProvider>
          <AppRouterCacheProvider CacheProvider={ClientCacheProvider} options={cacheOptions}>
            <CustomThemeProvider>
              {children}
            </CustomThemeProvider>
          </AppRouterCacheProvider>
        </HorizontalNavProvider>
      </VerticalNavProvider>
    </SettingsProvider>
  )
}

export default Providers