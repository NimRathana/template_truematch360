'use client'

import AuthGuard from '@/components/AuthGuard'

export default function ProtectedRoute({ children }) {
  return <AuthGuard>{children}</AuthGuard>
}
