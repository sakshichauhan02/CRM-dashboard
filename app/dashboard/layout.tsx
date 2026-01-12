import { requireAuth } from '@/lib/middleware'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function Layout({ children }: { children: React.ReactNode }) {
  await requireAuth()
  
  return <DashboardLayout>{children}</DashboardLayout>
}

