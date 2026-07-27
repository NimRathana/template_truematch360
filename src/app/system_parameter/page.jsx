'use client';

import MainLayout from '@views/layouts/MainLayout';
import ProtectedRoute from '@/components/AuthGuard';
import SystemParameter from '@views/pages/SystemParameter';

export default function SystemParameterPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <SystemParameter />
      </MainLayout>
    </ProtectedRoute>
  );
}



