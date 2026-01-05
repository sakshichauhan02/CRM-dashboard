'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface DashboardChartsProps {
  stats: {
    leadsByStatus: Array<{ status: string; _count: number }>
    monthlyRevenue: Array<{ month: string; revenue: number }>
  }
}

export function DashboardCharts({ stats }: DashboardChartsProps) {
  const leadsData = {
    labels: stats.leadsByStatus.map((item) => item.status),
    datasets: [
      {
        label: 'Leads',
        data: stats.leadsByStatus.map((item) => item._count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)',
          'rgba(16, 185, 129, 0.5)',
          'rgba(251, 191, 36, 0.5)',
          'rgba(239, 68, 68, 0.5)',
          'rgba(139, 92, 246, 0.5)',
        ],
      },
    ],
  }

  const revenueData = {
    labels: stats.monthlyRevenue.map((item) => item.month),
    datasets: [
      {
        label: 'Revenue',
        data: stats.monthlyRevenue.map((item) => item.revenue),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Leads by Status</CardTitle>
          <CardDescription>Distribution of leads across statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <Doughnut data={leadsData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
          <CardDescription>Revenue trend over the last 12 months</CardDescription>
        </CardHeader>
        <CardContent>
          <Line data={revenueData} />
        </CardContent>
      </Card>
    </div>
  )
}

