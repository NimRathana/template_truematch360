'use client';

import ProtectedRoute from '@/components/AuthGuard';
import Dashboard from '@views/pages/Dashboard';

export default function JobPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}

