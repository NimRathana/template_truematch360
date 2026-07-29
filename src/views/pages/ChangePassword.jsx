'use client'

import { useRouter } from 'next/navigation'
import ChangePasswordDialog from '@views/components/ChangePasswordDialog'

export default function ChangePasswordPage() {
  const router = useRouter()

  return (
    <ChangePasswordDialog
      open={true}
      onClose={() => router.replace('/')}
    />
  )
}
