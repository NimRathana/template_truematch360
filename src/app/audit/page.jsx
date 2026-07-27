'use client';

import ProtectedRoute from '@/components/AuthGuard';
import Audit from '@views/pages/Audit';

export default function AuditPage() {
  return (
    <ProtectedRoute>
      <Audit /> 
    </ProtectedRoute>
  );
}





