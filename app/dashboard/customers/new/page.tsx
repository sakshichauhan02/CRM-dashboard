import { CustomerForm } from '@/components/customers/form'

export default async function NewCustomerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Customer</h1>
        <p className="text-gray-600">Create a new customer</p>
      </div>
      <CustomerForm />
    </div>
  )
}

