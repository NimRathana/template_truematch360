'use client';

import { useEffect, useState } from 'react';
import Link from '@/components/Link';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import i18n from '@/configs/i18n';
import { routes } from '@/configs/routes';

function getCookie(name) {
  if (typeof document === 'undefined') return '';

  const cookies = document.cookie.split(';').map(cookie => cookie.trim());

  for (const cookie of cookies) {
    if (cookie.startsWith(`${name}=`)) {
      return decodeURIComponent(cookie.split('=').slice(1).join('='));
    }
  }

  return '';
}

const TopNav = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setIsAuthenticated(Boolean(getCookie('authToken')));
  }, []);

  const handleLanguageChange = language => {
    i18n.changeLanguage(language)
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: { xs: 2, md: 4 }, py: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Rathana Template
      </Typography>
      <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mr: 1 }}>
          <Button size="small" variant="text" onClick={() => handleLanguageChange('en')}>
            EN
          </Button>
          <Button size="small" variant="text" onClick={() => handleLanguageChange('fr')}>
            FR
          </Button>
          <Button size="small" variant="text" onClick={() => handleLanguageChange('km')}>
            KM
          </Button>
        </Stack>
        <Button component={Link} href={routes.home} color="inherit">
          {t('Home', 'Home')}
        </Button>
        {isAuthenticated ? (
          <Button component={Link} href={routes.dashboard} variant="contained">
            {t('Dashboard', 'Dashboard')}
          </Button>
        ) : (
          <>
            <Button component={Link} href={routes.login} variant="outlined">
              {t('Login', 'Login')}
            </Button>
            <Button component={Link} href={routes.register} variant="contained">
              {t('Register', 'Register')}
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default TopNav;
