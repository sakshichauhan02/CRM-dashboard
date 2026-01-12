import { getDashboardStats } from '@/lib/actions/dashboard'
import { getUsers } from '@/lib/actions/users'
import { getLeads } from '@/lib/actions/leads'
import { getDeals } from '@/lib/actions/deals'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { ExportReportsButton } from '@/components/reports/export-button'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function ReportsPage() {
  const [stats, users, leadsData, dealsData] = await Promise.all([
    getDashboardStats(),
    getUsers(),
    getLeads(1, 1000),
    getDeals(1, 1000),
  ])

  // Calculate sales performance
  const salesPerformance = users.map((user) => {
    const userDeals = dealsData.deals.filter((d) => d.assignedToId === user.id)
    const wonDeals = userDeals.filter((d) => d.stage === 'WON')
    const totalRevenue = wonDeals.reduce((sum, d) => sum + Number(d.value || 0), 0)

    return {
      ...user,
      totalDeals: userDeals.length,
      wonDeals: wonDeals.length,
      totalRevenue,
      conversionRate: userDeals.length > 0 ? (wonDeals.length / userDeals.length) * 100 : 0,
    }
  })

  // Calculate conversion rates
  const totalLeads = leadsData.total
  const convertedLeads = leadsData.leads.filter((l) => l.status === 'CONVERTED').length
  const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-600">View comprehensive reports and analytics</p>
        </div>
        <ExportReportsButton stats={stats} salesPerformance={salesPerformance} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lead Conversion Rate</CardTitle>
            <CardDescription>Overall lead to customer conversion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{conversionRate.toFixed(1)}%</div>
            <p className="text-sm text-gray-600 mt-2">
              {convertedLeads} converted out of {totalLeads} total leads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>From all won deals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Performance by User</CardTitle>
          <CardDescription>Individual sales team performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {salesPerformance.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600">Total Deals</p>
                    <p className="font-semibold">{user.totalDeals}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Won Deals</p>
                    <p className="font-semibold">{user.wonDeals}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="font-semibold">{formatCurrency(user.totalRevenue)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Conversion</p>
                    <p className="font-semibold">{user.conversionRate.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

