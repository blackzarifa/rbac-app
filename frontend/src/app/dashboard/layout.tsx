'use client'

import { useAuth } from '@/hooks/use-auth'
import ProtectedRoute from '@/components/auth/protected-route'
import DashboardLayout from '@/components/layout/dashboard-layout'

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  useAuth()

  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  )
}
