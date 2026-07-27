'use client';

import ProtectedRoute from '@/components/AuthGuard';
import AdminEmployer from '@views/pages/AdminEmployer';

export default function AdminEmployerPage() {
  return (
    <ProtectedRoute>
      
        <AdminEmployer />
      
    </ProtectedRoute>
  );
}





