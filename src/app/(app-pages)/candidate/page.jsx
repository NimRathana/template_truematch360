'use client';

import ProtectedRoute from '@/components/AuthGuard';
import CandidateDashboard from '@views/pages/CandidateDashboard';

export default function CandidateDashboardPage() {
  return (
    <ProtectedRoute>
      <CandidateDashboard />
    </ProtectedRoute>
  );
}





