'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

type ActivityType = 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE' | 'OTHER'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function getActivities(page: number = 1, pageSize: number = 20, leadId?: string, customerId?: string, dealId?: string) {
  const skip = (page - 1) * pageSize
  const where: any = {}

  if (leadId) {
    where.leadId = leadId
  }

  if (customerId) {
    where.customerId = customerId
  }

  if (dealId) {
    where.dealId = dealId
  }

  const [activities, total] = await Promise.all([
    prisma.activity.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { activityDate: 'desc' },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        lead: {
          select: { id: true, name: true },
        },
        customer: {
          select: { id: true, name: true },
        },
        deal: {
          select: { id: true, name: true },
        },
      },
    }),
    prisma.activity.count({ where }),
  ])

  return {
    activities,
    total,
    totalPages: Math.ceil(total / pageSize),
  }
}

export async function createActivity(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('Unauthorized')

  const type = formData.get('type') as ActivityType
  const title = formData.get('title') as string
  const description = formData.get('description') as string | null
  const activityDate = formData.get('activityDate') as string
  const leadId = formData.get('leadId') as string | null
  const customerId = formData.get('customerId') as string | null
  const dealId = formData.get('dealId') as string | null

  const activity = await prisma.activity.create({
    data: {
      type,
      title,
      description: description || null,
      activityDate: activityDate ? new Date(activityDate) : new Date(),
      createdById: session.user.id,
      leadId: leadId || null,
      customerId: customerId || null,
      dealId: dealId || null,
    },
  })

  revalidatePath('/dashboard/activities')
  return activity
}

