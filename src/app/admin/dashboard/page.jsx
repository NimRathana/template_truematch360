'use client';

import MainLayout from '@views/layouts/MainLayout';
import ProtectedRoute from '@/components/AuthGuard';
import AdminDashboard from '@views/pages/AdminDashboard';

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <AdminDashboard />
      </MainLayout>
    </ProtectedRoute>
  );
}



