'use client';

import ProtectedRoute from '@/components/AuthGuard';
import Jobposts from '@views/pages/MyJobs';

export default function JobPostsPage() {
  return (
    <ProtectedRoute>
      <Jobposts />
    </ProtectedRoute>
  );
}





