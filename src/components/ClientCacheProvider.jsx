'use client'

import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import rtlPlugin from 'stylis-plugin-rtl'
import { prefixer } from 'stylis'
import { useMemo } from 'react'
import { useSettings } from '@core/hooks/useSettings'

const ClientCacheProvider = ({ children }) => {
  const { settings } = useSettings()
  const direction = settings?.direction || 'ltr'

  const cache = useMemo(() => {
    const stylisPlugins = direction === 'rtl' ? [prefixer, rtlPlugin] : []
    return createCache({ key: direction === 'rtl' ? 'mui-rtl' : 'mui', prepend: true, stylisPlugins })
  }, [direction])

  return <CacheProvider value={cache}>{children}</CacheProvider>
}

export default ClientCacheProvider
