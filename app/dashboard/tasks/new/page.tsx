import { getUsers } from '@/lib/actions/users'
import { TaskForm } from '@/components/tasks/form'

export default async function NewTaskPage() {
  const users = await getUsers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Task</h1>
        <p className="text-gray-600">Create a new task</p>
      </div>
      <TaskForm users={users} />
    </div>
  )
}

