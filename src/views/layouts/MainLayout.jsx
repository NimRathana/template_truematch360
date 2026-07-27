import { Box } from '@mui/material';
import { BrowserRouter, useLocation } from 'react-router-dom';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';

function InnerLayout({ children }) {
  const location = useLocation();
  const isChatPage = location?.pathname === '/chat';

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: '#F4F1F1',
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
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <InnerLayout>{children}</InnerLayout>
    </BrowserRouter>
  );
}

