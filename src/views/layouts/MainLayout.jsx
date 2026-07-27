'use client';

import { Box } from '@mui/material';
import { usePathname } from 'next/navigation';
import Topbar from '../components/Topbar';
import Footer from '@components/layout/vertical/Footer';

function InnerLayout({ children }) {
  const pathname = usePathname();
  const isChatPage = pathname === '/chat';

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Topbar />
      <Box sx={{ p: isChatPage ? 0 : 1.5 }}>
        {children}
      </Box>
      {!isChatPage && (
        <Footer />
      )}
    </Box>
  );
}

export default function MainLayout({ children }) {
  return (
    <InnerLayout>{children}</InnerLayout>
  );
}

