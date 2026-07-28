'use client';

import ProtectedRoute from '@/components/AuthGuard';
import AdminCandidate from '@views/pages/AdminCandidate';

export default function AdminCandidatePage() {
  return (
    <ProtectedRoute>
      <AdminCandidate />
    </ProtectedRoute>
  );
}





