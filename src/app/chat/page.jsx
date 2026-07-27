'use client';

import MainLayout from '@views/layouts/MainLayout';
import ProtectedRoute from '@/components/AuthGuard';
import ChatPage from '@views/pages/ChatPage';

export default function ChatPageRoute() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <ChatPage />
      </MainLayout>
    </ProtectedRoute>
  );
}



