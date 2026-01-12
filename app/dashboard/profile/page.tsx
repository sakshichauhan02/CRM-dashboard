import { requireAuth } from '@/lib/middleware'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function ProfilePage() {
  const session = await requireAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-gray-600">Your account information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>View and manage your profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-sm">{session.user.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-sm">{session.user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Role</p>
              <p className="text-sm">{session.user.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

