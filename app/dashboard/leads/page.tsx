import { getLeads } from '@/lib/actions/leads'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { LeadFilters } from '@/components/leads/filters'
import { LeadsTable } from '@/components/leads/table'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; status?: string; source?: string }
}) {
  const page = parseInt(searchParams.page || '1')
  const leadsData = await getLeads(
    page,
    10,
    searchParams.search,
    searchParams.status as any,
    searchParams.source as any
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-gray-600">Manage and track your leads</p>
        </div>
        <Link href="/dashboard/leads/new">
          <Button>+ New Lead</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Leads</CardTitle>
          <CardDescription>Total: {leadsData.total} leads</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading filters...</div>}>
            <LeadFilters />
          </Suspense>
          <LeadsTable leads={leadsData.leads} totalPages={leadsData.totalPages} currentPage={page} />
        </CardContent>
      </Card>
    </div>
  )
}

