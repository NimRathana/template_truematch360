'use client';

import Link from '@/components/Link';
import { Box, Button, Stack, Typography } from '@mui/material';
import { routes } from '@/configs/routes';

const TopNav = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 4, py: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Rathana Template
      </Typography>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Button component={Link} href={routes.home} color="inherit">
          Home
        </Button>
        <Button component={Link} href={routes.login} variant="outlined">
          Login
        </Button>
        <Button component={Link} href={routes.register} variant="contained">
          Register
        </Button>
        <Button component={Link} href={routes.dashboard} variant="text">
          Dashboard
        </Button>
      </Stack>
    </Box>
  );
};

export default TopNav;
