import { getDeal } from '@/lib/actions/deals'
import { getUsers } from '@/lib/actions/users'
import { getCustomers } from '@/lib/actions/customers'
import { notFound } from 'next/navigation'
import { DealForm } from '@/components/deals/form'
import { DealDetails } from '@/components/deals/details'

export default async function DealDetailPage({ params }: { params: { id: string } }) {
  const [deal, users, customersData] = await Promise.all([
    getDeal(params.id),
    getUsers(),
    getCustomers(1, 100),
  ])

  if (!deal) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{deal.name}</h1>
        <p className="text-gray-600">Deal Details</p>
      </div>
      <DealDetails deal={deal} />
      <DealForm users={users} customers={customersData.customers} deal={deal} />
    </div>
  )
}

