'use client';

import MainLayout from '@views/layouts/MainLayout';
import ProtectedRoute from '@/components/AuthGuard';
import AdminJobs from '@views/pages/AdminJobs';

export default function AdminJobsPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <AdminJobs />
      </MainLayout>
    </ProtectedRoute>
  );
}



