'use client';

import MainLayout from '@views/layouts/MainLayout';
import ProtectedRoute from '@/components/AuthGuard';
import AdminEmployer from '@views/pages/AdminEmployer';

export default function AdminEmployerPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <AdminEmployer />
      </MainLayout>
    </ProtectedRoute>
  );
}



