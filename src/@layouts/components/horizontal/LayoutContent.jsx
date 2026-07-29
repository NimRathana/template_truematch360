'use client'

import classnames from 'classnames'
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'
import StyledMain from '@layouts/styles/shared/StyledMain'
import { useSettings } from '@core/hooks/useSettings'

const LayoutContent = ({ children }) => {
  const { settings } = useSettings()
  const isContentCompact = settings.contentWidth === 'compact'

  return (
    <StyledMain
      isContentCompact={isContentCompact}
      className={classnames(horizontalLayoutClasses.content, horizontalLayoutClasses.contentCompact, 'flex-auto is-full')}
    >
      {children}
    </StyledMain>
  )
}

export default LayoutContent