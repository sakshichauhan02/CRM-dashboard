import { requireRole } from '@/lib/middleware'
import { getUsers } from '@/lib/actions/users'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UsersManagement } from '@/components/settings/users-management'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function SettingsPage() {
  await requireRole(['ADMIN', 'MANAGER'])
  const users = await getUsers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600">Manage CRM settings and users</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Create, edit, and manage user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <UsersManagement users={users} />
        </CardContent>
      </Card>
    </div>
  )
}

