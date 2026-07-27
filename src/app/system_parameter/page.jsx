'use client';

import ProtectedRoute from '@/components/AuthGuard';
import SystemParameter from '@views/pages/SystemParameter';

export default function SystemParameterPage() {
  return (
    <ProtectedRoute>
      
        <SystemParameter />
      
    </ProtectedRoute>
  );
}





