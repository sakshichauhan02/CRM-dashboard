import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { DeleteTaskForm } from './delete-form'

interface TasksTableProps {
  tasks: any[]
  totalPages: number
  currentPage: number
}

export function TasksTable({ tasks, totalPages, currentPage }: TasksTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Due Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Assigned To</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Related To</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No tasks found
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id} className="border-b">
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/tasks/${task.id}`} className="font-medium text-primary hover:underline">
                      {task.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{task.dueDate ? formatDate(task.dueDate) : '-'}</td>
                  <td className="px-4 py-3 text-sm">{task.assignedTo?.name || '-'}</td>
                  <td className="px-4 py-3 text-sm">
                    {task.lead && <Link href={`/dashboard/leads/${task.lead.id}`} className="text-primary hover:underline">Lead</Link>}
                    {task.customer && <Link href={`/dashboard/customers/${task.customer.id}`} className="text-primary hover:underline">Customer</Link>}
                    {task.deal && <Link href={`/dashboard/deals/${task.deal.id}`} className="text-primary hover:underline">Deal</Link>}
                    {!task.lead && !task.customer && !task.deal && '-'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Link href={`/dashboard/tasks/${task.id}`}>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </Link>
                      <DeleteTaskForm taskId={task.id} taskTitle={task.title} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          {currentPage > 1 && (
            <Link href={`/dashboard/tasks?page=${currentPage - 1}`}>
              <Button variant="outline" size="sm">Previous</Button>
            </Link>
          )}
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link href={`/dashboard/tasks?page=${currentPage + 1}`}>
              <Button variant="outline" size="sm">Next</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

