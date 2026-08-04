'use client'

// Third-party Imports
import classnames from 'classnames'
import { useState } from 'react'

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
import ChatDialog from '../../../views/components/chat/ChatDialog'
import { useUnreadStore } from "@views/store/unreadStore";

const NavbarContent = () => {
  const { isBreakpointReached } = useHorizontalNav();
  const access_token = useAuthStore(state => state.access_token);
  const globalUnread = useUnreadStore(state => state.globalCount);
  const isAuthenticated = Boolean(access_token)
  const router = useRouter();
  const { t } = useTranslation();

  const [chatOpen, setChatOpen] = useState(false)
  const getTheme = localStorage.getItem("mui-mode")
  const isDark = getTheme === "dark"

  const handleChatToggle = () => setChatOpen(prev => !prev)

  return (
    <>
      <Box
        className={classnames(horizontalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}
        sx={{
          paddingInline: `${themeConfig.layoutPadding}px`,
          transition: 'padding 0.3s ease',
          backgroundColor: 'transparent',
        }}
      >
        {/* LEFT: Logo & Search */}
        <div className='flex items-center gap-4 sm:gap-6' style={{ minWidth: 0, flexShrink: 0 }}>
          {isAuthenticated && <NavToggle />}
          {(!isAuthenticated || !isBreakpointReached) && <Logo />}
        </div>

        {/* RIGHT: System Utilities */}
        <div className='flex items-center gap-1.5'>
          {!isBreakpointReached && (
            <>
              {isAuthenticated && (
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <IconButton
                    onClick={handleChatToggle}
                  >
                    <i className='ri-message-3-line' />
                  </IconButton>
                  {globalUnread > 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -4,
                        right: -4,
                        width: 15,
                        height: 15,
                        bgcolor: '#f97316',
                        color: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: 10,
                      }}
                    >
                      {globalUnread > 9 ? '9+' : globalUnread}
                    </Box>
                  )}
                </Box>
              )}
              <TranslateDropdown />
              <ModeDropdown />
            </>
          )}

          {!isAuthenticated ? (
            <Stack direction="row" spacing={1.5} sx={{ ml: 1.5, flexWrap: 'nowrap', minWidth: 0 }}>
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
      <ChatDialog open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  )
}

export default NavbarContent