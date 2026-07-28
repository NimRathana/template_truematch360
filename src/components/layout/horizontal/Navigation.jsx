'use client'

// Component & Core Hook Imports
import HorizontalMenu from './HorizontalMenu'
import { useSettings } from '@core/hooks/useSettings'
import useAuthStore from '@views/store/useAuthStore'

const Navigation = () => {
  // Hooks
  const { settings } = useSettings()
  const access_token = useAuthStore(state => state.access_token)

  // If layout is vertical, this component is not rendered
  if (settings.layout !== 'horizontal') return null

  // Hide horizontal menu when unauthenticated
  if (!access_token) return null
  
  return (
    <HorizontalMenu />
  )
}

export default Navigation