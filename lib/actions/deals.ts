'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

type DealStage = 'PROSPECT' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST'

export async function getDeals(page: number = 1, pageSize: number = 10, search?: string, stage?: DealStage) {
  const skip = (page - 1) * pageSize
  const where: any = {}

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { customer: { name: { contains: search, mode: 'insensitive' } } },
    ]
  }

  if (stage) {
    where.stage = stage
  }

  const [deals, total] = await Promise.all([
    prisma.deal.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: { id: true, name: true, email: true },
        },
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.deal.count({ where }),
  ])

  return {
    deals,
    total,
    totalPages: Math.ceil(total / pageSize),
  }
}

export async function getDealsByStage() {
  const deals = await prisma.deal.findMany({
    include: {
      customer: {
        select: { name: true },
      },
      assignedTo: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return {
    PROSPECT: deals.filter((d) => d.stage === 'PROSPECT'),
    PROPOSAL: deals.filter((d) => d.stage === 'PROPOSAL'),
    NEGOTIATION: deals.filter((d) => d.stage === 'NEGOTIATION'),
    WON: deals.filter((d) => d.stage === 'WON'),
    LOST: deals.filter((d) => d.stage === 'LOST'),
  }
}

export async function getDeal(id: string) {
  return prisma.deal.findUnique({
    where: { id },
    include: {
      customer: true,
      assignedTo: {
        select: { id: true, name: true, email: true },
      },
      activities: {
        include: {
          createdBy: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      tasks: {
        orderBy: { createdAt: 'desc' },
      },
      lead: true,
    },
  })
}

export async function createDeal(formData: FormData) {
  const name = formData.get('name') as string
  const value = parseFloat(formData.get('value') as string)
  const stage = (formData.get('stage') as DealStage) || 'PROSPECT'
  const expectedCloseDate = formData.get('expectedCloseDate') as string | null
  const assignedToId = formData.get('assignedToId') as string | null
  const customerId = formData.get('customerId') as string | null
  const leadId = formData.get('leadId') as string | null
  const notes = formData.get('notes') as string | null

  const deal = await prisma.deal.create({
    data: {
      name,
      value,
      stage,
      expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : null,
      assignedToId: assignedToId || null,
      customerId: customerId || null,
      leadId: leadId || null,
      notes: notes || null,
    },
  })

  revalidatePath('/dashboard/deals')
  return deal
}

export async function updateDeal(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const value = parseFloat(formData.get('value') as string)
  const stage = formData.get('stage') as DealStage
  const expectedCloseDate = formData.get('expectedCloseDate') as string | null
  const assignedToId = formData.get('assignedToId') as string | null
  const customerId = formData.get('customerId') as string | null
  const notes = formData.get('notes') as string | null

  const deal = await prisma.deal.update({
    where: { id },
    data: {
      name,
      value,
      stage,
      expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : null,
      assignedToId: assignedToId || null,
      customerId: customerId || null,
      notes: notes || null,
    },
  })

  revalidatePath('/dashboard/deals')
  revalidatePath(`/dashboard/deals/${id}`)
  return deal
}

export async function updateDealStage(id: string, stage: DealStage) {
  const deal = await prisma.deal.update({
    where: { id },
    data: { stage },
  })

  revalidatePath('/dashboard/deals')
  return deal
}

export async function deleteDeal(id: string) {
  await prisma.deal.delete({
    where: { id },
  })

  revalidatePath('/dashboard/deals')
}

