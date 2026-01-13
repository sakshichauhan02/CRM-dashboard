import { getCustomers } from '@/lib/actions/customers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils'
import { CustomersTable } from '@/components/customers/table'
import { CustomerSearch } from '@/components/customers/search'

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string }
}) {
  const page = parseInt(searchParams.page || '1')
  const customersData = await getCustomers(page, 10, searchParams.search)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-gray-600">Manage your customers</p>
        </div>
        <Link href="/dashboard/customers/new">
          <Button>+ New Customer</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
          <CardDescription>Total: {customersData.total} customers</CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerSearch />
          <CustomersTable customers={customersData.customers} totalPages={customersData.totalPages} currentPage={page} />
        </CardContent>
      </Card>
    </div>
  )
}

