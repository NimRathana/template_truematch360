/* eslint-disable react-refresh/only-export-components */
// DialogComponents.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Container,
  Typography,
  Divider,
  Stack,
  Paper,
  Link as MuiLink,
} from '@mui/material';
import {
  Close as CloseIcon,
  InfoOutlineRounded,
  Security,
  Gavel,
  Email,
  LocationOn,
  Phone,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

// About Dialog Component
export function AboutDialog({ open, onClose }) {
  const { t } = useTranslation();

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          m: 2,
        }
      }}
    >
      <DialogTitle sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1, pr: 1 }}>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 4,
            bgcolor: "background.paper",
          }}
        >
          {/* Header */}
          <Stack alignItems="center" spacing={1.5} mb={0}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "primary.light",
                color: "white",
              }}
            >
              <InfoOutlineRounded fontSize="medium" />
            </Box>

            <Typography variant="h6" fontWeight={700}>
              {t('true_match_360')}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              maxWidth={320}
            >
              {t('about_tagline')}
            </Typography>
          </Stack>

          <Divider sx={{ mb: 3, mt: 2 }} />

          {/* About Content */}
          <Stack spacing={2.5}>
            <Typography
              variant="body2"
              color="text.secondary"
              lineHeight={1.8}
            >
              {t('about_founded')}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              lineHeight={1.8}
            >
              {t('about_mission')}
            </Typography>

            {/* Contact Section */}
            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 3,
                bgcolor: "grey.100",
                border: "2px solid",
                borderColor: "divider"
              }}
            >
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <LocationOn fontSize="small" color="primary" />
                  <Typography variant="body2">
                    {t('about_address')}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Phone fontSize="small" color="primary" />
                  <MuiLink
                    href="tel:+85512345678"
                    underline="hover"
                    color="primary"
                    variant="body2"
                  >
                    {t('about_phone')}
                  </MuiLink>
                </Stack>

                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Email fontSize="small" color="primary" />
                  <MuiLink
                    href="mailto:truematch360@gmail.com"
                    underline="hover"
                    color="primary"
                    variant="body2"
                  >
                    {t('about_email')}
                  </MuiLink>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </DialogContent>
    </Dialog>
  );
}

// Privacy Policy Dialog Component
export function PrivacyPolicyDialog({ open, onClose }) {
  const { t } = useTranslation();

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          m: 2,
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1, pr: 1 }}>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 4,
            bgcolor: "background.paper",
          }}
        >
          {/* Header */}
          <Stack alignItems="center" spacing={1.5} mb={4}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "primary.light",
                color: "white",
              }}
            >
              <Security fontSize="medium" />
            </Box>

            <Typography variant="h6" fontWeight={700}>
              {t('privacy_policy')}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              maxWidth={360}
            >
              {t('privacy_tagline')}
            </Typography>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* Content */}
          <Stack spacing={2.5}>
            <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
              {t('privacy_intro')}
            </Typography>

            <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
              {t('privacy_collection')}
            </Typography>

            <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
              {t('privacy_usage')}
            </Typography>

            <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
              {t('privacy_security')}
            </Typography>

            <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
              {t('privacy_agreement')}
            </Typography>
          </Stack>
        </Paper>
      </DialogContent>
    </Dialog>
  );
}

// Terms of Use Dialog Component
export function TermOfUseDialog({ open, onClose }) {
  const { t } = useTranslation();

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          m: 2,
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1, pr: 1 }}>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 4,
            bgcolor: "background.paper",
          }}
        >
          {/* Header */}
          <Stack alignItems="center" spacing={1.5} mb={2}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "primary.light",
                color: "white",
              }}
            >
              <Gavel fontSize="medium" />
            </Box>

            <Typography variant="h6" fontWeight={700}>
              {t('terms_of_use')}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              maxWidth={420}
            >
              {t('terms_tagline')}
            </Typography>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          {/* Content */}
          <Stack spacing={1.5}>
            <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
              {t('terms_intro')}
            </Typography>

            <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
              {t('terms_platform')}
            </Typography>

            <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
              {t('terms_account_responsibility')}
            </Typography>

            <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
              {t('terms_prohibited')}
            </Typography>

            <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
              {t('terms_suspension')}
            </Typography>

            <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
              {t('terms_updates')}
            </Typography>
          </Stack>
        </Paper>
      </DialogContent>
    </Dialog>
  );
}

// Updated Footer.jsx with dialog functionality
export function FooterWithDialogs() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  // State for dialogs
  const [aboutOpen, setAboutOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  return (
    <>
      <Box
        component="footer"
        sx={{
          color: 'grey.400',
          mt: 'auto',
        }}
      >
        <Container maxWidth="lg" sx={{ p: 0.01 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'center', sm: 'center' }}
            spacing={{ xs: 2, sm: 0 }}
            sx={{ fontSize: '0.875rem' }}
          >
            {/* Left – Copyright */}
            <Typography 
              variant="body2" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: 'grey.600',
              }}
            >
              <Copyright fontSize="inherit" /> {t('copyright', { year: currentYear })}
            </Typography>

            {/* Center – Quick important links */}
            <Stack direction="row" spacing={3}>
              <Link 
                component="button"
                variant="body2"
                onClick={() => setAboutOpen(true)}
                underline="hover"
                sx={{ color: 'primary.light', '&:hover': { color: 'primary.light' } }}
              >
                {t('about_us')}
              </Link>
              <Link 
                component="button"
                variant="body2"
                onClick={() => setPrivacyOpen(true)}
                underline="hover"
                sx={{ color: 'primary.light', '&:hover': { color: 'primary.light' } }}
              >
                {t('privacy_policy')}
              </Link>
              <Link 
                component="button"
                variant="body2"
                onClick={() => setTermsOpen(true)}
                underline="hover"
                sx={{ color: 'primary.light', '&:hover': { color: 'primary.light' } }}
              >
                {t('terms_of_use')}
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Dialogs */}
      <AboutDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <PrivacyPolicyDialog open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <TermOfUseDialog open={termsOpen} onClose={() => setTermsOpen(false)} />
    </>
  );
}

// Alternative: Hook for managing dialogs
export const useDialogs = () => {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  return {
    about: {
      open: aboutOpen,
      onOpen: () => setAboutOpen(true),
      onClose: () => setAboutOpen(false),
    },
    privacy: {
      open: privacyOpen,
      onOpen: () => setPrivacyOpen(true),
      onClose: () => setPrivacyOpen(false),
    },
    terms: {
      open: termsOpen,
      onOpen: () => setTermsOpen(true),
      onClose: () => setTermsOpen(false),
    },
  };
};
