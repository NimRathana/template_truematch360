'use client';

import { Box } from '@mui/material';
import { usePathname } from 'next/navigation';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';

// Layout customizer button (shows theme customizer)
import LayoutCustomizerButton from '@components/layout/shared/LayoutCustomizerButton';
import useAuthStore from '../store/useAuthStore';

function InnerLayout({ children }) {
  const pathname = usePathname();
  const isChatPage = pathname === '/chat';

  const access_token = useAuthStore(state => state.access_token);

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

      {/* Show LayoutCustomizerButton when user is logged in */}
      <LayoutCustomizerButton isVisible={!!access_token} />
    </Box>
  );
}

export default function MainLayout({ children }) {
  return (
    <InnerLayout>{children}</InnerLayout>
  );
}

