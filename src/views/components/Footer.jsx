// In your existing Footer.jsx
import { useTranslation } from 'react-i18next';
import { AboutDialog, PrivacyPolicyDialog, TermOfUseDialog, useDialogs } from '../pages/dialog_privacy/DialogComponents';
import { Box, Container, Stack, Typography } from '@mui/material';
import { Copyright } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { t } = useTranslation();
  const dialogs = useDialogs();
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Box component="footer" sx={{ color: 'grey.400', mt: 'auto' }}>
        <Container maxWidth="lg" sx={{ p: 0.01 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'center', sm: 'center' }}
            spacing={{ xs: 2, sm: 0 }}
            sx={{ fontSize: '0.875rem' }}
          >
            <Typography 
              variant="body2" 
              sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'grey.600' }}
            >
              <Copyright fontSize="inherit" /> {t('copyright', { year: currentYear })}
            </Typography>

            <Stack direction="row" spacing={3}>
              <Link 
                component="button"
                variant="body2"
                onClick={dialogs.about.onOpen}
                underline="hover"
                sx={{ color: 'primary.light' }}
              >
                {t('about_us')}
              </Link>
              <Link 
                component="button"
                variant="body2"
                onClick={dialogs.privacy.onOpen}
                underline="hover"
                sx={{ color: 'primary.light' }}
              >
                {t('privacy_policy')}
              </Link>
              <Link 
                component="button"
                variant="body2"
                onClick={dialogs.terms.onOpen}
                underline="hover"
                sx={{ color: 'primary.light' }}
              >
                {t('terms_of_use')}
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <AboutDialog open={dialogs.about.open} onClose={dialogs.about.onClose} />
      <PrivacyPolicyDialog open={dialogs.privacy.open} onClose={dialogs.privacy.onClose} />
      <TermOfUseDialog open={dialogs.terms.open} onClose={dialogs.terms.onClose} />
    </>
  );
}
