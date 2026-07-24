'use client'

import React from 'react'
import classnames from 'classnames'

// Styled
import StyledHorizontalNav from '../styles/horizontal/StyledHorizontalNav'

const HorizontalNav = ({ height = 64, className, children, containerClassName, ...rest }) => {
  return (
    <StyledHorizontalNav height={height} className={classnames('materio-horizontal-nav', className)} {...rest}>
      <div className={classnames('materio-horizontal-container', containerClassName)}>
        {/* Place the menu items inside a ul so authors can pass <MenuItem/> components */}
        <ul className="materio-horizontal-menu">{children}</ul>
      </div>
    </StyledHorizontalNav>
  )
}

export default HorizontalNav
