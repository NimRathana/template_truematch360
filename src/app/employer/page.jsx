'use client';

import MainLayout from '@views/layouts/MainLayout';
import ProtectedRoute from '@/components/AuthGuard';
import EmployerDashboard from '@views/pages/EmployerDashboard';

export default function EmployerDashboardPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <EmployerDashboard />
      </MainLayout>
    </ProtectedRoute>
  );
}



