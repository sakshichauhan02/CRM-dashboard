import { getTasks } from '@/lib/actions/tasks'
import { getUsers } from '@/lib/actions/users'
import { notFound } from 'next/navigation'
import { TaskForm } from '@/components/tasks/form'

export const dynamic = 'force-dynamic'

export default async function TaskDetailPage({ params }: { params: { id: string } }) {
  const [tasksData, users] = await Promise.all([getTasks(1, 1), getUsers()])
  const task = tasksData.tasks.find((t) => t.id === params.id)

  if (!task) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{task.title}</h1>
        <p className="text-gray-600">Task Details</p>
      </div>
      <TaskForm users={users} task={task} />
    </div>
  )
}

