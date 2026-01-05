import { getTasks } from '@/lib/actions/tasks'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { TasksTable } from '@/components/tasks/table'

export const dynamic = 'force-dynamic'

export default async function TasksPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string }
}) {
  const session = await getServerSession(authOptions)
  const page = parseInt(searchParams.page || '1')
  const tasksData = await getTasks(page, 10, searchParams.status as any, session?.user?.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-gray-600">Manage your tasks and follow-ups</p>
        </div>
        <Link href="/dashboard/tasks/new">
          <Button>+ New Task</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
          <CardDescription>Total: {tasksData.total} tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <TasksTable tasks={tasksData.tasks} totalPages={tasksData.totalPages} currentPage={page} />
        </CardContent>
      </Card>
    </div>
  )
}

