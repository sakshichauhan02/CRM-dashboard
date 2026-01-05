import { getUsers } from '@/lib/actions/users'
import { getCustomers } from '@/lib/actions/customers'
import { DealForm } from '@/components/deals/form'

export default async function NewDealPage({
  searchParams,
}: {
  searchParams: { customerId?: string; leadId?: string }
}) {
  const [users, customers] = await Promise.all([getUsers(), getCustomers(1, 100)])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Deal</h1>
        <p className="text-gray-600">Create a new deal</p>
      </div>
      <DealForm users={users} customers={customers.customers} defaultCustomerId={searchParams.customerId} defaultLeadId={searchParams.leadId} />
    </div>
  )
}

