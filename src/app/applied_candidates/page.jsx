'use client';

import MainLayout from '@views/layouts/MainLayout';
import ProtectedRoute from '@/components/AuthGuard';
import AppliedCandidates from '@views/pages/AppliedCandidates';

export default function AppliedCandidatesPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <AppliedCandidates />
      </MainLayout>
    </ProtectedRoute>
  );
}



