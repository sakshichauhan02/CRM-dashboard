import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface CustomerDetailsProps {
  customer: any
}

export function CustomerDetails({ customer }: CustomerDetailsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-sm">{customer.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-sm">{customer.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="text-sm">{customer.phone || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Company</p>
              <p className="text-sm">{customer.company || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Industry</p>
              <p className="text-sm">{customer.industry || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Deal Value</p>
              <p className="text-sm">{formatCurrency(customer.totalDealValue)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${customer.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {customer.status}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Created</p>
              <p className="text-sm">{formatDate(customer.createdAt)}</p>
            </div>
          </div>
          {customer.notes && (
            <div>
              <p className="text-sm font-medium text-gray-500">Notes</p>
              <p className="text-sm">{customer.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Link href={`/dashboard/deals/new?customerId=${customer.id}`}>
            <Button className="w-full" variant="outline">
              Create Deal
            </Button>
          </Link>
        </CardContent>
      </Card>

      {customer.deals && customer.deals.length > 0 && (
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Deals ({customer.deals.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {customer.deals.map((deal: any) => (
                <Link key={deal.id} href={`/dashboard/deals/${deal.id}`}>
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="font-medium">{deal.name}</p>
                      <p className="text-sm text-gray-500">{deal.stage} - {formatCurrency(deal.value)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {customer.activities && customer.activities.length > 0 && (
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {customer.activities.slice(0, 5).map((activity: any) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.type} - {activity.createdBy.name} - {formatDate(activity.activityDate)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

