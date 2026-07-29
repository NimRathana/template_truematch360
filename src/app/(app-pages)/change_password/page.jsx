'use client';

import ProtectedRoute from '@/components/AuthGuard';
import ChangePasswordPage from '@views/pages/ChangePassword';

export default function ChangePasswordRoute() {
  return (
    <ProtectedRoute>
      <ChangePasswordPage />
    </ProtectedRoute>
  );
}
