'use server'

import { prisma } from '@/lib/db'

export async function getDashboardStats() {
  const [totalLeads, activeCustomers, openDeals, totalRevenue, leadsByStatus, monthlyRevenue] = await Promise.all([
    prisma.lead.count(),
    prisma.customer.count({ where: { status: 'ACTIVE' } }),
    prisma.deal.count({ where: { stage: { not: 'WON' } } }),
    prisma.deal.aggregate({
      where: { stage: 'WON' },
      _sum: { value: true },
    }),
    prisma.lead.groupBy({
      by: ['status'],
      _count: true,
    }),
    prisma.deal.findMany({
      where: {
        stage: 'WON',
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1),
        },
      },
      select: {
        value: true,
        createdAt: true,
      },
    }),
  ])

  // Group monthly revenue
  const monthlyRevenueMap: Record<string, number> = {}
  monthlyRevenue.forEach((deal) => {
    const month = deal.createdAt.toISOString().slice(0, 7)
    const value = Number(deal.value || 0)
    monthlyRevenueMap[month] = (monthlyRevenueMap[month] || 0) + value
  })

  const recentActivities = await prisma.activity.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      createdBy: {
        select: { name: true },
      },
    },
  })

  return {
    totalLeads,
    activeCustomers,
    openDeals,
    totalRevenue: Number(totalRevenue._sum.value || 0),
    leadsByStatus,
    monthlyRevenue: Object.entries(monthlyRevenueMap).map(([month, revenue]) => ({
      month,
      revenue,
    })),
    recentActivities,
  }
}

