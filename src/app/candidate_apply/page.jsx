'use client';

import MainLayout from '@views/layouts/MainLayout';
import ProtectedRoute from '@/components/AuthGuard';
import CandidateApply from '@views/pages/CandidateApply';

export default function CandidateApplyPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <CandidateApply />
      </MainLayout>
    </ProtectedRoute>
  );
}



