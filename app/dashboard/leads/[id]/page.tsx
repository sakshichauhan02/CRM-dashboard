import { getLead } from '@/lib/actions/leads'
import { getUsers } from '@/lib/actions/users'
import { notFound } from 'next/navigation'
import { LeadForm } from '@/components/leads/form'
import { LeadDetails } from '@/components/leads/details'

export const dynamic = 'force-dynamic'

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const [lead, users] = await Promise.all([getLead(params.id), getUsers()])

  if (!lead) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{lead.name}</h1>
        <p className="text-gray-600">Lead Details</p>
      </div>
      <LeadDetails lead={lead} />
      <LeadForm users={users} lead={lead} />
    </div>
  )
}

