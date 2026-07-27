'use client';

import ProtectedRoute from '@/components/AuthGuard';
import CandidateApply from '@views/pages/CandidateApply';

export default function CandidateApplyPage() {
  return (
    <ProtectedRoute>
      
        <CandidateApply />
      
    </ProtectedRoute>
  );
}





