import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'

interface DealDetailsProps {
  deal: any
}

export function DealDetails({ deal }: DealDetailsProps) {
  const stageColors: Record<string, string> = {
    PROSPECT: 'bg-blue-100 text-blue-800',
    PROPOSAL: 'bg-yellow-100 text-yellow-800',
    NEGOTIATION: 'bg-orange-100 text-orange-800',
    WON: 'bg-green-100 text-green-800',
    LOST: 'bg-red-100 text-red-800',
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Deal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Deal Name</p>
              <p className="text-sm">{deal.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Value</p>
              <p className="text-sm font-semibold">{formatCurrency(deal.value)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Stage</p>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stageColors[deal.stage]}`}>
                {deal.stage}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Expected Close Date</p>
              <p className="text-sm">{deal.expectedCloseDate ? formatDate(deal.expectedCloseDate) : '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Customer</p>
              {deal.customer ? (
                <Link href={`/dashboard/customers/${deal.customer.id}`} className="text-sm text-primary hover:underline">
                  {deal.customer.name}
                </Link>
              ) : (
                <p className="text-sm">-</p>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Assigned To</p>
              <p className="text-sm">{deal.assignedTo?.name || 'Unassigned'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Created</p>
              <p className="text-sm">{formatDate(deal.createdAt)}</p>
            </div>
          </div>
          {deal.notes && (
            <div>
              <p className="text-sm font-medium text-gray-500">Notes</p>
              <p className="text-sm">{deal.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

