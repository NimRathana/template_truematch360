'use client';

import ProtectedRoute from '@/components/AuthGuard';
import AdminUsers from '@views/pages/AdminUser';

export default function AdminUsersPage() {
  return (
    <ProtectedRoute>
      <AdminUsers />
    </ProtectedRoute>
  );
}





