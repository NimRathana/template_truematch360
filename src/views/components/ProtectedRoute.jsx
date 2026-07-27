'use client';

import { useRouter } from 'next/navigation';
import useAuthStore from '../store/useAuthStore'

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { access_token, hydrated } = useAuthStore()

  // ⏳ Wait until hydration finishes
  if (!hydrated) {
    return null 
  }

  // ❌ No token → login
  if (!access_token) {
    router.replace("/");
    return null;
  }

  // ✅ Token exists
  return children
}

