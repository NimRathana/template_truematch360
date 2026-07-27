'use client';

import MainLayout from '@views/layouts/MainLayout';
import ProtectedRoute from '@/components/AuthGuard';
import AdminCandidate from '@views/pages/AdminCandidate';

export default function AdminCandidatePage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <AdminCandidate />
      </MainLayout>
    </ProtectedRoute>
  );
}



