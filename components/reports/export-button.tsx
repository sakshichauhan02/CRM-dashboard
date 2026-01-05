'use client'

import { Button } from '@/components/ui/button'

interface ExportReportsButtonProps {
  stats: any
  salesPerformance: any[]
}

export function ExportReportsButton({ stats, salesPerformance }: ExportReportsButtonProps) {
  const exportToCSV = () => {
    // Create CSV content
    const csvRows: string[] = []

    // Sales Performance
    csvRows.push('Sales Performance Report')
    csvRows.push('')
    csvRows.push('User,Email,Total Deals,Won Deals,Total Revenue,Conversion Rate')
    salesPerformance.forEach((user) => {
      csvRows.push(
        `"${user.name}","${user.email}",${user.totalDeals},${user.wonDeals},${user.totalRevenue},${user.conversionRate.toFixed(2)}%`
      )
    })

    csvRows.push('')
    csvRows.push('Overall Statistics')
    csvRows.push(`Total Leads,${stats.totalLeads}`)
    csvRows.push(`Active Customers,${stats.activeCustomers}`)
    csvRows.push(`Open Deals,${stats.openDeals}`)
    csvRows.push(`Total Revenue,${stats.totalRevenue}`)

    const csvContent = csvRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `crm-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <Button onClick={exportToCSV} variant="outline">
      Export to CSV
    </Button>
  )
}

