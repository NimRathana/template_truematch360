'use client';

import MainLayout from '@views/layouts/MainLayout';
import ProtectedRoute from '@/components/AuthGuard';
import AdminUsers from '@views/pages/AdminUser';

export default function AdminUsersPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <AdminUsers />
      </MainLayout>
    </ProtectedRoute>
  );
}



