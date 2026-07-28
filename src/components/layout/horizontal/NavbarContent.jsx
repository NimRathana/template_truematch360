'use client'

// Third-party Imports
import classnames from 'classnames'

// MUI Imports
import { Box, IconButton, Stack } from '@mui/material'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'
import TranslateDropdown from '@components/layout/shared/TranslateDropdown'
import NavToggle from '../horizontal/NavToggle'
import useHorizontalNav from "@menu/hooks/useHorizontalNav";
import useAuthStore from '@views/store/useAuthStore'
import Button from '@mui/material/Button'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'
import themeConfig from '@configs/themeConfig'

const NavbarContent = () => {
  const { isBreakpointReached } = useHorizontalNav();
  const access_token = useAuthStore(state => state.access_token);
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Box
      className={classnames(horizontalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}
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
        
        {/* Show login/register when not authenticated, else show user dropdown */}
        {!access_token ? (
          <Stack direction="row" spacing={1.5} sx={{ ml: 1.5 }}>
            <Button size='small' variant='outlined' onClick={() => router.push('/login')}>
              {t ? t('login') : 'Login'}
            </Button>
            <Button size='small' variant='contained' onClick={() => router.push('/register')}>
              {t ? t('register') : 'Register'}
            </Button>
          </Stack>
        ) : (
          <UserDropdown />
        )}
      </div>
    </Box>
  )
}

export default NavbarContent