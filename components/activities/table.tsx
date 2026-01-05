import { formatDate } from '@/lib/utils'
import Link from 'next/link'

interface ActivitiesTableProps {
  activities: any[]
  totalPages: number
  currentPage: number
}

export function ActivitiesTable({ activities, totalPages, currentPage }: ActivitiesTableProps) {
  const typeColors: Record<string, string> = {
    CALL: 'bg-blue-100 text-blue-800',
    EMAIL: 'bg-green-100 text-green-800',
    MEETING: 'bg-purple-100 text-purple-800',
    NOTE: 'bg-yellow-100 text-yellow-800',
    OTHER: 'bg-gray-100 text-gray-800',
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No activities found</p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${typeColors[activity.type]}`}>
                      {activity.type}
                    </span>
                    <h3 className="font-medium">{activity.title}</h3>
                  </div>
                  {activity.description && (
                    <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                  )}
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>By {activity.createdBy.name}</span>
                    <span>{formatDate(activity.activityDate)}</span>
                    {activity.lead && (
                      <Link href={`/dashboard/leads/${activity.lead.id}`} className="text-primary hover:underline">
                        Lead: {activity.lead.name}
                      </Link>
                    )}
                    {activity.customer && (
                      <Link href={`/dashboard/customers/${activity.customer.id}`} className="text-primary hover:underline">
                        Customer: {activity.customer.name}
                      </Link>
                    )}
                    {activity.deal && (
                      <Link href={`/dashboard/deals/${activity.deal.id}`} className="text-primary hover:underline">
                        Deal: {activity.deal.name}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          {currentPage > 1 && (
            <Link href={`/dashboard/activities?page=${currentPage - 1}`}>
              <button className="px-4 py-2 text-sm border rounded hover:bg-gray-50">Previous</button>
            </Link>
          )}
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link href={`/dashboard/activities?page=${currentPage + 1}`}>
              <button className="px-4 py-2 text-sm border rounded hover:bg-gray-50">Next</button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

