'use client';

import ProtectedRoute from '@/components/AuthGuard';
import AppliedCandidates from '@views/pages/AppliedCandidates';

export default function AppliedCandidatesPage() {
  return (
    <ProtectedRoute>
      <AppliedCandidates />
    </ProtectedRoute>
  );
}





