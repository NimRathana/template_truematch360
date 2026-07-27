'use client';

import MainLayout from '@views/layouts/MainLayout';
import ProtectedRoute from '@/components/AuthGuard';
import Dashboard from '@views/pages/Dashboard';

export default function JobPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <Dashboard />
      </MainLayout>
    </ProtectedRoute>
  );
}
