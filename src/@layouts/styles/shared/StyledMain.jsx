// Third-party Imports
import styled from '@emotion/styled'

// Config Imports
import themeConfig from '@configs/themeConfig'

const StyledMain = styled.main`
  padding: ${themeConfig.layoutPadding}px;
  flex: 1 1 auto;
  min-height: 0;
  /* padding-inline: ${({ isContentCompact }) => isContentCompact ? '0' : `${themeConfig.layoutPadding}px`}; */
  ${({ isContentCompact }) =>
    isContentCompact &&
    `
    margin-inline: auto;
    max-inline-size: ${themeConfig.compactContentWidth}px;
  `}
`

export default StyledMain
