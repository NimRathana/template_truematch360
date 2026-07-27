'use client';

import MainLayout from '@views/layouts/MainLayout';
import ProtectedRoute from '@/components/AuthGuard';
import UpdateProfile from '@views/pages/profile/UpdateProfile';

export default function UpdateProfilePage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <UpdateProfile />
      </MainLayout>
    </ProtectedRoute>
  );
}



