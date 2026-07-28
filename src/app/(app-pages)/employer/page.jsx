'use client';

import ProtectedRoute from '@/components/AuthGuard';
import EmployerDashboard from '@views/pages/EmployerDashboard';

export default function EmployerDashboardPage() {
  return (
    <ProtectedRoute>
      <EmployerDashboard />
    </ProtectedRoute>
  );
}





