'use client';

import ProtectedRoute from '@/components/AuthGuard';
import AdminDashboard from '@views/pages/AdminDashboard';

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  );
}





