import { getCustomer } from '@/lib/actions/customers'
import { notFound } from 'next/navigation'
import { CustomerForm } from '@/components/customers/form'
import { CustomerDetails } from '@/components/customers/details'

export const dynamic = 'force-dynamic'

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
  const customer = await getCustomer(params.id)

  if (!customer) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{customer.name}</h1>
        <p className="text-gray-600">Customer Details</p>
      </div>
      <CustomerDetails customer={customer} />
      <CustomerForm customer={customer} />
    </div>
  )
}

