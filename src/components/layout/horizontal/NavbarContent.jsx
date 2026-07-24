'use client'

// Third-party Imports
import classnames from 'classnames'

// MUI Imports
import { Box, IconButton } from '@mui/material'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import NavSearch from '@components/layout/shared/search'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'
import TranslateDropdown from '@components/layout/shared/TranslateDropdown'
import NavToggle from '../horizontal/NavToggle'
import useHorizontalNav from "@menu/hooks/useHorizontalNav";

// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'
import themeConfig from '@configs/themeConfig'

const NavbarContent = () => {
  const { isBreakpointReached } = useHorizontalNav();
  return (
    <Box
      className={classnames(
        horizontalLayoutClasses.navbarContent,
        'flex items-center justify-between gap-4 is-full'
      )}
      sx={{
        paddingInline: `${themeConfig.layoutPadding}px`,
        transition: 'padding 0.3s ease',
        backgroundColor: 'transparent',
      }}
    >
      {/* LEFT: Logo & Search */}
      <div className='flex items-center gap-4 sm:gap-6'>
        <NavToggle />
        {!isBreakpointReached && <Logo />}
      </div>

      {/* RIGHT: System Utilities */}
      <div className='flex items-center gap-1.5'>
        <TranslateDropdown />
        <ModeDropdown />
        
        <IconButton 
          sx={{
            color: "text.primary",
            transition: "transform 0.3s ease-in-out",
            "&:hover": { transform: "rotate(15deg)" },
          }}
        >
          <i className='ri-notification-2-line' />
        </IconButton>
        
        <UserDropdown />
      </div>
    </Box>
  )
}

export default NavbarContent