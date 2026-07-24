import Link from '@/components/Link';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import TopNav from '@/components/app-shell/TopNav';
import { routes } from '@/configs/routes';

const HomePage = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <TopNav />
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Stack spacing={4} alignItems="flex-start">
          <Typography variant="h2" sx={{ fontWeight: 700, maxWidth: 700 }}>
            Build a polished app experience from the start.
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700 }}>
            This project now opens on a public landing page with a top navigation, shared API setup, and a login flow that redirects you into the dashboard after a successful sign-in.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button component={Link} href={routes.login} variant="contained" size="large">
              Sign In
            </Button>
            <Button component={Link} href={routes.dashboard} variant="outlined" size="large">
              Open Dashboard
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default HomePage;
