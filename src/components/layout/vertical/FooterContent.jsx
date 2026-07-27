'use client'

import classnames from 'classnames'
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

import { Box, Container, Stack, Typography, Divider, Button } from '@mui/material'
import { Copyright } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

import {
  AboutDialog,
  PrivacyPolicyDialog,
  TermOfUseDialog,
  useDialogs
} from '@views/pages/dialog_privacy/DialogComponents'

const FooterContent = () => {
  const { t } = useTranslation()
  const dialogs = useDialogs()
  const currentYear = new Date().getFullYear()

  const linkButtonSx = {
    color: 'text.secondary',
    fontWeight: 500,
    fontSize: '0.875rem',
    textTransform: 'none',
    minWidth: 'auto',
    px: 1,
    py: 0.5,
    '&:hover': {
      color: 'primary.main',
      backgroundColor: 'transparent'
    }
  }

  return (
    <div
      className={classnames(
        verticalLayoutClasses.footerContent,
        'flex items-center justify-between flex-wrap gap-4'
      )}
    >
      <Box component='footer' sx={{ width: '100%' }}>
        <Container maxWidth='lg'>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent='space-between'
            alignItems='center'
            spacing={{ xs: 3, sm: 0 }}
          >
            {/* Copyright */}
            <Typography
              variant='body2'
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'text.secondary',
                fontWeight: 400
              }}
            >
              <Copyright sx={{ fontSize: 16, color: 'text.disabled' }} />
              {t('copyright', { year: currentYear })}
            </Typography>

            {/* Links */}
            <Stack
              direction='row'
              spacing={0.5}
              divider={
                <Divider
                  orientation='vertical'
                  flexItem
                  sx={{
                    borderColor: 'divider',
                    height: 16,
                    alignSelf: 'center',
                    mx: 0.5
                  }}
                />
              }
            >
              <Button
                variant='text'
                onClick={dialogs.about.onOpen}
                sx={linkButtonSx}
              >
                {t('about_us')}
              </Button>

              <Button
                variant='text'
                onClick={dialogs.privacy.onOpen}
                sx={linkButtonSx}
              >
                {t('privacy_policy')}
              </Button>

              <Button
                variant='text'
                onClick={dialogs.terms.onOpen}
                sx={linkButtonSx}
              >
                {t('terms_of_use')}
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Dialogs */}
      <AboutDialog open={dialogs.about.open} onClose={dialogs.about.onClose} />
      <PrivacyPolicyDialog
        open={dialogs.privacy.open}
        onClose={dialogs.privacy.onClose}
      />
      <TermOfUseDialog
        open={dialogs.terms.open}
        onClose={dialogs.terms.onClose}
      />
    </div>
  )
}

export default FooterContent