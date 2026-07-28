'use client';

import ProtectedRoute from '@/components/AuthGuard';
import UpdateProfile from '@views/pages/profile/UpdateProfile';

export default function UpdateProfilePage() {
  return (
    <ProtectedRoute>
      <UpdateProfile />
    </ProtectedRoute>
  );
}





