'use client'

import IconButton from '@mui/material/IconButton'
import { useState } from 'react'
import classnames from 'classnames'
import { Box } from '@mui/material'

import NavToggle from './NavToggle'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'
import TranslateDropdown from '@components/layout/shared/TranslateDropdown'

import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
import themeConfig from '@configs/themeConfig'
import ChatDialog from '../../../views/components/chat/ChatDialog'
import useAuthStore from '@views/store/useAuthStore'
import { useUnreadStore } from "@views/store/unreadStore";

const NavbarContent = ({ scrolled, isHorizontal }) => {
  const access_token = useAuthStore(state => state.access_token);
  const globalUnread = useUnreadStore(state => state.globalCount);
  const isAuthenticated = Boolean(access_token)

  const [chatOpen, setChatOpen] = useState(false)
  const getTheme = localStorage.getItem("mui-mode")
  const isDark = getTheme === "dark"

  const handleChatToggle = () => setChatOpen(prev => !prev)

  return (
    <>
      <div
        style={{
          paddingInline: isHorizontal ? `${themeConfig.layoutPadding}px` : scrolled ? `${themeConfig.layoutPadding}px` : '0',
          transition: 'padding 0.3s ease',
        }}
        className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full px-4 sm:px-6')}
      >
        <div className='flex items-center gap-2 sm:gap-4'>
          <NavToggle />
          {/* <NavSearch /> */}
        </div>
        <div className='flex items-center'>
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
          <UserDropdown />
        </div>
      </div>
      <ChatDialog open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  )
}

export default NavbarContent
