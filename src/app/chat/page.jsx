'use client';

import ProtectedRoute from '@/components/AuthGuard';
import ChatPage from '@views/pages/ChatPage';

export default function ChatPageRoute() {
  return (
    <ProtectedRoute>
      <ChatPage />  
    </ProtectedRoute>
  );
}





