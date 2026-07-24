'use client';

import dynamic from 'next/dynamic';
import Link from '@/components/Link';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import TopNav from '@/components/app-shell/TopNav';
import { routes } from '@/configs/routes';

const Dashboard = dynamic(() => import('../components/app-shell/Dashboard'), {
  ssr: false,
});

const HomePage = () => {
  const { t } = useTranslation();
  return (
    <Box>
      <TopNav />
      <Dashboard />
    </Box>
  );
};

export default HomePage;
