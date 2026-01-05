import { getActivities } from '@/lib/actions/activities'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ActivitiesTable } from '@/components/activities/table'
import { CreateActivityDialog } from '@/components/activities/create-dialog'

export const dynamic = 'force-dynamic'

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: { page?: string; leadId?: string; customerId?: string; dealId?: string }
}) {
  const page = parseInt(searchParams.page || '1')
  const activitiesData = await getActivities(
    page,
    20,
    searchParams.leadId,
    searchParams.customerId,
    searchParams.dealId
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Activities</h1>
          <p className="text-gray-600">Track calls, emails, meetings, and notes</p>
        </div>
        <CreateActivityDialog leadId={searchParams.leadId} customerId={searchParams.customerId} dealId={searchParams.dealId} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Activities</CardTitle>
          <CardDescription>Total: {activitiesData.total} activities</CardDescription>
        </CardHeader>
        <CardContent>
          <ActivitiesTable activities={activitiesData.activities} totalPages={activitiesData.totalPages} currentPage={page} />
        </CardContent>
      </Card>
    </div>
  )
}

