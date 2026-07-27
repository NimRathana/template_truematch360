'use client';

import MainLayout from '@views/layouts/MainLayout';
import ProtectedRoute from '@/components/AuthGuard';
import CandidateDashboard from '@views/pages/CandidateDashboard';

export default function CandidateDashboardPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <CandidateDashboard />
      </MainLayout>
    </ProtectedRoute>
  );
}



