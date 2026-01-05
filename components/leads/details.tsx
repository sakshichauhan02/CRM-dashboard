import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ConvertLeadDialog } from './convert-dialog'

interface LeadDetailsProps {
  lead: any
}

export function LeadDetails({ lead }: LeadDetailsProps) {
  const statusColors: Record<string, string> = {
    NEW: 'bg-blue-100 text-blue-800',
    CONTACTED: 'bg-yellow-100 text-yellow-800',
    QUALIFIED: 'bg-green-100 text-green-800',
    LOST: 'bg-red-100 text-red-800',
    CONVERTED: 'bg-purple-100 text-purple-800',
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Lead Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-sm">{lead.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-sm">{lead.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="text-sm">{lead.phone || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Source</p>
              <p className="text-sm">{lead.source.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[lead.status]}`}>
                {lead.status}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Assigned To</p>
              <p className="text-sm">{lead.assignedTo?.name || 'Unassigned'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Created</p>
              <p className="text-sm">{formatDate(lead.createdAt)}</p>
            </div>
          </div>
          {lead.notes && (
            <div>
              <p className="text-sm font-medium text-gray-500">Notes</p>
              <p className="text-sm">{lead.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {lead.status !== 'CONVERTED' && !lead.deal && (
            <ConvertLeadDialog leadId={lead.id} />
          )}
          {lead.deal && (
            <Link href={`/dashboard/deals/${lead.deal.id}`}>
              <Button className="w-full" variant="outline">
                View Deal
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

