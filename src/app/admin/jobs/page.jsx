'use client';

import ProtectedRoute from '@/components/AuthGuard';
import AdminJobs from '@views/pages/AdminJobs';

export default function AdminJobsPage() {
  return (
    <ProtectedRoute>
      
        <AdminJobs />
      
    </ProtectedRoute>
  );
}





