'use client';

import Link from '@/components/Link';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import TopNav from '@/components/app-shell/TopNav';
import { routes } from '@/configs/routes';

const HomePage = () => {
  const { t } = useTranslation();
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <TopNav />
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Stack spacing={4} alignItems="flex-start">
          <Typography variant="h2" sx={{ fontWeight: 700, maxWidth: 700 }}>
            {t('Welcome to your modern app starter.', 'Welcome to your modern app starter.')}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700 }}>
            {t('This landing page now serves as the default entry point. Use the navbar to sign in or create an account, then the dashboard becomes available after authentication.', 'This landing page now serves as the default entry point. Use the navbar to sign in or create an account, then the dashboard becomes available after authentication.')}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button component={Link} href={routes.login} variant="contained" size="large">
              {t('Sign In', 'Sign In')}
            </Button>
            <Button component={Link} href={routes.register} variant="outlined" size="large">
              {t('Create Account', 'Create Account')}
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default HomePage;
