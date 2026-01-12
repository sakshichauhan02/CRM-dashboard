import { getUsers } from '@/lib/actions/users'
import { LeadForm } from '@/components/leads/form'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function NewLeadPage() {
  const users = await getUsers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Lead</h1>
        <p className="text-gray-600">Create a new lead</p>
      </div>
      <LeadForm users={users} />
    </div>
  )
}

